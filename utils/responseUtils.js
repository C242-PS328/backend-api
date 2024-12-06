function successResponse(res, data, message = "Success", statusCode) {
  res.status(statusCode).json({ status: "success", message, data });
}

function errorResponse(res, message, statusCode = 500) {
  res.status(statusCode).json({ status: "error", message });
}

module.exports = { successResponse, errorResponse };
