import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = new Pool({
  user: "postgres",
  password: process.env.REACT_APP_postgres_password,
  host: "localhost",
  port: 5432,
  database: process.env.REACT_APP_postgres_database,
});

export default pool;
