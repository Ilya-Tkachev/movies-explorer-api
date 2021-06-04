const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/access-denied');
const InvalidDataError = require('../errors/invalid-data');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('user')
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' && err.name === 'CastError') {
        next(new InvalidDataError('Невалидные данные фильма'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  console.log(req.params.movieId);
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден.');
      }
      return movie;
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new AccessDeniedError('Отказано в доступе.');
      }
      return Movie.deleteOne(movie);
    })
    .then((deleteResult) => {
      if (deleteResult.deletedCount === 1) {
        res.send(deleteResult);
      } else {
        const err = new Error('Ошибка при удалении фильма.');
        err.statusCode = 500;
        throw err;
      }
    })
    .catch((err) => next(err));
};
