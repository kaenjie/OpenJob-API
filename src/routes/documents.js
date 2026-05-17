import { Router } from "express";
import DocumentsService from "../services/DocumentsService.js";
import { sendResponse } from "../utils/response.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

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
    sendResponse(res, {
      message: "Berhasil mendapatkan document",
      data: { document },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authMiddleware,
  upload.single("document"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: "failed", message: "File tidak ditemukan" });
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
        data: { document },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await DocumentsService.deleteDocument(req.params.id);
    sendResponse(res, { message: "Document berhasil dihapus" });
  } catch (err) {
    next(err);
  }
});

export default router;
