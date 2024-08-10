import React, { useState, useEffect } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";
function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const [player, setPlayer] = useState("X");

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  useEffect(() => {
    if (result.state === "won") {
      if (result.winner === player) {
        console.log("I won");
      } else {
        console.log("I lose");
      }
    } else if (result.state === "tie") {
      console.log("I tie");
    }
  }, [result.winner]);

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
        onClick={async () => {
          await channel.stopWatching();
          setChannel(null);
        }}
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
