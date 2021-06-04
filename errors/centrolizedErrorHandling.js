const { isCelebrateError } = require('celebrate');
const InvalidDataError = require('./invalid-data');

const celebrateErrorProcessing = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    if (err.details.has('body')) return next(new InvalidDataError(err.details.get('body').message));
    if (err.details.has('params')) return next(new InvalidDataError(err.details.get('params').message));
  }
  return next(err);
};

const centrolizedErrorHandling = (err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
};

module.exports = {
  celebrateErrorProcessing,
  centrolizedErrorHandling,
};
