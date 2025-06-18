import { Contact } from '../models/contacts.js';

export async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const filter = { userId };

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(filter),
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

export async function getContactById(id, userId) {
  return Contact.findOne({ _id: id, userId });
}

export async function createContact(contactData) {
  const contact = await Contact.create(contactData);
  return contact;
}

export async function updateContactById(id, userId, contactData) {
  return Contact.findOneAndUpdate({ _id: id, userId }, contactData, {
    new: true,
  });
}

export async function deleteContactById(id, userId) {
  return Contact.findOneAndDelete({ _id: id, userId });
}
