export const sendResponse = (
  res,
  { status = "success", statusCode = 200, message, data },
) => {
  return res.status(statusCode).json({
    status,
    message,
    ...(data !== undefined && { data }),
  });
};
