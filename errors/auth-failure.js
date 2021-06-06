const { authProblem } = require('../utils/errorConsts');

class AuthError extends Error {
  constructor() {
    super(authProblem);
    this.statusCode = 401;
  }
}

module.exports = AuthError;
