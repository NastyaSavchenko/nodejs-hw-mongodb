import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContacts,
  getOneContactById,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/upload.js';

import {
  createContactValidation,
  updateContactValidation,
} from '../validation/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContacts));
router.get('/:id', isValidId, ctrlWrapper(getOneContactById));

router.post(
  '/',
  upload.single('photo'),
  jsonParser,
  validateBody(createContactValidation),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  upload.single('photo'),
  isValidId,
  jsonParser,
  validateBody(updateContactValidation),
  ctrlWrapper(updateContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
