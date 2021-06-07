const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InvalidDataError = require('../errors/invalid-data');
const AuthError = require('../errors/auth-failure');
const UserExistsError = require('../errors/user-exists');
const { userNotFound, invalidUserEmail, invalidUserData } = require('../utils/errorConsts');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(userNotFound);
      }
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!validator.isEmail(email)) {
    throw new InvalidDataError(invalidUserEmail);
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.name === 'ValidationError' && err.name === 'CastError') {
        next(new InvalidDataError(invalidUserData));
        return;
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new UserExistsError());
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new AuthError();
  }
  let userTemp;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError();
      }
      userTemp = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new AuthError();
      }
      return res.send(
        {
          token: jwt.sign(
            { _id: userTemp._id },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
          ),
        },
      );
    })
    .catch((err) => next(err));
};
