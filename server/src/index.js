import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./db.js";
dotenv.config({ path: ".env.local" });
const app = express();

app.use(cors());
app.use(express.json());
const api_key = process.env.REACT_APP_STREAM_API_KEY;
const api_secret = process.env.REACT_APP_STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);
const dbTableName = process.env.POSTGRESQL_DATABASE;

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username });
    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

// POSTGRESQL DB ROUTE
app.post("/game/endResult", async (req, res) => {
  try {
    const { userUsername, opponentUsername, endResult } = req.body;

    await pool.query(
      `INSERT INTO ${dbTableName} (user_username, opponent_username, result) VALUES ($1, $2, $3)`,
      [userUsername, opponentUsername, endResult]
    );

    res.status(204).end();
  } catch (err) {
    console.error(`Error at /game/endResult request: ${err.message}`);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
