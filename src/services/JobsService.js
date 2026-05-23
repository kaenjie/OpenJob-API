import pool from "../utils/db.js";
import { nanoid } from "nanoid";
import NotFoundError from "../exceptions/NotFoundError.js";
import ClientError from "../exceptions/ClientError.js";

class JobsService {
  async createJob({
    company_id,
    category_id,
    title,
    description,
    location,
    salary_min,
    salary_max,
    job_type,
  }) {
    const id = `job-${nanoid(16)}`;
    const result = await pool.query(
      "INSERT INTO jobs (id, company_id, category_id, title, description, location, salary_min, salary_max, job_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [
        id,
        company_id,
        category_id,
        title,
        description,
        location,
        salary_min,
        salary_max,
        job_type,
      ],
    );
    return result.rows[0];
  }

  async getAllJobs(query = {}) {
    const { title, "company-name": companyName } = query;
    let sql = `
      SELECT j.*, c.name AS company_name, c.location AS company_location
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (title) {
      params.push(`%${title}%`);
      sql += ` AND j.title ILIKE $${params.length}`;
    }
    if (companyName) {
      params.push(`%${companyName}%`);
      sql += ` AND c.name ILIKE $${params.length}`;
    }

    sql += " ORDER BY j.created_at DESC";
    const result = await pool.query(sql, params);
    return result.rows;
  }

  async getJobById(id) {
    const result = await pool.query(
      `SELECT j.*, c.name AS company_name
       FROM jobs j LEFT JOIN companies c ON j.company_id = c.id
       WHERE j.id = $1`,
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Job tidak ditemukan");
    return result.rows[0];
  }

  async getJobsByCompany(companyId) {
    const result = await pool.query(
      "SELECT * FROM jobs WHERE company_id = $1 ORDER BY created_at DESC",
      [companyId],
    );
    return result.rows;
  }

  async getJobsByCategory(categoryId) {
    const result = await pool.query(
      "SELECT * FROM jobs WHERE category_id = $1 ORDER BY created_at DESC",
      [categoryId],
    );
    return result.rows;
  }

  async updateJob(id, body) {
    const fields = [];
    const values = [];
    let idx = 1;

    const allowedMap = {
      company_id:
        body.company_id !== undefined ? body.company_id : body.companyId,
      category_id:
        body.category_id !== undefined ? body.category_id : body.categoryId,
      title: body.title,
      description: body.description,
      location: body.location,
      salary_min:
        body.salary_min !== undefined ? body.salary_min : body.salaryMin,
      salary_max:
        body.salary_max !== undefined ? body.salary_max : body.salaryMax,
      job_type: body.job_type !== undefined ? body.job_type : body.jobType,
    };

    for (const [key, value] of Object.entries(allowedMap)) {
      if (value !== undefined) {
        fields.push(`${key}=$${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (fields.length === 0)
      throw new ClientError("Tidak ada field yang diupdate", 400);

    values.push(id);

    const result = await pool.query(
      `UPDATE jobs SET ${fields.join(", ")}, updated_at=current_timestamp WHERE id=$${idx} RETURNING *`,
      values,
    );

    if (result.rows.length === 0)
      throw new NotFoundError("Job tidak ditemukan");
    return result.rows[0];
  }

  async deleteJob(id) {
    const result = await pool.query(
      "DELETE FROM jobs WHERE id=$1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Job tidak ditemukan");
  }
}

export default new JobsService();
