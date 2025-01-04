import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const query = ContactsCollection.find();
  const skip = (page - 1) * perPage;

  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavorite) {
    query.where('isFavorite').equals(filter.isFavorite);
  }

  if (filter.userId) {
    query.where('userId').equals(filter.userId);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(query)
    .countDocuments();

  const contacts = await query
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

// не потрібно використовувати async/await тому що це є в controlers.

// export const getAllContacts = () => ContactsCollection.find();
// {
//   const contacts = await ContactsCollection.find();
//   return contacts;
// };

export const getContactById = (contactId) =>
  ContactsCollection.findById(contactId);
// {
//   const contact = await ContactsCollection.findById(contactId);
//   return contact;
// };

export const getContact = (filter) => ContactsCollection.findOne(filter);

export const createContact = (contactData) =>
  ContactsCollection.create(contactData);
// {
//   const contact = await ContactsCollection.create(contactData);
//   return contact;
// };

export const deleteContact = (filter) =>
  ContactsCollection.findOneAndDelete(filter);
// {
//   const contact = await ContactsCollection.findOneAndDelete({
//     _id: contactId,
//   });
//   return contact;
// };

export const updateContact = async (filter, contactData, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    // { id: contactId }
    filter,
    contactData,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
