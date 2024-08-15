import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

// for running locally
// const pool = new Pool({
//   user: process.env.POSTGRESQL_USER,
//   password: process.env.POSTGRESQL_PASSWORD,
//   host: process.env.POSTGRESQL_HOST,
//   port: process.env.POSTGRESQL_PORT,
//   database: process.env.POSTGRESQL_TABLE_NAME,
// });

// for live hosted url
const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
});

export default pool;
