// export const handleUniqueError = (error, data, next) => {
//   if (error.code === 11000) {
//     error.status = 409;
//     error.message = 'Email in use';
//   }
// };

export const handleSaveError = (error, data, next) => {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
  this.options.runValidators = true;
  this.options.new = true;
  next();
};

// export const handleSaveError = (error, data, next) => {
//   error.status = 400;
//   next();
// };

// export const setUpdateSettings = function (next) {
//   this.options.runValidators = true;
//   this.options.new = true;
//   next();
// };
