import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';


const SmsModal = ({ open, handleClose, colaborador }) => {
    const [message, setMessage] = useState('');
    const maxChars = 120;

    const handleSendSms = () => {
        const smsData = {
            telefone: colaborador.celular,
            nome: colaborador.nome.split(' ')[0],
            message: message
        };
        axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/sendSMS.php`, smsData)
            .then(response => {
                console.log('SMS sent successfully');
                handleClose();
            })
            .catch(error => {
                console.error('Error sending SMS', error);
            });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2">
                    Enviar SMS para {colaborador.nome?.split(' ')[0]}
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Telefone"
                    value={colaborador.celular}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Mensagem"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    helperText={`${message.length}/${maxChars}`}
                    inputProps={{
                        maxLength: maxChars,
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleSendSms} disabled={message.length === 0}>
                    Enviar
                </Button>
            </Box>
        </Modal>
    );
};

export default SmsModal;
