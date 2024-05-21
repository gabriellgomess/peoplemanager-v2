import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography, Card, CardContent } from "@mui/material";
import { MyContext } from "../contexts/MyContext";

function Register() {
  const { toggleNav, registerUser } = useContext(MyContext);
  const initialState = {
    userInfo: {
        name: "",
        identification: "",
        email: "",
        password: "",
    },
    errorMsg: "",
    successMsg: "",
  };
  const [state, setState] = useState(initialState);

  const submitForm = async () => {
    const data = await registerUser(state.userInfo);
    if (data.success) {
      setState({
        ...initialState,
        successMsg: data.message,
      });
    } else {
      setState({
        ...state,
        successMsg: "",
        errorMsg: data.message,
      });
    }
  };

  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Cadastro de Usuário
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
          <TextField
            margin="normal"
            fullWidth
            required
            label="Nome"
            name="name"
            value={state.userInfo.name}
            onChange={(e) => setState({ ...state, userInfo: { ...state.userInfo, name: e.target.value } })}
            placeholder="Digite seu nome completo"
          />
          <TextField
            margin="normal"
            fullWidth
            required
            label="Matrícula"
            name="identification"
            value={state.userInfo.identification}
            onChange={(e) => setState({ ...state, userInfo: { ...state.userInfo, identification: e.target.value } })}
            placeholder="Digite a matrícula do usuário"
          />
          <TextField
            margin="normal"
            fullWidth
            required
            label="Usuário"
            type="email"
            name="email"
            value={state.userInfo.email}
            onChange={(e) => setState({ ...state, userInfo: { ...state.userInfo, email: e.target.value } })}
            placeholder="Digite seu usuário"
          />
          <TextField
            margin="normal"
            fullWidth
            required
            label="Senha"
            type="password"
            name="password"
            value={state.userInfo.password}
            onChange={(e) => setState({ ...state, userInfo: { ...state.userInfo, password: e.target.value } })}
            placeholder="Digite sua senha"
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
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, width: '100%' }}>
            Cadastrar
          </Button>
          {/* <Button variant="outlined" sx={{ mt: 1, mb: 2, width: '100%' }} onClick={toggleNav}>
            Entrar
          </Button> */}
        </Box>
      </CardContent>
    </Card>
  );
}

export default Register;
