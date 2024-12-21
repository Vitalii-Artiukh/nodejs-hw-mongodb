import { SORT_ORDER, sortByList } from '../constants/contacts.js';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  if (sortByList.includes(sortBy)) return sortBy;

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;
  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};

// const sortOrderList = ['asc', 'desc'];

// export const parseSortParams = ({ sortBy, sortOrder }, sortByList) => {
//   const parsedSortOrder = sortOrderList.includes(sortOrder)
//     ? sortOrder
//     : sortOrderList[0];
//   const parsedSortBy = sortByList.includes(sortBy) ? sortBy : '_id';

//   return {
//     sortBy: parsedSortBy,
//     sortOrder: parsedSortOrder,
//   };
// };
