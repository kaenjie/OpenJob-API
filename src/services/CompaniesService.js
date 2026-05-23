import pool from "../utils/db.js";
import { nanoid } from "nanoid";
import NotFoundError from "../exceptions/NotFoundError.js";

class CompaniesService {
  async createCompany({ user_id, name, description, location, website }) {
    const id = `company-${nanoid(16)}`;
    const result = await pool.query(
      "INSERT INTO companies (id, user_id, name, description, location, website) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, user_id, name, description, location, website",
      [id, user_id, name, description, location, website],
    );
    return result.rows[0];
  }

  async getAllCompanies() {
    const result = await pool.query(
      "SELECT id, user_id, name, description, location, website FROM companies ORDER BY created_at DESC",
    );
    return result.rows;
  }

  async getCompanyById(id) {
    const result = await pool.query(
      "SELECT id, user_id, name, description, location, website FROM companies WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Company tidak ditemukan");
    return result.rows[0];
  }

  async updateCompany(id, { name, description, location, website }) {
    const result = await pool.query(
      "UPDATE companies SET name=$1, description=$2, location=$3, website=$4, updated_at=current_timestamp WHERE id=$5 RETURNING id, user_id, name, description, location, website",
      [name, description, location, website, id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Company tidak ditemukan");
    return result.rows[0];
  }

  async deleteCompany(id) {
    const result = await pool.query(
      "DELETE FROM companies WHERE id=$1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Company tidak ditemukan");
  }
}

export default new CompaniesService();
