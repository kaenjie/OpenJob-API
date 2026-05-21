import { Router } from "express";
import multer from "multer";
import DocumentsService from "../services/DocumentsService.js";
import { sendResponse } from "../utils/response.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { uploadWrapper } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/", cacheMiddleware({ ttl: 3600 }), async (req, res, next) => {
  try {
    const documents = await DocumentsService.getAllDocuments();
    sendResponse(res, {
      message: "Berhasil mendapatkan documents",
      data: { documents },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const document = await DocumentsService.getDocumentById(req.params.id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.original_name}"`,
    );

    res.download(document.file_path, document.original_name);
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddleware, uploadWrapper, async (req, res, next) => {
  try {
    if (!req.file) {
      return sendResponse(res, {
        status: "failed",
        statusCode: 400,
        message: "File is required",
      });
    }
    const document = await DocumentsService.createDocument({
      user_id: req.user.id,
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_path: req.file.path,
    });
    sendResponse(res, {
      statusCode: 201,
      message: "Document berhasil diupload",
      data: {
        id: document.id,
        user_id: document.user_id,
        filename: document.filename,
        original_name: document.original_name,
        file_path: document.file_path,
        created_at: document.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Custom error handler untuk upload (fallback)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendResponse(res, {
        status: "failed",
        statusCode: 400,
        message: "Ukuran file terlalu besar. Maksimal 5 MB",
      });
    }
    return sendResponse(res, {
      status: "failed",
      statusCode: 400,
      message: err.message,
    });
  }

  if (err && err.message && err.message.includes("MIME type")) {
    return sendResponse(res, {
      status: "failed",
      statusCode: 400,
      message: err.message,
    });
  }

  next(err);
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await DocumentsService.deleteDocument(req.params.id);
    sendResponse(res, { message: "Document berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
