exports.accessDenied = function (message) {
  var error = new Error(message || 'Access denied.');
  error.accessDenied = true;
  return error;
}

exports.validationError = function (message) {
  const err = new Error(message || 'Validation error.');
  err.validationError = true;
  return err;
}

exports.notFound = function (message) {
  var error = new Error(message || 'Not found.');
  error.notFound = true;
  return error;
}

exports.invalid = function (message) {
  var error = new Error(message);
  error.invalid = true;
  return error;
}