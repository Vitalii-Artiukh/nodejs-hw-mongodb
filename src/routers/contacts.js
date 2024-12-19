import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(contactsControllers.getContactsController));
router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.getContactByIdController),
);

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(contactsControllers.createContactController),
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactController),
);

router.put(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.upsertContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);

export default router;

// import {Router} from "express";

// import { isValidId } from "../middlewares/isValidId.js";

// import * as movieControllers from "../controllers/movies.js";

// import ctrlWrapper from "../utils/ctrlWrapper.js";
// import validateBody from "../utils/validateBody.js";

// import { movieAddSchema, movieUpdateSchema } from "../validation/movies.js";

// const moviesRouter = Router();

// moviesRouter.get("/", ctrlWrapper(movieControllers.getMoviesController));

// moviesRouter.get("/:id", isValidId, ctrlWrapper(movieControllers.getMovieByIdController));

// moviesRouter.post("/", validateBody(movieAddSchema), ctrlWrapper(movieControllers.addMovieController));

// moviesRouter.put("/:id", isValidId, validateBody(movieAddSchema), ctrlWrapper(movieControllers.upsertMovieController));

// moviesRouter.patch("/:id", isValidId, validateBody(movieUpdateSchema), ctrlWrapper(movieControllers.patchMovieController))

// moviesRouter.delete("/:id", isValidId, ctrlWrapper(movieControllers.deleteMovieController))

// export default moviesRouter;
