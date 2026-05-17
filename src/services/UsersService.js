import pool from "../utils/db.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import NotFoundError from "../exceptions/NotFoundError.js";
import ClientError from "../exceptions/ClientError.js";

class UsersService {
  async register({ name, email, password, role = "applicant" }) {
    const check = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (check.rows.length > 0)
      throw new ClientError("Email sudah terdaftar", 400);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role",
      [id, name, email, hashedPassword, role],
    );
    return result.rows[0];
  }

  async getUserById(id) {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0)
      throw new NotFoundError("User tidak ditemukan");
    return result.rows[0];
  }

  async verifyCredential(email, password) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0)
      throw new ClientError("Email atau password salah", 401);

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new ClientError("Email atau password salah", 401);

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}

export default new UsersService();
