import { Router } from "express";
import ApplicationsService from "../services/ApplicationsService.js";
import { sendResponse } from "../utils/response.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  applicationSchema,
  applicationStatusSchema,
} from "../utils/validations.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateMiddleware(applicationSchema),
  async (req, res, next) => {
    try {
      const application = await ApplicationsService.createApplication({
        ...req.body,
        user_id: req.user.id,
      });
      sendResponse(res, {
        statusCode: 201,
        message: "Lamaran berhasil dikirim",
        data: {
          id: application.id,
          user_id: application.user_id,
          job_id: application.job_id,
          status: application.status,
          cover_letter: application.cover_letter,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const applications = await ApplicationsService.getAllApplications();
    sendResponse(res, {
      message: "Berhasil mendapatkan applications",
      data: { applications },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", authMiddleware, async (req, res, next) => {
  try {
    const applications = await ApplicationsService.getApplicationsByUser(
      req.params.userId,
    );
    sendResponse(res, {
      message: "Berhasil mendapatkan applications by user",
      data: { applications },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/job/:jobId", authMiddleware, async (req, res, next) => {
  try {
    const applications = await ApplicationsService.getApplicationsByJob(
      req.params.jobId,
    );
    sendResponse(res, {
      message: "Berhasil mendapatkan applications by job",
      data: { applications },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const application = await ApplicationsService.getApplicationById(
      req.params.id,
    );
    sendResponse(res, {
      message: "Berhasil mendapatkan application",
      data: {
        id: application.id,
        user_id: application.user_id,
        job_id: application.job_id,
        status: application.status,
        cover_letter: application.cover_letter,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  authMiddleware,
  validateMiddleware(applicationStatusSchema),
  async (req, res, next) => {
    try {
      const application = await ApplicationsService.updateApplicationStatus(
        req.params.id,
        req.body,
      );
      sendResponse(res, {
        message: "Status lamaran berhasil diupdate",
        data: { application },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await ApplicationsService.deleteApplication(req.params.id);
    sendResponse(res, { message: "Lamaran berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
