import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography, Card, CardContent, CardActions } from "@mui/material";
import { MyContext } from "../contexts/MyContext";

function Login() {
  const { toggleNav, loginUser, isLoggedIn } = useContext(MyContext);

  const initialState = {
    userInfo: {
      email: "",
      password: "",
    },
    errorMsg: "",
    successMsg: "",
  };

  const [state, setState] = useState(initialState);

  const onChangeValue = (e) => {
    setState({
      ...state,
      userInfo: {
        ...state.userInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const data = await loginUser(state.userInfo);
    if (data.success && data.token) {
      setState({
        ...initialState,
      });
      sessionStorage.setItem("loginToken", data.token);
      await isLoggedIn();
    } else {
      setState({
        ...state,
        successMsg: "",
        errorMsg: data.message,
      });
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
          Login
        </Typography>
        <Box component="form" onSubmit={submitForm} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={state.userInfo.email}
            onChange={onChangeValue}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={state.userInfo.password}
            onChange={onChangeValue}
          />
          {state.errorMsg && (
            <Typography color="error" sx={{ mt: 2 }}>
              {state.errorMsg}
            </Typography>
          )}
          {state.successMsg && (
            <Typography color="primary" sx={{ mt: 2 }}>
              {state.successMsg}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Button
            onClick={toggleNav}
            fullWidth
            variant="outlined"
          >
            Cadastrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Login;
