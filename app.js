const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { celebrateErrorProcessing, centrolizedErrorHandling } = require('./errors/centrolizedErrorHandling');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
});
app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(
  {
    origin: [
      'http://localhost:3001',
      'http://ilya.mesto.nomoredomains.icu',
      'https://ilya.mesto.nomoredomains.icu',
    ],
  },
));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
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

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(2),
    }),
  }),
  login,
);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errorLogger);

app.use(errors());

app.use((req, res, next) => next(new NotFoundError('Страница не найдена.')));

app.use(celebrateErrorProcessing);

app.use(centrolizedErrorHandling);

app.listen(PORT, () => {});
