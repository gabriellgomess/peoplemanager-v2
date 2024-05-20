import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ShutdownModal = ({ open, handleClose, colaborador }) => {
    
    const [formData, setFormData] = useState({
        ...colaborador,
        dependentes: colaborador.dependentes || []
    });
    
    useEffect(() => {
        setFormData({
            ...colaborador,
            dependentes: colaborador.dependentes || []
        });
    }, [colaborador]);
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSave = async () => {        
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/shutdownFuncionario.php`, formData);
            console.log(response.data);
            handleClose();  // Fechar o modal após sucesso
            // Atualizar os dados exibidos na página ou gerenciar o estado global conforme necessário
        } catch (error) {
            console.error('Erro ao salvar os dados!', error);
        }
    };
    console.log("colaborador: ", colaborador);
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>Formulário de desligamento</DialogTitle>
            <DialogContent>
            <Grid container spacing={2} marginTop='5px'>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    label="Matrícula"
                    name="id"
                    value={formData.id || ''}
                    InputProps={{ readOnly: true }}
                />
            </Grid>
            <Grid item xs={12} sm={9}>
            <TextField
                    fullWidth
                    label='Nome'
                    name='nome'
                    value={formData.nome || ''}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{ readOnly: true }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='CPF'
                    name='cpf'
                    value={formData.cpf || ''}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{ readOnly: true }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField
                    fullWidth
                    label='Data da demissão'
                    name='dataDemissao'
                    value={formData.dataDemissao|| ''}
                    onChange={handleChange}
                    variant="outlined"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={12}>
            <TextField
                    fullWidth
                    label='Motivo da demissão'
                    name='motivoDemissao'
                    value={formData.motivoDemissao || ''}
                    onChange={handleChange}
                    variant="outlined"
                    required
                />
            </Grid>           
        </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSave}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShutdownModal;
