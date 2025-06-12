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
import {
  createContactValidation,
  updateContactValidation,
} from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:id', isValidId, ctrlWrapper(getOneContactById));
router.post(
  '/contacts',
  jsonParser,
  validateBody(createContactValidation),
  ctrlWrapper(createContactController),
);
router.patch(
  '/contacts/:id',
  isValidId,
  jsonParser,
  validateBody(updateContactValidation),
  ctrlWrapper(updateContactController),
);
router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
