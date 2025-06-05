class InvalidHmacError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, InvalidHmacError.prototype);
  }
}

module.exports = {
  InvalidHmacError
};
