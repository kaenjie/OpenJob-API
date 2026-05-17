import pool from "../utils/db.js";
import { nanoid } from "nanoid";
import fs from "fs";
import NotFoundError from "../exceptions/NotFoundError.js";

class DocumentsService {
  async createDocument({ user_id, filename, original_name, file_path }) {
    const id = `doc-${nanoid(16)}`;
    const result = await pool.query(
      "INSERT INTO documents (id, user_id, filename, original_name, file_path) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [id, user_id, filename, original_name, file_path],
    );
    return result.rows[0];
  }

  async getAllDocuments() {
    const result = await pool.query(
      "SELECT * FROM documents ORDER BY created_at DESC",
    );
    return result.rows;
  }

  async getDocumentById(id) {
    const result = await pool.query("SELECT * FROM documents WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      throw new NotFoundError("Document tidak ditemukan");
    return result.rows[0];
  }

  async deleteDocument(id) {
    const result = await pool.query(
      "DELETE FROM documents WHERE id=$1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Document tidak ditemukan");
    const doc = result.rows[0];
    if (fs.existsSync(doc.file_path)) fs.unlinkSync(doc.file_path);
  }
}

export default new DocumentsService();
