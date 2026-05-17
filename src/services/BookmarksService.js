import pool from "../utils/db.js";
import { nanoid } from "nanoid";
import NotFoundError from "../exceptions/NotFoundError.js";

class BookmarksService {
  async createBookmark({ user_id, job_id }) {
    const id = `bookmark-${nanoid(16)}`;
    const result = await pool.query(
      "INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1,$2,$3) RETURNING *",
      [id, user_id, job_id],
    );
    return result.rows[0];
  }

  async getBookmarkById(id) {
    const result = await pool.query(
      `
      SELECT b.*, j.title AS job_title
      FROM bookmarks b
      LEFT JOIN jobs j ON b.job_id = j.id
      WHERE b.id = $1
    `,
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Bookmark tidak ditemukan");
    return result.rows[0];
  }

  async deleteBookmarkByUserAndJob(user_id, job_id) {
    const result = await pool.query(
      "DELETE FROM bookmarks WHERE user_id=$1 AND job_id=$2 RETURNING id",
      [user_id, job_id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Bookmark tidak ditemukan");
  }

  async getBookmarksByUser(user_id) {
    const result = await pool.query(
      `
      SELECT b.*, j.title AS job_title, j.location AS job_location
      FROM bookmarks b
      LEFT JOIN jobs j ON b.job_id = j.id
      WHERE b.user_id = $1 ORDER BY b.created_at DESC
    `,
      [user_id],
    );
    return result.rows;
  }

  async getAllBookmarks() {
    const result = await pool.query(`
      SELECT b.*, u.name AS user_name, j.title AS job_title
      FROM bookmarks b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN jobs j ON b.job_id = j.id
      ORDER BY b.created_at DESC
    `);
    return result.rows;
  }
}

export default new BookmarksService();
