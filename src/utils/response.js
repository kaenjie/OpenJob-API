export const sendResponse = (
  res,
  { status = "success", statusCode = 200, message, data = null },
) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};
