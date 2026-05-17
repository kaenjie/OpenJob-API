import ClientError from "../exceptions/ClientError.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message,
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      status: "failed",
      message: "Data referensi tidak ditemukan",
    });
  }

  if (err.code === "23505") {
    return res.status(400).json({
      status: "failed",
      message: "Data sudah ada",
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
  });
};

export default errorMiddleware;
