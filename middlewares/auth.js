const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-failure');

const { JWT_SECRET = 'default-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError());
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError());
  }
  req.user = payload;
  next();
};
