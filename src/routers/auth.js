import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerValidationUserSchema,
  loginValidationUserSchema,
} from '../validation/auth.js';
import {
  loginUserController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../validation/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerValidationUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginValidationUserSchema),
  ctrlWrapper(loginUserController),
);

export default authRouter;
