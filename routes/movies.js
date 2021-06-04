const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const InvalidDataError = require('../errors/invalid-data');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(65), // longest countrey U.K.
      director: Joi.string().required().min(2).max(90),
      duration: Joi.number().required().positive().min(1)
        .max(2880), // 48 hours in ьштгеуы (longest movie in histiry)
      year: Joi.number().required().positive().min(1895) // first movie
        .max(new Date().getFullYear()),
      description: Joi.string().required().min(2).max(1500),
      image: Joi.string().required().custom((url) => {
        if (validator.isURL(url, { require_protocol: true })) return url;
        throw new InvalidDataError('Невалидный URL');
      }),
      trailer: Joi.string().required().custom((url) => {
        if (validator.isURL(url, { require_protocol: true })) return url;
        throw new InvalidDataError('Невалидный URL');
      }),
      nameRU: Joi.string().required().min(2).max(150),
      nameEN: Joi.string().required().min(2).max(150),
      thumbnail: Joi.string().required().custom((url) => {
        if (validator.isURL(url, { require_protocol: true })) return url;
        throw new InvalidDataError('Невалидный URL');
      }),
      movieId: Joi.string().required().min(2).max(150),
    }),
  }),
  createMovie,
);

router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
