class AuthError extends Error {
  constructor() {
    super('Проблемы с авторизацией.');
    this.statusCode = 401;
  }
}

module.exports = AuthError;
