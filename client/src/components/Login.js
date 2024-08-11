import React, { useState, useEffect } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function Login({ setIsAuth, setGotAcc }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const cookies = new Cookies();
  const login = () => {
    setErrorMessage(null);
    Axios.post(
      "https://tic-tac-toe-multiplayer-server-theta.vercel.app/login",
      {
        username,
        password,
      }
    ).then((res) => {
      const { firstName, lastName, username, token, userId } = res.data;
      if (firstName) {
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);
        setIsAuth(true);
        setGotAcc(true);
      } else {
        setErrorMessage("Username or password incorrect");
      }
    });
  };
  const handleLinkClick = () => {
    setGotAcc(false);
  };
  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
    }
  }, [errorMessage]);

  const defaultTheme = createTheme();

  return (
    <div className="login-container">
      <img className="signup-title" src="/signupTitle.avif" alt="tictactoe" />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar
              sx={{ m: 1, bgcolor: "secondary.main" }}
              aria-label="An image of a lock"
            >
              <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="Username"
                label="Username"
                name="Username"
                inputProps={{
                  "aria-label": "input your username here",
                }}
                onChange={(event) => {
                  event.preventDefault();
                  setUsername(event.target.value);
                }}
              />
              <TextField
                inputProps={{
                  "aria-label": "input your password here",
                }}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Button
                    onClick={handleLinkClick}
                    className="link-button"
                    variant="text"
                  >
                    Don't have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
export default Login;
