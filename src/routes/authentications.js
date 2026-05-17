import { Router } from "express";
import UsersService from "../services/UsersService.js";
import AuthenticationsService from "../services/AuthenticationsService.js";
import { sendResponse } from "../utils/response.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { loginSchema, refreshTokenSchema } from "../utils/validations.js";

const router = Router();

// POST - Login → 200
router.post("/", validateMiddleware(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersService.verifyCredential(email, password);
    const accessToken = AuthenticationsService.generateAccessToken({
      id: user.id,
    });
    const refreshToken = AuthenticationsService.generateRefreshToken({
      id: user.id,
    });
    await AuthenticationsService.saveRefreshToken(refreshToken);
    sendResponse(res, {
      statusCode: 200,
      message: "Login berhasil",
      data: { accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
});

// PUT - Refresh token
router.put("/", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ status: "failed", message: "refreshToken wajib diisi" });
    }
    const decoded =
      await AuthenticationsService.verifyRefreshToken(refreshToken);
    const accessToken = AuthenticationsService.generateAccessToken({
      id: decoded.id,
    });
    sendResponse(res, {
      message: "Access token berhasil diperbarui",
      data: { accessToken },
    });
  } catch (err) {
    // Jika token tidak valid/tidak ditemukan → 400
    if (err.name === "AuthenticationError") {
      return res.status(400).json({ status: "failed", message: err.message });
    }
    next(err);
  }
});

// DELETE - Logout
router.delete("/", authMiddleware, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ status: "failed", message: "refreshToken wajib diisi" });
    }
    const result = await AuthenticationsService.checkRefreshToken(refreshToken);
    if (!result) {
      return res
        .status(400)
        .json({ status: "failed", message: "Refresh token tidak ditemukan" });
    }
    await AuthenticationsService.deleteRefreshToken(refreshToken);
    sendResponse(res, { message: "Logout berhasil" });
  } catch (err) {
    next(err);
  }
});

export default router;
