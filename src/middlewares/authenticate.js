import createHttpError from 'http-errors';
import { getSession, getUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  // const { authorization } = req.headers;
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header not found'));
  }
  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must be Bearer type'));
  }

  const session = await getSession({ accessToken });
  // console.log(session.userId);
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await getUser(session.userId);
  // console.log(user);
  if (!user) {
    return next(createHttpError(401, 'User non found'));
  }

  req.user = user;

  next();
};
