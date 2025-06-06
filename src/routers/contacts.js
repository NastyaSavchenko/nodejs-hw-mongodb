import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getContacts,
  getOneContactById,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:id', ctrlWrapper(getOneContactById));
router.post('/contacts', jsonParser, ctrlWrapper(createContactController));
router.patch('/contacts/:id', jsonParser, ctrlWrapper(updateContactController));
router.delete('/contacts/:id', ctrlWrapper(deleteContactController));

export default router;
