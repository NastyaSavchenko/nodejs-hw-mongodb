import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export async function getContacts(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);

  const contacts = await getAllContacts({ page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getOneContactById(req, res) {
  const { id } = req.params;

  const contact = await getContactById(id);

  if (!contact) {
    throw new createHttpError.NotFound(`Contact not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const contactData = req.body;

  const newContact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function updateContactController(req, res) {
  const id = req.params.id;

  const contactData = req.body;

  const result = await updateContactById(id, contactData);

  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
}

export async function deleteContactController(req, res) {
  const id = req.params.id;
  const result = await deleteContactById(id);

  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.status(204).end();
}
