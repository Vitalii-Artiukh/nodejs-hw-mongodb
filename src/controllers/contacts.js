import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  // const { _id: userId } = req.user;
  // filter.userId = userId;
  filter.userId = req.user._id;

  const contacts = await contactServices.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: contactId } = req.params;

  const contact = await contactServices.getContact({ contactId, userId });
  console.log(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

//
export const createContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const contact = await contactServices.createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};
//

export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: contactId } = req.params;
  // console.log('userId:', userId);
  // console.log('contactId:', contactId);

  const contact = await contactServices.deleteContact({ contactId, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: contactId } = req.params;
  const result = await contactServices.updateContact(
    contactId,
    { ...req.body, userId },
    {
      upsert: true,
    },
  );
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status: status,
    message: 'Successfully upserted a contact!',
    data: result.contact,
  });
};

export const patchContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: contactId } = req.params;
  const result = await contactServices.updateContact(
    { contactId, userId },
    req.body,
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
