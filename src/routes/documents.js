import { Router } from "express";
import multer from "multer";
import path from "path";
import DocumentsService from "../services/DocumentsService.js";
import { sendResponse } from "../utils/response.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadWrapper } from "../middlewares/uploadMiddleware.js";
import { deleteCache } from "../utils/redis.js";

const router = Router();

router.get("/", async (req, res, next) => {
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
    const absolutePath = path.resolve(document.file_path);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.original_name}"`,
    );

    res.sendFile(absolutePath);
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
        documentId: document.id,
        user_id: document.user_id,
        filename: document.filename,
        originalName: document.original_name,
        file_path: document.file_path,
        size: req.file.size,
        created_at: document.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await DocumentsService.deleteDocument(req.params.id);
    sendResponse(res, { message: "Document berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

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

export default router;