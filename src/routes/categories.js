import { Router } from "express";
import CategoriesService from "../services/CategoriesService.js";
import { sendResponse } from "../utils/response.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { categorySchema } from "../utils/validations.js";
import { deleteCache } from "../utils/redis.js";

const router = Router();

router.get("/", cacheMiddleware({ ttl: 3600 }), async (req, res, next) => {
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

router.get("/:id", cacheMiddleware({ ttl: 3600 }), async (req, res, next) => {
  try {
    const category = await CategoriesService.getCategoryById(req.params.id);
    sendResponse(res, {
      message: "Berhasil mendapatkan category",
      data: {
        id: category.id,
        name: category.name,
        created_at: category.created_at,
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
      await deleteCache("route:/categories");
      sendResponse(res, {
        statusCode: 201,
        message: "Category berhasil dibuat",
        data: {
          id: category.id,
          name: category.name,
          created_at: category.created_at,
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
      await deleteCache("route:/categories");
      await deleteCache(`route:/categories/${req.params.id}`);
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
    await deleteCache("route:/categories");
    await deleteCache(`route:/categories/${req.params.id}`);
    sendResponse(res, { message: "Category berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
