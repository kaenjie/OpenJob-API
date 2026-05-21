import { Router } from "express";
import JobsService from "../services/JobsService.js";
import { sendResponse } from "../utils/response.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { jobSchema, updateJobSchema } from "../utils/validations.js";

const router = Router();

router.get("/", cacheMiddleware({ ttl: 3600 }), async (req, res, next) => {
  try {
    const jobs = await JobsService.getAllJobs(req.query);
    sendResponse(res, { message: "Berhasil mendapatkan jobs", data: { jobs } });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/company/:companyId",
  cacheMiddleware({ ttl: 3600 }),
  async (req, res, next) => {
    try {
      const jobs = await JobsService.getJobsByCompany(req.params.companyId);
      sendResponse(res, {
        message: "Berhasil mendapatkan jobs by company",
        data: { jobs },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/category/:categoryId",
  cacheMiddleware({ ttl: 3600 }),
  async (req, res, next) => {
    try {
      const jobs = await JobsService.getJobsByCategory(req.params.categoryId);
      sendResponse(res, {
        message: "Berhasil mendapatkan jobs by category",
        data: { jobs },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get("/:id", cacheMiddleware({ ttl: 3600 }), async (req, res, next) => {
  try {
    const job = await JobsService.getJobById(req.params.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan job",
      data: {
        id: job.id,
        company_id: job.company_id,
        category_id: job.category_id,
        title: job.title,
        description: job.description,
        location: job.location,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        job_type: job.job_type,
        company_name: job.company_name,
        created_at: job.created_at,
        updated_at: job.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authMiddleware,
  validateMiddleware(jobSchema),
  async (req, res, next) => {
    try {
      const job = await JobsService.createJob(req.body);
      sendResponse(res, {
        statusCode: 201,
        message: "Job berhasil dibuat",
        data: {
          id: job.id,
          company_id: job.company_id,
          category_id: job.category_id,
          title: job.title,
          description: job.description,
          location: job.location,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          job_type: job.job_type,
          created_at: job.created_at,
          updated_at: job.updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/:id",
  authMiddleware,
  validateMiddleware(updateJobSchema),
  async (req, res, next) => {
    try {
      const job = await JobsService.updateJob(req.params.id, req.body);
      sendResponse(res, {
        message: "Job berhasil diupdate",
        data: {
          id: job.id,
          company_id: job.company_id,
          category_id: job.category_id,
          title: job.title,
          description: job.description,
          location: job.location,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          job_type: job.job_type,
          created_at: job.created_at,
          updated_at: job.updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await JobsService.deleteJob(req.params.id);
    sendResponse(res, { message: "Job berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
