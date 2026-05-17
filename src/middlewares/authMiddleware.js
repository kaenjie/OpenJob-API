import jwt from "jsonwebtoken";
import AuthenticationError from "../exceptions/AuthenticationError.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthenticationError("Token tidak ditemukan"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded;
    next();
  } catch {
    next(new AuthenticationError("Token tidak valid atau sudah expired"));
  }
};

export default authMiddleware;
