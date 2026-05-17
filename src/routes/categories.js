import { Router } from "express";
import CategoriesService from "../services/CategoriesService.js";
import { sendResponse } from "../utils/response.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { categorySchema } from "../utils/validations.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesService.getAllCategories();
    sendResponse(res, {
      message: "Berhasil mendapatkan categories",
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const category = await CategoriesService.getCategoryById(req.params.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan category",
      data: {
        id: category.id,
        name: category.name,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authMiddleware,
  validateMiddleware(categorySchema),
  async (req, res, next) => {
    try {
      const category = await CategoriesService.createCategory(req.body);
      sendResponse(res, {
        statusCode: 201,
        message: "Category berhasil dibuat",
        data: {
          id: category.id,
          name: category.name,
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
  validateMiddleware(categorySchema),
  async (req, res, next) => {
    try {
      const category = await CategoriesService.updateCategory(
        req.params.id,
        req.body,
      );
      sendResponse(res, {
        message: "Category berhasil diupdate",
        data: {
          id: category.id,
          name: category.name,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await CategoriesService.deleteCategory(req.params.id);
    sendResponse(res, { message: "Category berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
