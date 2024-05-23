import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const Aniversariantes = () => {
    const [aniversariantes, setAniversariantes] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/birthday.php`);
            setAniversariantes(result.data);
        };
        fetchData();
    }, []);

    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const getFirstAndLastName = (nomeCompleto) => {
        const partes = nomeCompleto.split(' ');
        if (partes.length > 1) {
            return `${partes[0]} ${partes[partes.length - 1]}`;
        }
        return nomeCompleto;
    };

    return (
        <Grid container spacing={2}>
            {Object.keys(aniversariantes).map(mes => (
                <Grid item xs={12} sm={6} md={4} key={mes}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {meses[mes - 1]}
                            </Typography>
                            <ul>
                                {aniversariantes[mes].map((aniversariante, index) => (
                                    <li key={index}>
                                        <Typography variant="body1">
                                            {getFirstAndLastName(aniversariante.nome)} - {aniversariante.dataNascimento.split('-').reverse().join('/')}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Aniversariantes;
