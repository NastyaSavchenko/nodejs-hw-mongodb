import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';

export async function getContacts(req, res) {
  const contacts = await getAllContacts();

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
    throw new createHttpError.NotFound(`Student not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
}
