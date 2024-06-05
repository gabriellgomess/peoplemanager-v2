import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, List, ListItem } from '@mui/material';
import Party from '../assets/party.png';

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

    // Pegar a data de hoje no formato mm-dd
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const hojeStr = `${mes}-${dia}`;

    console.log('Data de hoje:', hojeStr);
    return (
        <Grid container spacing={2}>
            {Object.keys(aniversariantes).map((mes) => (
                <Grid item xs={12} sm={6} md={6} key={mes}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {meses[mes - 1]}
                            </Typography>
                            <List>
                                {aniversariantes[mes]
                                    ?.sort((a, b) => {
                                        const diaA = parseInt(a.dataNascimento.split('-')[2], 10);
                                        const diaB = parseInt(b.dataNascimento.split('-')[2], 10);
                                        return diaA - diaB;
                                    })
                                    .map((aniversariante, index) => {
                                        const dataNascimento = aniversariante.dataNascimento.split('-');
                                        const btd = `${dataNascimento[1]}-${dataNascimento[2]}`;
                                        return (
                                            <ListItem key={index} sx={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                <Typography color={btd === hojeStr ? 'text.success' : 'text.primary'} sx={{ fontWeight: btd === hojeStr ? 'bold' : '' }}>
                                                    {getFirstAndLastName(aniversariante.nome)} - {dataNascimento.reverse().join('/')}
                                                </Typography>
                                                {btd === hojeStr && <img src={Party} alt="Party" style={{ width: '24px', height: '24px', marginBottom: '5px' }} />}
                                            </ListItem>
                                        );
                                    })}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Aniversariantes;
