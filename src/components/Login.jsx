import React, { useState } from "react";
import "../styles/login.css";
import iconLogo from "../assets/logo.png";
import loginService from "../services/login.js";
import { jwtDecode } from 'jwt-decode'
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const CTextField = styled(TextField)({
  width: "20rem", // Ancho fijo
  margin: "0 auto",
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#4D4DFF", // Cambia el color del borde cuando el campo está en foco
    },
  },
  "& .MuiInputLabel-root": {
    color: "#999", // Color del label en estado normal
    "&.Mui-focused": {
      color: "#4D4DFF", // Cambia el color del label cuando está en foco
    },
  },
});

const CCard = styled(Card)(({ theme }) => ({
  width: "23rem",
  height: "46rem",
  margin: "auto 0", // Centra el Card horizontalmente
  padding: "0rem",
  [theme.breakpoints.up("sm")]: {
    // Ajusta el margen para que el Card se mantenga centrado verticalmente en pantallas más grandes
    marginTop: "2rem",
  },
}));

const CenteredCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Centra horizontalmente
  justifyContent: "center", // Centra verticalmente
  textAlign: "center", // Centra el texto dentro del CardContent
  minHeight: "200px", // Asegura que el CardContent tenga una altura mínima
});

const CenteredContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center", // Centra horizontalmente
  alignItems: "center", // Centra verticalmente
  height: "50vh", // Altura completa de la vista
  padding: "1rem", // Espaciado opcional
}));

const CustomButton = styled(Button)({
  backgroundColor: "#4D4DFF", // Color principal del botón
  color: "#FFFFFF", // Color del texto del botón
  width: "20rem",
  marginTop: "2rem",
  "&:hover": {
    backgroundColor: "#3A3AEE", // Color de fondo al pasar el ratón (más oscuro que el color principal)
  },
});

const WelcomeText = styled(Typography)({
  color: "#4D4DFF", // Color del texto (mismo que el color del botón)
  textAlign: "center",
  marginTop: "2rem",
});

const CustomLink = styled(Link)({
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

function LoginForm() {
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  const handleInputChange = (event) =>{
    const value = event.target.value;
    const id = event.target.id;

    if(id == "email"){
      setUsername(value)
    }
    else{
      setPassword(value)
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
        role: "string"
      });

      setUser(user);
      setUsername("");
      setPassword("");
      console.log(user)
    } catch (e) {
      console.log("error message: error on login")
    }
  }

  return (
    <CenteredContainer>
      <CCard>
        <CenteredCardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Centra la imagen horizontalmente
              mb: 2, // Márgen inferior para separarla del formulario
            }}
          >
            <img
              src={iconLogo}
              alt="Orderit Logo"
              style={{
                width: "100%", // Hace que la imagen sea responsive
                maxWidth: "200px", // Tamaño máximo de la imagen
                height: "auto", // Mantiene la proporción de la imagen
              }}
            />
          </Box>
          <WelcomeText variant="h4" gutterBottom>
            WELCOME!
          </WelcomeText>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            align="center"
            sx={{ mb: "1.5rem" }}
          >
            Please enter your credentials to log in
          </Typography>
          <form onSubmit={handleLogin}>
            <Box>
              <CTextField onChange={handleInputChange}
                id="email"
                type="email"
                label="email"
                variant="outlined"
                placeholder="example@domain.com"
                value={username}
              />
              <CTextField onChange={handleInputChange}
                id="password"
                type="password"
                label="Password"
                variant="outlined"
                placeholder="Enter your password"
                sx={{ marginTop: "1.5rem" }}
                value={password}
              />
              <Box sx={{ display: "inline-flex" }}>
                <FormControlLabel
                  sx={{ marginRight: "2.7rem" }}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleCheckbox}
                      color="primary" // Color del checkbox
                    />
                  }
                  label="Remember me" // Etiqueta para el checkbox
                />
                <CustomLink
                  sx={{ marginTop: "0.7rem" }}
                  href="#"
                  underline="hover"
                  color="primary"
                >
                  Forgot Password?
                </CustomLink>
              </Box>
              <CustomButton
                className="button-margin"
                variant="contained"
                type="submit"
              >
                Log in
              </CustomButton>
            </Box>
          </form>
          <Box sx={{ mt: 2, mt: "10rem" }}>
            <Typography variant="body2" color="textSecondary" align="center">
              Developed by Andrés Uribe.
            </Typography>
          </Box>
        </CenteredCardContent>
      </CCard>
    </CenteredContainer>
  );
}

export default LoginForm;
