import React, { useState } from "react";

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

function SignUp({ setIsAuth, setGotAcc }) {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);
  const defaultTheme = createTheme();

  const handleLinkClick = () => {
    setGotAcc(true);
  };

  const SignUp = () => {
    Axios.post("http://localhost:3001/signup", user).then((res) => {
      const { token, userId, firstName, lastName, username, hashedPassword } =
        res.data;
      if (token) {
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);
        cookies.set("hashedPassword", hashedPassword);
        setIsAuth(true);
        setGotAcc(true);
      } else {
        console.log("sign up failed");
      }
    });
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: "secondary.main" }}
            aria-label="An image of a lock"
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  inputProps={{
                    "aria-label": "input your first name here",
                  }}
                  onChange={(event) => {
                    setUser({ ...user, firstName: event.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  inputProps={{
                    "aria-label": "input your last name here",
                  }}
                  onChange={(event) => {
                    setUser({ ...user, lastName: event.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  inputProps={{
                    "aria-label": "input your username here",
                  }}
                  onChange={(event) => {
                    setUser({ ...user, username: event.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputProps={{
                    "aria-label": "input your password here",
                  }}
                  onChange={(event) => {
                    setUser({ ...user, password: event.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => {
                e.preventDefault();
                SignUp();
              }}
            >
              {" "}
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                {/* <Link href='/' onClick={handleLinkClick} variant="body2">
                  Already have an account? Sign in
                </Link> */}
                <Button
                  onClick={handleLinkClick}
                  className="link-button"
                  variant="text"
                >
                  Already have an account? Sign in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
