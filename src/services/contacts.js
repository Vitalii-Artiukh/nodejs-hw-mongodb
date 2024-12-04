import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  console.log(ContactsCollection);
  return contacts;
};

export const getContactById = async () => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};
