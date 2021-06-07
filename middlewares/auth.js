const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-failure');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError());
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(new AuthError());
  }
  req.user = payload;
  next();
};
