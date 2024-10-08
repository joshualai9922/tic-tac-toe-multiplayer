# ⚡️ Real-Time Multiplayer Tic-Tac-Toe with Chat and History

### Description

Get ready for some head-to-head fun with this interactive Tic-Tac-Toe game! Challenge your friends or random opponents to real-time matches, chat with them during the game, and review game history for past battles.

### Key Features

- **Real-Time Multiplayer**: Unleash your competitive spirit by playing against friends or other online players.
- **Live Chat**: Engage with your opponent throughout the game, adding a social layer to the classic Tic-Tac-Toe experience.
- **Game History**: Track your past matches and analyze your strategies to become an unstoppable Tic-Tac-Toe master!

### Tech stack

- PostgreSQL
- Express
- React.js
- Node.js
- StreamChat API

## Getting Started

### How to play via live url

- https://tic-tac-toe-multiplayer-game-client.vercel.app   
(Note: if playing on 1 machine, open in 2 tabs, 1 incognito and 1 non-incognito as login authentication uses cookies)

### How to play locally

- Head to `server/db.js` and change the configuration to connect local Db (see comments in `server/db.js`)
- Execute `server/db.js` to create the database table
- Create a `.env` file for the client & server folders with the following keys

  ```
  REACT_APP_STREAM_API_SECRET
  REACT_APP_STREAM_API_KEY
  REACT_APP_BACKEND_URL
  POSTGRESQL_PASSWORD
  POSTGRESQL_USER
  POSTGRESQL_HOST
  POSTGRESQL_PORT
  ```

- Install dependencies via `npm install` then run `npm start` in both client & server folders:

  ```
  cd client
  npm install
  npm start
  ```

  In another terminal, run

  ```
  cd server
  npm install
  npm start
  ```

- Go to localhost:3000 in 2 browser tabs (1 incognito, 1 non-incognito because login authentication uses cookies)
- Have fun!
