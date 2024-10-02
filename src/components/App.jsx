import { useState } from "react";
import "../styles/App.css";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import * as React from "react";
import LoginForm from "./Login.jsx";
import Home from "./Home.jsx"
import Orders from "./Orders/Orders.jsx"
import Stack from '@mui/material/Stack';

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const loggedUserJSON = localStorage.getItem('LoggedOrderItAppUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setIsAuthenticated(true)
    }

  },[])

  // Function to simulate login (you can replace this with actual authentication logic)
  const handleLogin = () => {
    setIsAuthenticated(true);  // Set authenticated state to true
  };

  return (
    <>
      {isAuthenticated ? (
        <Home setIsAuthenticated={setIsAuthenticated}/>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
