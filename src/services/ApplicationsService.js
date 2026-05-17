import pool from "../utils/db.js";
import { nanoid } from "nanoid";
import NotFoundError from "../exceptions/NotFoundError.js";

class ApplicationsService {
  async createApplication({ user_id, job_id, cover_letter }) {
    const id = `application-${nanoid(16)}`;
    const result = await pool.query(
      "INSERT INTO applications (id, user_id, job_id, cover_letter) VALUES ($1,$2,$3,$4) RETURNING *",
      [id, user_id, job_id, cover_letter],
    );
    return result.rows[0];
  }

  async getAllApplications() {
    const result = await pool.query(`
      SELECT a.*, u.name AS user_name, j.title AS job_title
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
    `);
    return result.rows;
  }

  async getApplicationById(id) {
    const result = await pool.query(
      `
      SELECT a.*, u.name AS user_name, j.title AS job_title
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1
    `,
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Application tidak ditemukan");
    return result.rows[0];
  }

  async getApplicationsByUser(userId) {
    const result = await pool.query(
      `
      SELECT a.*, j.title AS job_title
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = $1 ORDER BY a.created_at DESC
    `,
      [userId],
    );
    return result.rows;
  }

  async getApplicationsByJob(jobId) {
    const result = await pool.query(
      `
      SELECT a.*, u.name AS user_name
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.job_id = $1 ORDER BY a.created_at DESC
    `,
      [jobId],
    );
    return result.rows;
  }

  async updateApplicationStatus(id, { status }) {
    const result = await pool.query(
      "UPDATE applications SET status=$1, updated_at=current_timestamp WHERE id=$2 RETURNING *",
      [status, id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Application tidak ditemukan");
    return result.rows[0];
  }

  async deleteApplication(id) {
    const result = await pool.query(
      "DELETE FROM applications WHERE id=$1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Application tidak ditemukan");
  }
}

export default new ApplicationsService();
