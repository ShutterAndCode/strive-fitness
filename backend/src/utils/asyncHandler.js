const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
//Wrap async route handlers so thrown errors are automatically forwarded to Express's error-handling pipeline.