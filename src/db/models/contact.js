import { Schema, model } from 'mongoose';
import { typeListContactType } from '../../constants/contacts.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: typeListContactType,
      default: 'personal',
    },
  },
  {
    // Це додає до об'єкту два поля:
    // createdAt(дата створення) та updatedAt(дата оновлення),
    // і їх не потрібно додавати вручну.
    timestamps: true,
    versionKey: false,
  },
);

// import { handleSaveError, setUpdateSettings } from './hooks.js';

// import { typeList } from '../../constants/movies.js';

// const movieSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     director: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: typeList,
//       default: 'film',
//       required: true,
//     },
//   },
//   { versionKey: false, timestamps: true },
// );

// movieSchema.post('save', handleSaveError);

// movieSchema.pre('findOneAndUpdate', setUpdateSettings);

// movieSchema.post('findOneAndUpdate', handleSaveError);

export const ContactsCollection = model('contacts', contactSchema);
