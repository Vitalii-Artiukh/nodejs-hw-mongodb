import { typeListContactType } from '../db/models/contact.js';

const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;

  if (typeListContactType.includes(contactType)) return contactType;
};

const parseIsFavorite = (isFavorite) => {
  const isString = typeof isFavorite === 'string';
  if (!isString) return;

  const favorite = (isFavorite) => ['true', 'false'].includes(isFavorite);

  if (favorite(isFavorite)) return isFavorite;
};

// const parseNumber = (number) => {
//   const isString = typeof number === 'string';
//   if (!isString) return;

//   const parsedNumber = parseInt(number);
//   if (Number.isNaN(parsedNumber)) return;

//   return parsedNumber;
// };

export const parseFilterParams = (query) => {
  const { contactType, isFavorite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavorite = parseIsFavorite(isFavorite);
  return {
    contactType: parsedContactType,
    isFavorite: parsedIsFavorite,
  };
};
