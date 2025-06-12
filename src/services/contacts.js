import { Contact } from '../models/contacts.js';

export async function getAllContacts({ page, perPage, sortBy, sortOrder }) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const [contacts, total] = await Promise.all([
    Contact.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
}

export async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact;
}

export async function createContact(contactData) {
  const contact = await Contact.create(contactData);
  return contact;
}

export async function updateContactById(id, contactData) {
  const contact = await Contact.findByIdAndUpdate(id, contactData, {
    new: true,
  });
  return contact;
}

export async function deleteContactById(id) {
  const contact = await Contact.findByIdAndDelete(id);
  return contact;
}
