exports.successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    results: data,
    data,
  });
};

exports.errorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 500,
) => {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};
