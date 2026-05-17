import { Router } from "express";
import BookmarksService from "../services/BookmarksService.js";
import { sendResponse } from "../utils/response.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const bookmark = await BookmarksService.createBookmark({
      user_id: req.user.id,
      job_id: req.params.jobId,
    });
    sendResponse(res, {
      statusCode: 201,
      message: "Bookmark berhasil ditambahkan",
      data: {
        id: bookmark.id,
        user_id: bookmark.user_id,
        job_id: bookmark.job_id,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const bookmark = await BookmarksService.getBookmarkById(req.params.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan bookmark",
      data: {
        id: bookmark.id,
        user_id: bookmark.user_id,
        job_id: bookmark.job_id,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/", authMiddleware, async (req, res, next) => {
  try {
    await BookmarksService.deleteBookmarkByUserAndJob(
      req.user.id,
      req.params.jobId,
    );
    sendResponse(res, { message: "Bookmark berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
