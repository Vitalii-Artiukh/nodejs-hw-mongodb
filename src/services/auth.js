import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { UsersCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { sendEmail } from '../utils/sendEmail.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

const sendVerifyEmail = async (name, email) => {
  const token = jwt.sign(
    {
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const verifyEmailTemplatePath = path.join(
    TEMPLATES_DIR,
    'verifyUserEmail.html',
  );

  const templateSource = (
    await fs.readFile(verifyEmailTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: name,
    link: `${getEnvVar('APP_DOMAIN')}/auth/verify-email?token=${token}`,
  });

  const verifyEmail = {
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Confirm your email',
    html,
  };

  try {
    await sendEmail(verifyEmail);
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
  }
};

export const registerUser = async (payload) => {
  const { name, email, password } = payload;
  const user = await UsersCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'User already exist');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });

  await sendVerifyEmail(payload.name, payload.email);

  const { _id } = newUser;

  return {
    name,
    email,
    _id,
  };
};

export const verifyEmail = async (token) => {
  try {
    const { email } = jwt.verify(token, getEnvVar('JWT_SECRET'));
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    await UsersCollection.updateOne({ email }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  const name = user.name;
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    await sendVerifyEmail(name, email);
    throw createHttpError(401, 'Please verify your email');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async (payload) => {
  const session = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Refresh token invalid');
  }
  const isSessionTokenExpired = Date.now() > session.refreshTokenValidUntil;
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: payload.sessionId });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetEmailToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'resetPasswordEmail.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
  }
};

export const resetPasswordLink = async (token) => {
  try {
    jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  return { token };
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const hashPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: hashPassword },
  );
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401, 'Unauthorized');

  let user = await UsersCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }
  const newSession = createSession();
  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const getUser = (filter) => UsersCollection.findOne(filter);

export const getSession = (filter) => SessionCollection.findOne(filter);
