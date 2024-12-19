import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error);
  }
};

// const validateBody = (schema) => {
//   const func = async (req, res, next) => {
//     try {
//       await schema.validateAsync(req.body, {
//         abortEarly: false,
//       });
//       next();
//     } catch (error) {
//       return next(createHttpError(400, error.message));
//     }
//   };

//   return func;
// };

// export default validateBody;
