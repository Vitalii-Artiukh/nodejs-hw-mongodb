import { Schema, model } from 'mongoose';
// import { emailRegExp } from '../../constants/users.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //   match: emailRegExp,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.post('save', handleSaveError);
usersSchema.pre('findOneAndUpdate', setUpdateSettings);
usersSchema.post('findOneAndUpdate', handleSaveError);

export const UsersCollection = model('users', usersSchema);
