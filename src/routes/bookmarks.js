import { Router } from "express";
import BookmarksService from "../services/BookmarksService.js";
import { sendResponse } from "../utils/response.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { deleteCache, deleteCacheByPattern } from "../utils/redis.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const bookmark = await BookmarksService.createBookmark({
      user_id: req.user.id,
      job_id: req.params.jobId,
    });
    
    await deleteCacheByPattern(`route:/bookmarks*`);
    
    sendResponse(res, {
      statusCode: 201,
      message: "Bookmark berhasil ditambahkan",
      data: {
        id: bookmark.id,
        user_id: bookmark.user_id,
        job_id: bookmark.job_id,
        created_at: bookmark.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id",
  authMiddleware,
  cacheMiddleware({ ttl: 3600 }),
  async (req, res, next) => {
    try {
      const bookmark = await BookmarksService.getBookmarkById(req.params.id);
      sendResponse(res, {
        message: "Berhasil mendapatkan bookmark",
        data: {
          id: bookmark.id,
          user_id: bookmark.user_id,
          job_id: bookmark.job_id,
          created_at: bookmark.created_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/", authMiddleware, async (req, res, next) => {
  try {
    await BookmarksService.deleteBookmarkByUserAndJob(
      req.user.id,
      req.params.jobId,
    );
    
    // invalidate cache
    await deleteCacheByPattern(`route:/jobs/${req.params.jobId}/bookmark*`);
    await deleteCacheByPattern(`route:/bookmarks*`);

    sendResponse(res, { message: "Bookmark berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
