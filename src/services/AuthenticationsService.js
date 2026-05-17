import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import AuthenticationError from "../exceptions/AuthenticationError.js";

class AuthenticationsService {
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: "3h" });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async saveRefreshToken(token) {
    await pool.query("INSERT INTO authentications (token) VALUES ($1)", [
      token,
    ]);
  }

  async checkRefreshToken(token) {
    const result = await pool.query(
      "SELECT token FROM authentications WHERE token = $1",
      [token],
    );
    return result.rows.length > 0;
  }

  async verifyRefreshToken(token) {
    const result = await pool.query(
      "SELECT token FROM authentications WHERE token = $1",
      [token],
    );
    if (result.rows.length === 0) {
      const err = new AuthenticationError("Refresh token tidak valid");
      err.name = "AuthenticationError";
      throw err;
    }
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return decoded;
    } catch {
      const err = new AuthenticationError("Refresh token tidak valid");
      err.name = "AuthenticationError";
      throw err;
    }
  }

  async deleteRefreshToken(token) {
    await pool.query("DELETE FROM authentications WHERE token = $1", [token]);
  }
}

export default new AuthenticationsService();
