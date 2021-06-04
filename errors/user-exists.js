class UserExistsError extends Error {
  constructor() {
    super('Пользователь с такой почтой уже существует.');
    this.statusCode = 409;
  }
}

module.exports = UserExistsError;
