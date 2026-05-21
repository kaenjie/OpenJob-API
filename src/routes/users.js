import { Router } from "express";
import UsersService from "../services/UsersService.js";
import { sendResponse } from "../utils/response.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { registerSchema } from "../utils/validations.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { deleteCache } from "../utils/redis.js";

const router = Router();

router.post("/", validateMiddleware(registerSchema), async (req, res, next) => {
  try {
    const user = await UsersService.register(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: "User berhasil didaftarkan",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", cacheMiddleware({ ttl: 3600 }), async (req, res, next) => {
  try {
    const user = await UsersService.getUserById(req.params.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan user",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
