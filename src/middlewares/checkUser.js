import createHttpError from 'http-errors';
import { Contact } from '../models/contacts.js';

export async function checkUser(req, res, next) {
  const contactId = req.params.id;

  const userId = req.user.id;

  const contact = await Contact.findById(contactId);

  if (!contact || contact.userId.toString() !== userId.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  req.contact = contact;

  next();
}
