import React, { useState, Fragment, useEffect } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";
import Cookies from "universal-cookie";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { sizing } from "@mui/system";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
function JoinGame() {
  const cookies = new Cookies();
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [rows, setRows] = useState([]);
  const [updateDbCount, setUpdateDbCount] = useState(0);
  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0) {
      alert("User not found");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
    cookies.set("opponentUsername", rivalUsername, { path: "/" });
  };

  const userUsername = cookies.get("username");

  const [gameHistory, setGameHistory] = useState([]);
  const getHistory = async () => {
    try {
      const response = await fetch(
        `https://tic-tac-toe-multiplayer-server-theta.vercel.app/game/history?userUsername=${encodeURIComponent(
          userUsername
        )}`
      );
      const jsonData = await response.json();
      setGameHistory(jsonData);
    } catch (err) {
      console.error("error at getHistory:", err.message);
    }
  };

  useEffect(() => {
    getHistory();
  }, [updateDbCount]);

  //DATA LOGIC//

  // Modify the result based on the conditions

  useEffect(() => {
    const updatedGameHistory = gameHistory.map((history) => {
      return {
        result: history.result,
        player: history.opponent_username,
      };
    });

    setRows(updatedGameHistory);
  }, [gameHistory]);

  ////for the table/////
  const columns = [
    { id: "player", label: "Opponent Name", minWidth: 170 },

    {
      id: "result",
      label: "Result",
      minWidth: "50%",
      format: (value) => value.toFixed(2),
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game
            channel={channel}
            setChannel={setChannel}
            updateDbCount={updateDbCount}
            setUpdateDbCount={setUpdateDbCount}
          />
        </Channel>
      ) : (
        // <div className="joinGame">
        //   <h4>Create Game</h4>
        //   <input
        //     placeholder="Username of rival..."
        //     onChange={(event) => {
        //       setRivalUsername(event.target.value);
        //     }}
        //   />
        //   <button onClick={createChannel}> Join/Start Game</button>
        // </div>
        <div className="joinGame">
          <div className="tic-tac-toe-drawing-container">
            <img
              className="tic-tac-toe-drawing"
              src="/ticTacToeDrawing.jpg"
              alt="tictactoe"
            />
          </div>
          <div className="join-game-input-container">
            <TextField
              sx={{
                width: 550,
                height: 55,
              }}
              id="outlined-basic"
              label="Username of opponent"
              variant="outlined"
              onChange={(event) => {
                setRivalUsername(event.target.value);
              }}
            />
            <Button
              sx={{
                width: 120,
                marginLeft: "1px",
                height: 55,
              }}
              variant="contained"
              onClick={createChannel}
            >
              {" "}
              Join Game
            </Button>{" "}
          </div>
          <div className="game-history">
            <Fragment>
              {" "}
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                            id={column.id + "-header"}
                            scope="col"
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              key={row.code}
                              tabIndex={-1}
                              role="row"
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    scope="row"
                                    role="cell"
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Fragment>
          </div>
        </div>
      )}
    </>
  );
}

export default JoinGame;
