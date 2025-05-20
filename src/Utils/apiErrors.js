class ApiError extends Error {
  constructor(
    statusCode,
    message = 'something went wrong',
    data = null,
    success = false,
    error = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.success = success;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
