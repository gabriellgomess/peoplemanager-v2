import { useContext } from "react";
import { CssBaseline, Box } from "@mui/material";
import MyContextProvider, { MyContext } from "./contexts/MyContext";

// Pages
import Home from "./pages/Home";
import Template from "./pages/Template";

const App = () => {
  return (
    <MyContextProvider>
      <CssBaseline /> {/* Normaliza o CSS e fornece um background consistente */}
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <AuthenticationSwitch />
        </Box>
      </Box>
    </MyContextProvider>
  );
};

// Componente para alternar entre Home e Template com base na autenticação
function AuthenticationSwitch() {
  const { rootState } = useContext(MyContext);
  const { isAuth } = rootState;

  return isAuth ? <Template /> : <Home />;
}

export default App;
