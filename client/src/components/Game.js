import React, { useState, useEffect } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import Cookies from "universal-cookie";
import "./Chat.css";
function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const [player, setPlayer] = useState("X");
  const cookies = new Cookies();

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  useEffect(() => {
    const writeResultToDb = async (userResult) => {
      const endResultData = {
        userUsername: cookies.get("username"),
        opponentUsername: cookies.get("opponentUsername"),
        endResult: userResult,
      };

      try {
        const response = await fetch("http://localhost:3001/game/endResult", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(endResultData),
        });

        if (!response.ok) {
          throw new Error("Failed to send end result data");
        }
      } catch (err) {
        console.error("Error in writeResultToDb:", err.message);
      }
    };

    if (result.winner != "none") {
      let userResult;
      if (result.state === "won") {
        if (result.winner === player) {
          userResult = "win";
        } else {
          userResult = "lose";
        }
      } else if (result.state === "tie") {
        userResult = "tie";
      }
      writeResultToDb(userResult);
    }
  }, [result.winner]);

  const handleLeaveGame = async () => {
    await channel.stopWatching();
    setChannel(null);
    setPlayersJoined(false);
    setResult({ winner: "none", state: "none" });
    setPlayer("X");
  };

  if (!playersJoined) {
    return <div> Waiting for other player to join...</div>;
  }
  return (
    <div className="gameContainer">
      <Board
        result={result}
        setResult={setResult}
        player={player}
        setPlayer={setPlayer}
      />
      <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={["react"]}
        />
        <MessageInput noFiles />
      </Window>
      <button
        onClick={handleLeaveGame}
        // {async () => {
        //   await channel.stopWatching();
        //   setChannel(null);
        // }}
      >
        {" "}
        Leave Game
      </button>
      {result.state === "won" && <div> {result.winner} Won The Game</div>}
      {result.state === "tie" && <div> Game Tieds</div>}
    </div>
  );
}

export default Game;
