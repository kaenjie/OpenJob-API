import ClientError from "../exceptions/ClientError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { sendResponse } from "../utils/response.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return sendResponse(res, {
      status: "failed",
      statusCode: 404,
      message: err.message,
    });
  }

  if (err instanceof ClientError) {
    return sendResponse(res, {
      status: "failed",
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  if (err.code === "23503") {
    return sendResponse(res, {
      status: "failed",
      statusCode: 400,
      message: "Data referensi tidak ditemukan",
    });
  }

  if (err.code === "23505") {
    return sendResponse(res, {
      status: "failed",
      statusCode: 400,
      message: "Data sudah ada",
    });
  }

  console.error(err);
  return sendResponse(res, {
    status: "error",
    statusCode: 500,
    message: "Terjadi kesalahan pada server",
  });
};

export default errorMiddleware;
