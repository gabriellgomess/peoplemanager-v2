import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const EditModal = ({ open, handleClose, colaborador }) => {
    
    const [formData, setFormData] = useState({
        ...colaborador,
        dependentes: colaborador.dependentes || []
    });

    // Atualiza o formData sempre que o colaborador prop mudar
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

    const handleDependenteChange = (index, event) => {
        const newDependentes = formData.dependentes.map((dep, idx) => {
            if (idx === index) {
                return { ...dep, [event.target.name]: event.target.value };
            }
            return dep;
        });
        setFormData({ ...formData, dependentes: newDependentes });
    };

    const addDependente = () => {
        const novoDependente = { nome: '', cpf: '' };
        setFormData({ ...formData, dependentes: [...formData.dependentes, novoDependente] });
    };

    const removeDependente = (index) => {
        const newDependentes = formData.dependentes.filter((_, idx) => idx !== index);
        setFormData({ ...formData, dependentes: newDependentes });
    };

    const renderDependenteFields = (dependente, index) => (
        <>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Nome do Dependente"
                    name="nome"
                    value={dependente.nome}
                    onChange={(e) => handleDependenteChange(index, e)}
                />
            </Grid>
            <Grid item xs={5}>
                <TextField
                    fullWidth
                    label="CPF do Dependente"
                    name="cpf"
                    value={dependente.cpf}
                    onChange={(e) => handleDependenteChange(index, e)}
                />
            </Grid>
            <Grid item xs={1}>
                <IconButton onClick={() => removeDependente(index)} color="error">
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </>
    );


    const handleSave = async () => {        
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/updateFuncionario.php`, formData);
            console.log(response.data);
            handleClose();  // Fechar o modal após sucesso
            // Atualizar os dados exibidos na página ou gerenciar o estado global conforme necessário
        } catch (error) {
            console.error('Erro ao salvar os dados!', error);
        }
    };

    const handleCepChange = async (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (value.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
                const { logradouro, complemento, bairro, localidade, uf } = response.data;
                setFormData(prevState => ({
                    ...prevState,
                    endereco: logradouro,
                    bairro: bairro,
                    cidade: localidade,
                    uf: uf
                }));
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>Editar Colaborador</DialogTitle>
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
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='RG'
                    name='rg'
                    value={formData.rg || ''}
                    onChange={handleChange}
                    variant="outlined"
                    required
                />
            </Grid>
            <Grid item xs={12} sm={4}>               
                <FormControl fullWidth required>
                    <InputLabel id="ufRg">UF do RG</InputLabel>
                    <Select
                        labelId="ufRg"
                        name='ufRg'
                        value={formData.ufRg || ''}
                        label="UF do RG"
                        onChange={handleChange}                        
                    >
                        <MenuItem value="AC">Acre</MenuItem>
                        <MenuItem value="AL">Alagoas</MenuItem>
                        <MenuItem value="AP">Amapá</MenuItem>
                        <MenuItem value="AM">Amazonas</MenuItem>
                        <MenuItem value="BA">Bahia</MenuItem>
                        <MenuItem value="CE">Ceará</MenuItem>
                        <MenuItem value="DF">Distrito Federal</MenuItem>
                        <MenuItem value="ES">Espírito Santo</MenuItem>
                        <MenuItem value="GO">Goiás</MenuItem>
                        <MenuItem value="MA">Maranhão</MenuItem>
                        <MenuItem value="MT">Mato Grosso</MenuItem>
                        <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                        <MenuItem value="MG">Minas Gerais</MenuItem>
                        <MenuItem value="PA">Pará</MenuItem>
                        <MenuItem value="PB">Paraíba</MenuItem>
                        <MenuItem value="PR">Paraná</MenuItem>
                        <MenuItem value="PE">Pernambuco</MenuItem>
                        <MenuItem value="PI">Piauí</MenuItem>
                        <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                        <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                        <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                        <MenuItem value="RO">Rondônia</MenuItem>
                        <MenuItem value="RR">Roraima</MenuItem>
                        <MenuItem value="SC">Santa Catarina</MenuItem>
                        <MenuItem value="SP">São Paulo</MenuItem>
                        <MenuItem value="SE">Sergipe</MenuItem>
                        <MenuItem value="TO">Tocantins</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Órgão Expedidor do RG'
                    name='orgaoRg'
                    value={formData.orgaoRg || ''}
                    onChange={handleChange}
                    variant="outlined"
                    required
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Data de Expedição do RG'
                    name='dataExpedicao'
                    value={formData.dataExpedicao || ''}
                    onChange={handleChange}
                    variant="outlined"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='PIS'
                    name='pis'
                    value={formData.pis || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Data de Nascimento'
                    name='dataNascimento'
                    value={formData.dataNascimento || ''}
                    onChange={handleChange}
                    variant="outlined"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Telefone'
                    name='telefone'
                    value={formData.telefone || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Celular'
                    name='celular'
                    value={formData.celular || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Email'
                    name='email'
                    value={formData.email || ''}
                    onChange={handleChange}
                    variant="outlined"
                    type='email'
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    label='CEP'
                    name='cep'
                    value={formData.cep || ''}
                    onChange={handleCepChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={9}>
                <TextField
                    fullWidth
                    label='Endereço'
                    name='endereco'
                    value={formData.endereco || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    label='Número'
                    name='numero'
                    value={formData.numero || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    label='Complemento'
                    name='complemento'
                    value={formData.complemento || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Bairro'
                    name='bairro'
                    value={formData.bairro || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Cidade'
                    name='cidade'
                    value={formData.cidade || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                 <FormControl fullWidth>
                    <InputLabel id="uf">UF</InputLabel>
                    <Select
                        labelId="uf"
                        name='uf'
                        value={formData.uf || ''}
                        label="UF"
                        onChange={handleChange}
                    >
                        <MenuItem value="AC">Acre</MenuItem>
                        <MenuItem value="AL">Alagoas</MenuItem>
                        <MenuItem value="AP">Amapá</MenuItem>
                        <MenuItem value="AM">Amazonas</MenuItem>
                        <MenuItem value="BA">Bahia</MenuItem>
                        <MenuItem value="CE">Ceará</MenuItem>
                        <MenuItem value="DF">Distrito Federal</MenuItem>
                        <MenuItem value="ES">Espírito Santo</MenuItem>
                        <MenuItem value="GO">Goiás</MenuItem>
                        <MenuItem value="MA">Maranhão</MenuItem>
                        <MenuItem value="MT">Mato Grosso</MenuItem>
                        <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                        <MenuItem value="MG">Minas Gerais</MenuItem>
                        <MenuItem value="PA">Pará</MenuItem>
                        <MenuItem value="PB">Paraíba</MenuItem>
                        <MenuItem value="PR">Paraná</MenuItem>
                        <MenuItem value="PE">Pernambuco</MenuItem>
                        <MenuItem value="PI">Piauí</MenuItem>
                        <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                        <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                        <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                        <MenuItem value="RO">Rondônia</MenuItem>
                        <MenuItem value="RR">Roraima</MenuItem>
                        <MenuItem value="SC">Santa Catarina</MenuItem>
                        <MenuItem value="SP">São Paulo</MenuItem>
                        <MenuItem value="SE">Sergipe</MenuItem>
                        <MenuItem value="TO">Tocantins</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
               <TextField
                    fullWidth
                    label='Data de Admissão'
                    name='admissao'
                    value={formData.admissao || ''}
                    onChange={handleChange}
                    variant="outlined"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Salário'
                    name='salario'
                    value={formData.salario || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Código do Cargo'
                    name='codigoCargo'
                    value={formData.codigoCargo || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    fullWidth
                    label='Descrição do Cargo'
                    name='descricaoCargo'
                    value={formData.descricaoCargo || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='CBO'
                    name='cbo'
                    value={formData.cbo || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Código do Centro de Custo'
                    name='codigoCentroCusto'
                    value={formData.codigoCentroCusto || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    fullWidth
                    label='Descrição do Centro de Custo'
                    name='descricaoCentroCusto'
                    value={formData.descricaoCentroCusto || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Nome do Banco'
                    name='nomeBanco'
                    value={formData.nomeBanco || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Conta'
                    name='conta'
                    value={formData.conta || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Agência'
                    name='agencia'
                    value={formData.agencia || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>               
                <FormControl fullWidth>
                    <InputLabel id="tipoConta">Tipo de Conta</InputLabel>
                    <Select
                        labelId="tipoConta"
                        name='tipoConta'
                        value={formData.tipoConta || ''}
                        label="Tipo de Conta"
                        onChange={handleChange}
                    >
                        <MenuItem value="Corrente">Corrente</MenuItem>
                        <MenuItem value="Poupança">Poupança</MenuItem>
                        <MenuItem value="Salário">Salário</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
           
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Grau de Instrução'
                    name='grauInstrucao'
                    value={formData.grauInstrucao || ''}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            {formData.dependentes.map(renderDependenteFields)}
            <Grid item xs={12} container justifyContent="flex-end">
                <Button onClick={addDependente} startIcon={<AddCircleOutlineIcon />} variant="contained" color="primary">
                    Adicionar Dependente
                </Button>
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

export default EditModal;
