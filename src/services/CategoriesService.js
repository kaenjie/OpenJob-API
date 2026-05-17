import pool from "../utils/db.js";
import { nanoid } from "nanoid";
import NotFoundError from "../exceptions/NotFoundError.js";

class CategoriesService {
  async createCategory({ name }) {
    const id = `category-${nanoid(16)}`;
    const result = await pool.query(
      "INSERT INTO categories (id, name) VALUES ($1,$2) RETURNING *",
      [id, name],
    );
    return result.rows[0];
  }

  async getAllCategories() {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY created_at DESC",
    );
    return result.rows;
  }

  async getCategoryById(id) {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      throw new NotFoundError("Category tidak ditemukan");
    return result.rows[0];
  }

  async updateCategory(id, { name }) {
    const result = await pool.query(
      "UPDATE categories SET name=$1 WHERE id=$2 RETURNING *",
      [name, id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Category tidak ditemukan");
    return result.rows[0];
  }

  async deleteCategory(id) {
    const result = await pool.query(
      "DELETE FROM categories WHERE id=$1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("Category tidak ditemukan");
  }
}

export default new CategoriesService();
