import Joi from 'joi';
import { emailRegExp } from '../constants/users.js';

export const registerValidationUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().pattern(emailRegExp).required(),
  password: Joi.string().min(8).required(),
});

export const loginValidationUserSchema = Joi.object({
  email: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
});
