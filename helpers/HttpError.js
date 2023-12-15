const errorMessage = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const HttError = (status, message = errorMessage[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
export default HttError;
