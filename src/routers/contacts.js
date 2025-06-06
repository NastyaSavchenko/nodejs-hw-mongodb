import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { getContacts, getOneContactById } from '../controllers/contacts.js';

const router = express.Router();
// const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:id', ctrlWrapper(getOneContactById));

export default router;
