import { Router } from "express";
import usersRouter from "./users.js";
import authenticationsRouter from "./authentications.js";
import companiesRouter from "./companies.js";
import categoriesRouter from "./categories.js";
import jobsRouter from "./jobs.js";
import applicationsRouter from "./applications.js";
import bookmarksRouter from "./bookmarks.js";
import documentsRouter from "./documents.js";
import profileRouter from "./profile.js";
import allBookmarksRouter from "./allBookmarks.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/authentications", authenticationsRouter);
router.use("/companies", companiesRouter);
router.use("/categories", categoriesRouter);
router.use("/jobs", jobsRouter);
router.use("/jobs/:jobId/bookmark", bookmarksRouter);
router.use("/applications", applicationsRouter);
router.use("/documents", documentsRouter);
router.use("/profile", profileRouter);
router.use("/bookmarks", allBookmarksRouter);

export default router;
