import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./db.js";
dotenv.config();
const app = express();

// Use CORS middleware for all routes
app.use(cors());

// Handle OPTIONS requests for all routes
app.options("*", cors()); // Or specify specific routes if needed

app.use(express.json());
const api_key = process.env.REACT_APP_STREAM_API_KEY;
const api_secret = process.env.REACT_APP_STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);
const dbTableName = process.env.POSTGRESQL_TABLE_NAME;

app.post("/signup", async (req, res) => {
  try {
    let errorMessage = undefined;
    const { firstName, lastName, username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username });
    if (!firstName || !lastName || !username || !password) {
      errorMessage = "Please enter all fields";
    } else if (password.length < 6) {
      errorMessage = "Password must be a least 6 characters long";
    } else if (users.length > 0) {
      errorMessage = "Account already registered";
    }
    if (errorMessage) {
      res.json({
        status: "fail",
        error: errorMessage,
      });
    } else {
      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = serverClient.createToken(userId);
      res.json({
        status: "success",
        token,
        userId,
        firstName,
        lastName,
        username,
        hashedPassword,
      });
    }
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
    } else {
      res.json({
        status: "fail",
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

    console.log(
      "josh sent to db { userUsername, opponentUsername, endResult }",
      userUsername + "," + opponentUsername + "," + endResult
    );

    res.status(204).end();
  } catch (err) {
    console.error(`Error at /game/endResult request: ${err.message}`);
  }
});

app.get("/game/history", async (req, res) => {
  try {
    const { userUsername } = req.query;
    const games = await pool.query(
      `SELECT * FROM ${dbTableName} WHERE user_username = $1`,
      [userUsername]
    );

    res.json(games.rows); // Return all rows, not just the first one
  } catch (err) {
    console.error(`Error at /game/history request: ${err.message}`);
  }
});

// for local
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

// this is for deployment on railway
// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
