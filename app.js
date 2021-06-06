const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('./utils/rateLimmiter');
const router = require('./routes/index');
const { centrolizedErrorHandling } = require('./errors/centrolizedErrorHandling');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const urls = require('./utils/addressConsts');
const { pageNotFound } = require('./utils/errorConsts');

const { NODE_ENV = 'dev' } = process.env; // 'config.env.dev' and 'config.env.prod'
require('dotenv').config({ path: `config.env.${NODE_ENV}` });

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(rateLimit);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: urls }));

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((req, res, next) => next(new NotFoundError(pageNotFound)));

app.use(centrolizedErrorHandling);

app.listen(process.env.PORT, () => {});
