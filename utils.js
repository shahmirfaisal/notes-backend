exports.errorHandler = (next, message, status) => {
  const error = new Error(message);
  error.status = status;
  next(error);
};

exports.initializePassport = (passport) => {};
