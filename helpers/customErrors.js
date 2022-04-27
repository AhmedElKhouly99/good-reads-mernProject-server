const customError = (status, code, message) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
};

exports.customError = customError;
exports.inputErr = customError(
  422,
  "ERR_ASSERTION",
  "username must exist, password must include lower and upper and numbers, age must be more than or equal 10 , gender must be male or female"
);
exports.authError = customError(
  401,
  "AUTH_ERROR",
  "invalid username or password"
);
exports.authorizationError = customError(403, 'AUTHORIZATION_ERROR', 'you are not authorized on this action');
