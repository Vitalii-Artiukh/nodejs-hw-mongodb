import Joi from 'joi';
import { emailRegExp } from '../constants/users.js';

export const registerValidationUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(8).required(),
});

export const loginValidationUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(8).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  token: Joi.string().required(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
