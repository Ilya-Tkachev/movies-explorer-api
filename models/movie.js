const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { invalidMovieCoverUrl, invalidMovieCoverMiniUrl, invalidMovieTrailerUrl } = require('../utils/errorConsts');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    maxlength: 25,
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    maxlength: 90,
    required: true,
  },
  duration: {
    type: Number,
    min: 1,
    max: 2880,
    required: true,
  },
  year: {
    type: Number,
    min: 1880,
    max: new Date().getFullYear(),
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 1500,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (imageURL) => isURL(imageURL),
      message: invalidMovieCoverUrl,
      require_protocol: true,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (trailerURL) => isURL(trailerURL),
      message: invalidMovieTrailerUrl,
      require_protocol: true,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (thumbnailURL) => isURL(thumbnailURL),
      message: invalidMovieCoverMiniUrl,
      require_protocol: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    min: 0,
    required: true,
  },
  nameRU: {
    type: String,
    minlength: 2,
    maxlength: 150,
    required: true,
  },
  nameEN: {
    type: String,
    minlength: 2,
    maxlength: 150,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
