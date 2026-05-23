import { Router } from "express";
import UsersService from "../services/UsersService.js";
import ApplicationsService from "../services/ApplicationsService.js";
import BookmarksService from "../services/BookmarksService.js";
import { sendResponse } from "../utils/response.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";

const router = Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const user = await UsersService.getUserById(req.user.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan profile",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/applications", authMiddleware, async (req, res, next) => {
  try {
    const applications = await ApplicationsService.getApplicationsByUser(
      req.user.id,
    );
    sendResponse(res, {
      message: "Berhasil mendapatkan applications",
      data: { applications },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/bookmarks", authMiddleware, async (req, res, next) => {
  try {
    const bookmarks = await BookmarksService.getBookmarksByUser(req.user.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan bookmarks",
      data: { bookmarks },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
