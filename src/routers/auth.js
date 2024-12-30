import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerValidationUserSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../validation/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerValidationUserSchema),
  ctrlWrapper(registerUserController),
);

export default authRouter;
