class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.data = null;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
// A standardized error shape your app throws instead of generic Error or ad-hoc objects.