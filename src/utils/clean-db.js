import pool from "./db.js";
import redisClient from "./redis.js";

const cleanDb = async () => {
  try {
    console.log("Cleaning database...");
    await pool.query(`
      TRUNCATE TABLE applications, bookmarks, documents, jobs, categories, companies, authentications, users CASCADE;
    `);
    console.log("Database cleaned successfully!");
    
    console.log("Flushing Redis cache...");
    await redisClient.flushAll();
    console.log("Redis cache flushed successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Failed to clean database or flush redis:", error);
    process.exit(1);
  }
};

cleanDb();
