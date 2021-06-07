const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { pageNotFound } = require('../utils/errorConsts');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
      name: Joi.string().required().min(2).max(20),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
    }),
  }),
  login,
);

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => next(new NotFoundError(pageNotFound)));

module.exports = router;
