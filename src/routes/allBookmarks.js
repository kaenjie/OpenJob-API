import { Router } from "express";
import BookmarksService from "../services/BookmarksService.js";
import { sendResponse } from "../utils/response.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { deleteCache } from "../utils/redis.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  cacheMiddleware({ ttl: 3600 }),
  async (req, res, next) => {
    try {
      const bookmarks = await BookmarksService.getBookmarksByUser(req.user.id);
      sendResponse(res, {
        message: "Berhasil mendapatkan bookmarks",
        data: { bookmarks },
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
