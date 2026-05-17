import { Router } from "express";
import CompaniesService from "../services/CompaniesService.js";
import { sendResponse } from "../utils/response.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { companySchema, updateCompanySchema } from "../utils/validations.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const companies = await CompaniesService.getAllCompanies();
    sendResponse(res, {
      message: "Berhasil mendapatkan companies",
      data: { companies },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const company = await CompaniesService.getCompanyById(req.params.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan company",
      data: {
        id: company.id,
        name: company.name,
        description: company.description,
        location: company.location,
        website: company.website,
        user_id: company.user_id,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authMiddleware,
  validateMiddleware(companySchema),
  async (req, res, next) => {
    try {
      const company = await CompaniesService.createCompany({
        ...req.body,
        user_id: req.user.id,
      });
      sendResponse(res, {
        statusCode: 201,
        message: "Company berhasil dibuat",
        data: {
          id: company.id,
          name: company.name,
          description: company.description,
          location: company.location,
          website: company.website,
          user_id: company.user_id,
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
  validateMiddleware(updateCompanySchema),
  async (req, res, next) => {
    try {
      const company = await CompaniesService.updateCompany(
        req.params.id,
        req.body,
      );
      sendResponse(res, {
        message: "Company berhasil diupdate",
        data: {
          id: company.id,
          name: company.name,
          description: company.description,
          location: company.location,
          website: company.website,
          user_id: company.user_id,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await CompaniesService.deleteCompany(req.params.id);
    sendResponse(res, { message: "Company berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
