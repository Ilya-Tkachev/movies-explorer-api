const { emailAlreadyExists } = require('../utils/errorConsts');

class UserExistsError extends Error {
  constructor() {
    super(emailAlreadyExists);
    this.statusCode = 409;
  }
}

module.exports = UserExistsError;
