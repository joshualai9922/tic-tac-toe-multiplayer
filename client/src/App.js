import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import JoinGame from "./components/JoinGame";
import Button from "@mui/material/Button";

function App() {
  const api_key = process.env.REACT_APP_STREAM_API_KEY;
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);
  const [gotAcc, setGotAcc] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }
  return (
    <>
      {isAuth ? (
        <div className="post-login-container">
          <Chat client={client}>
            <div className="logout-button-container">
              <Button
                variant="outlined"
                color="error"
                className="logout-button"
                onClick={logOut}
                sx={{
                  alignSelf: "flex-end", // Correct property value
                  marginTop: "45px", // Correct property value
                  marginRight: "80px", // Correct property value
                }}
              >
                {" "}
                Logout
              </Button>
            </div>
            <JoinGame />
          </Chat>
        </div>
      ) : gotAcc ? (
        <div className="App">
          <Login setIsAuth={setIsAuth} setGotAcc={setGotAcc} />
        </div>
      ) : (
        <div className="App">
          <SignUp setIsAuth={setIsAuth} setGotAcc={setGotAcc} />
        </div>
      )}
    </>
  );
}

export default App;
