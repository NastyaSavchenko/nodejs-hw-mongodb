import * as fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export async function getContacts(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const userId = req.user.id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getOneContactById(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const contact = await getContactById(id, userId);

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
  let photo = null;

  if (process.env.UPLOAD_TO_CLOUDINARY === 'true') {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    photo = result.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src', 'uploads', 'photos', req.file.filename),
    );

    photo = `${process.env.DOMAIN_FOR_PHOTO}/${req.file.filename}`;
  }

  const newContact = await createContact({
    ...contactData,
    userId: req.user.id,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function updateContactController(req, res) {
  const id = req.params.id;
  const userId = req.user.id;
  const contactData = req.body;

  if (req.file) {
    let photo = null;

    if (process.env.UPLOAD_TO_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'uploads', 'photos', req.file.filename),
      );
      photo = `${process.env.DOMAIN_FOR_PHOTO}/${req.file.filename}`;
    }

    contactData.photo = photo;
  }

  const result = await updateContactById(id, userId, contactData);

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
  const userId = req.user.id;
  const result = await deleteContactById(id, userId);

  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.status(204).end();
}
