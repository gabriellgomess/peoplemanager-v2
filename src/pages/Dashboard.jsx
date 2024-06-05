import React, { useEffect, useState } from 'react';
import ChartPieCCusto from '../components/ChartPieCCusto';
import ChartPieCargo from '../components/ChartPieCargo';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
const Dashboard = () => {
    const [data, setData] = useState({
        total: 0,
        trabalhando: 0,
        demitido: 0,
        masculino: 0,
        feminino: 0,
});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/countFunc.php`);
                setData(result.data);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    },[]);


    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="p">
                                Total de Funcionários desde a fundação
                            </Typography>
                            <Typography variant="h3" component="h2">
                                {data.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="p">
                                Funcionários Trabalhando
                            </Typography>
                            <Typography variant="h3" component="h2">
                                {data.trabalhando}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="p">
                                Funcionários que já foram demitidos
                            </Typography>
                            <Typography variant="h3" component="h2">
                                {data.demitido}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{background: '#6296b7'}}>
                        <CardContent>
                            <Typography variant="p">
                                Funcionários do sexo Masculino
                            </Typography>
                            <Typography variant="h3" component="h2">
                                {data.masculino}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{background: '#F7CAC9'}}>
                        <CardContent>
                            <Typography variant="p">
                                Funcionários do sexo Feminino
                            </Typography>
                            <Typography variant="h3" component="h2">
                                {data.feminino}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <div style={{display: 'flex', gap: '30px', marginTop: '30px'}}>
                <ChartPieCCusto />   
                <ChartPieCargo />   
            </div> 
                 
        </div>
    )

}

export default Dashboard;