import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../contexts/MyContext';
import {
  TextField,
  Button,
  Grid
} from '@mui/material';
import axios from 'axios';

const ParameterSettings = () => {

  const [parameters, setParameters] = useState({
    id_client: '',
    primary_color: '',
    success_color: '',
    warning_color: '',
    error_color: '',
    info_color: '',
    background_color: '',
    text_color: '',
    border_radius: '',
  });

    const {rootState} = useContext(MyContext);
    const {theUser} = rootState;

    console.log("user: ", theUser);

  useEffect(() => {
    // Fetch parameters from the backend
    axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/getParameters.php?id_client=${theUser.id}`)
      .then(response => {
        setParameters(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setParameters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // set the client id
    parameters.id_client = theUser.id;
    // Save parameters to the backend
    axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/saveParameters.php`, parameters)
      .then(response => {
        console.log('Parâmetros salvos:', response.data);
      })
      .catch(error => {
        console.error('Error saving data:', error);
      });
  };

  return (
    <div>
      <h1>Configurações de parâmetros</h1>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="primary_color"
            name="primary_color"
            label="Cor primária"
            type="color"
            value={parameters.primary_color || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="success_color"
            name="success_color"
            label="Cor de sucesso"
            type="color"
            value={parameters.success_color || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="warning_color"
            name="warning_color"
            label="Cor de aviso"
            type="color"
            value={parameters.warning_color || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="error_color"
            name="error_color"
            label="Cor de erro"
            type="color"
            value={parameters.error_color || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="info_color"
            name="info_color"
            label="Cor de informação"
            type="color"
            value={parameters.info_color || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="background_color"
            name="background_color"
            label="Cor de fundo"
            type="color"
            value={parameters.background_color || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="text_color"
            name="text_color"
            label="Cor do texto"
            type="color"
            value={parameters.text_color || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            id="border_radius"
            name="border_radius"
            label="Raio da borda"
            type="number"
            value={parameters.border_radius || ''}
            onChange={handleChange}
          />
        </Grid>       
        
      </Grid>
        <Button sx={{marginTop: '15px'}} variant="contained" onClick={handleSubmit}>
            Salvar
        </Button>
    </div>
  );
};

export default ParameterSettings;
