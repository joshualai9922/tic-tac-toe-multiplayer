import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });
dotenv.config();

const pool = new Pool({
  user: "postgres",
  password: process.env.POSTGRESQL_PASSWORD,
  host: "localhost",
  port: 5432,
  database: process.env.POSTGRESQL_DATABASE,
});

export default pool;
