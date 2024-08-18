import React, { useState, useEffect } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import Cookies from "universal-cookie";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import "./Chat.css";
import CircularProgress from "@mui/material/CircularProgress";
function Game({ channel, setChannel, updateDbCount, setUpdateDbCount }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const [player, setPlayer] = useState("X");
  const cookies = new Cookies();

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  const Container = styled("div")({
    width: "500px",
    height: "500px",
    backgroundColor: (theme) => theme.palette.background.default,
    border: (theme) => `1px solid ${theme.palette.background.paper}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });

  useEffect(() => {
    const writeResultToDb = async (userResult) => {
      const endResultData = {
        userUsername: cookies.get("username"),
        opponentUsername: cookies.get("opponentUsername"),
        endResult: userResult,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/game/endResult`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(endResultData),
          }
        );
        setUpdateDbCount(updateDbCount + 1);
        if (!response.ok) {
          throw new Error("Failed to send end result data");
        }
      } catch (err) {
        console.error("Error in writeResultToDb:", err.message);
      }
    };

    if (result.state != "none") {
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
  }, [result.state]);

  const handleLeaveGame = async () => {
    await channel.stopWatching();
    setChannel(null);
    setPlayersJoined(false);
    setResult({ winner: "none", state: "none" });
    setPlayer("X");
  };
  const renderResultMessage = () => {
    if (result.state === "won") {
      const message =
        result.winner === player ? "You won the game!" : "You lost the game!";
      const className =
        result.winner === player
          ? "green-background-color"
          : "red-background-color";
      return { message, className };
    } else if (result.state === "tie") {
      return { message: "Game Tie", className: "yellow-background-color" };
    }
    return null;
  };
  const resultData = renderResultMessage();

  if (!playersJoined) {
    return (
      <div className="horizontal-center">
        <div className="loading-container">
          <CircularProgress />
          <h3>Waiting for your opponent to join... </h3>
          <div className="loading-leave-container">
            <Button
              onClick={handleLeaveGame}
              variant="contained"
              sx={{
                width: 80,
                marginTop: "2px",
                marginLeft: "1px",
                height: 40,
                alignSelf: "flex-end",
              }}
            >
              Leave
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="game-container">
      {resultData && (
        <div className={`result-container ${resultData.className}`}>
          <h3>{resultData.message}</h3>
        </div>
      )}
      <div className="board-and-chat-container">
        <Board
          result={result}
          setResult={setResult}
          player={player}
          setPlayer={setPlayer}
        />
        <div className="chat-container">
          <div className="stream-chat">
            <Window>
              <MessageList
                disableDateSeparator
                closeReactionSelectorOnClick
                hideDeletedMessages
                messageActions={["react"]}
              />
              <MessageInput noFiles />
            </Window>
          </div>

          <Button
            onClick={handleLeaveGame}
            variant="contained"
            sx={{
              width: 120,
              marginTop: "2px",
              marginLeft: "1px",
              height: 55,
              alignSelf: "flex-end",
            }}
          >
            Leave Game
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Game;
