import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });
dotenv.config();

// this is for local
// const pool = new Pool({
//   user: "postgres",
//   password: process.env.POSTGRESQL_PASSWORD,
//   host: "localhost",
//   port: 5432,
//   database: process.env.POSTGRESQL_DATABASE,
// });

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

export default pool;
