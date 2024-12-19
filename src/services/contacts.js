import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage }) => {
  const query = ContactsCollection.find();
  // const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsCount = await ContactsCollection.find()
    .merge(query)
    .countDocuments();

  const contacts = await query.skip(skip).limit(perPage).exec();

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

export const createContact = (contactData) =>
  ContactsCollection.create(contactData);
// {
//   const contact = await ContactsCollection.create(contactData);
//   return contact;
// };

export const deleteContact = (contactId) =>
  ContactsCollection.findOneAndDelete(contactId);
// {
//   const contact = await ContactsCollection.findOneAndDelete({
//     _id: contactId,
//   });
//   return contact;
// };

export const updateContact = async (contactId, contactData, options = {}) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    { _id: contactId },
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

// import MovieCollection from '../db/models/Movie.js';

// export const getMovies = () => MovieCollection.find();

// export const getMovieById = (id) => MovieCollection.findById(id);

// export const addMovie = (contactData) => MovieCollection.create(contactData);

// export const updateMovie = async ({ _id, contactData, options = {} }) => {
//   const rawResult = await MovieCollection.findOneAndUpdate({ _id }, contactData, {
//     ...options,
//     includeResultMetadata: true,
//   });

//   if (!rawResult || !rawResult.value) return null;

//   return {
//     data: rawResult.value,
//     isNew: Boolean(rawResult.lastErrorObject.upserted),
//   };
// };

// export const deleteMovie = (filter) => MovieCollection.findOneAndDelete(filter);
