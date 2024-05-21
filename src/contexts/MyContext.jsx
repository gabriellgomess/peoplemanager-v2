import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material";
import { ptBR } from "@mui/material/locale";
import { useNavigate } from "react-router-dom";

export const MyContext = createContext();

// Define the base URL
const Axios = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_URL}/login/`,
});

const MyContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [theUser, setTheUser] = useState(null);
  const [theme, setTheme] = useState(createTheme({}, ptBR)); // Estado inicial para o tema

  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn();
  }, []);

  const toggleNav = () => {
    setShowLogin(!showLogin);
  };

  const logoutUser = () => {
    sessionStorage.removeItem("loginToken");
    setIsAuth(false);
    setTheUser(null);
    setTheme(createTheme({}, ptBR)); // Resetar o tema para o padrão
    navigate(`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/`);
  };

  const registerUser = async (user) => {
    const register = await Axios.post("register.php", {
      name: user.name,
      identification: user.identification,
      email: user.email,
      password: user.password,
    });
    return register.data;
  };

  const loginUser = async (user) => {
    const login = await Axios.post("login.php", {
      email: user.email,
      password: user.password,
    });
    return login.data;
  };

  const fetchTheme = async (idClient) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/handle_theme/get_theme.php?id_client=${idClient}`);
      if (response.data.success) {
        const themeSettings = response.data.theme;
        const loadedTheme = createTheme({
          palette: {
            primary: { main: themeSettings.primary_color },
            success: { main: themeSettings.success_color },
            warning: { main: themeSettings.warning_color },
            error: { main: themeSettings.error_color },
            info: { main: themeSettings.info_color },
            background: { default: themeSettings.background_color },
            text: { primary: themeSettings.text_color },
          },
          shape: {
            borderRadius: themeSettings.border_radius,
          },
        }, ptBR);
        setTheme(loadedTheme);
      }
    } catch (error) {
      console.error("Erro ao carregar o tema:", error);
    }
  };

  const isLoggedIn = async () => {
    const loginToken = sessionStorage.getItem("loginToken");
    if (loginToken) {
      Axios.defaults.headers.common["Authorization"] = "bearer " + loginToken;
      const { data } = await Axios.get("user-info.php");
      if (data.success && data.user) {
        setIsAuth(true);
        setTheUser(data.user);
        fetchTheme(data.user.id); // Carregar o tema após o login ser confirmado
      }
    }
  };

  const contextValue = {
    rootState: { showLogin, isAuth, theUser },
    toggleNav,
    isLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <ThemeProvider theme={theme}>
      <MyContext.Provider value={contextValue}>
        {children}
      </MyContext.Provider>
    </ThemeProvider>
  );
};

export default MyContextProvider;
