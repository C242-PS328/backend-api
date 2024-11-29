function successResponse(res, data, message = "Success") {
  res.status(200).json({ status: "success", message, data });
}

function errorResponse(res, error, code = 500) {
  res.status(code).json({ status: "error", message: error.message });
}

module.exports = { successResponse, errorResponse };
