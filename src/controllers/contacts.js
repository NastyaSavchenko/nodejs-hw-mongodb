import { getAllContacts, getContactById } from '../services/contacts.js';

export async function getContacts(req, res) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
}
export async function getOneContactById(req, res) {
  const { id } = req.params;

  try {
    const contact = await getContactById(id);

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);

    res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });
  }
}
