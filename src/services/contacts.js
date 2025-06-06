import { Contact } from '../models/contacts.js';

export async function getAllContacts() {
  const contacts = await Contact.find();
  return contacts;
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
