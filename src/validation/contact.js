import Joi from 'joi';
import { typeListContactType } from '../constants/contacts.js';

const minLimit = 3;
const maxLimit = 20;

export const createContactSchema = Joi.object({
  name: Joi.string()
    .min(minLimit)
    .max(maxLimit)
    .required()
    .messages({
      'any.required': 'Name is required!',
      'string.min': `Name should have at least ${minLimit} characters`,
      'string.max': `Name should have at most ${maxLimit} characters`,
    }),
  phoneNumber: Joi.string()
    .min(minLimit)
    .max(maxLimit)
    .required()
    .messages({
      'any.required': 'Phone number is required!',
      'string.min': `Phone number should have at least ${minLimit} characters`,
      'string.max': `Phone number should have at most ${maxLimit} characters`,
    }),
  email: Joi.string()
    .min(minLimit)
    .max(maxLimit)
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net', 'ua'],
        deny: ['ru', 'su', 'rf', 'рф'],
      },
    })
    .messages({
      'string.min': `Email should have at least ${minLimit} characters`,
      'string.max': `Email should have at most ${maxLimit} characters`,
    }),
  isFavorite: Joi.boolean(),
  // contactType: Joi.string().required().valid('work', 'home', 'personal'),
  contactType: Joi.string()
    .required()
    .valid(...typeListContactType)
    .messages({ 'string.required': 'contactType is required!' }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(minLimit)
    .max(maxLimit)
    .messages({
      'string.min': `Name should have at least ${minLimit} characters`,
      'string.max': `Name should have at most ${maxLimit} characters`,
    }),
  phoneNumber: Joi.string()
    .min(minLimit)
    .max(maxLimit)
    .messages({
      'string.min': `Phone number should have at least ${minLimit} characters`,
      'string.max': `Phone number should have at most ${maxLimit} characters`,
    }),
  email: Joi.string()
    .min(minLimit)
    .max(maxLimit)
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net', 'ua'],
        deny: ['ru', 'su', 'rf', 'рф'],
      },
    })
    .messages({
      'string.min': `Email should have at least ${minLimit} characters`,
      'string.max': `Email should have at most ${maxLimit} characters`,
    }),
  isFavorite: Joi.boolean(),
  // contactType: Joi.string().required().valid('work', 'home', 'personal'),
  contactType: Joi.string().valid(...typeListContactType),
});

//
// export const dataToValidate = {
//   name: 'Vit Art',
//   phoneNumber: '322233456',
//   email: 'vit_art@yahoo.com',
//   isFavorite: true,
//   contactType: 'personal',
// };

// const validationResult = createContactSchema.validateAsync(dataToValidate);
// if (validationResult.error) {
//   console.error(validationResult.error.message);
// } else {
//   console.log('Data is valid!');
// }
//

// import Joi from 'joi';

// import { typeList } from '../constants/movies.js';

// export const movieAddSchema = Joi.object({
//   title: Joi.string().required(),
//   director: Joi.string().required().messages({
//     'any.required': `режисера треба вказати`,
//   }),
//   type: Joi.string().valid(...typeList),
// });

// export const movieUpdateSchema = Joi.object({
//   title: Joi.string(),
//   director: Joi.string(),
//   type: Joi.string().valid(...typeList),
// });
