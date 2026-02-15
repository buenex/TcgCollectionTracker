import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
