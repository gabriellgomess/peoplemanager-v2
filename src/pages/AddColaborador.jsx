import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';

const AddColaborador = () => {
    const [formData, setFormData] = useState({        
        nome: '',
        cpf: '',
        rg: '',
        orgaoRg: '',
        ufRg: '',
        dataExpedicao: '',
        dataNascimento: '',
        sexo: '',
        estadoCivil: '',
        endereco: '',
        numero: '',
        bairro: '',
        cep: '',
        cidade: '',
        ufEnd: '',
        paisNascimento: '',
        cidadeNascimento: '',
        ufNasc: '',
        telefone: '',
        celular: '',
        email: '',
        admissao: '',
        situacao: 'Trabalhando',
        codCargo: '',
        descricaoCargo: '',
        cbo: '',
        codDpto: '',
        descricaoDpto: '',
        codCcusto: '',
        descricaoCcusto: '',
        codServico: '',
        descricaoServico: '',
        salario: '',
        jornada: '',
        ctps: '',
        serieCtps: '',
        ufCtps: '',
        pis: '',
        grauInstrucao: '',
        nomeBanco: '',
        agencia: '',
        conta: '',
        tipoConta: '',
        sindicato: '',
        codSind: '',
        codEsocial: '',
        reabilitado: '',
        possuiDeficiencia: '',
        deficienciaAuditiva: '',
        deficienciaFisica: '',
        deficienciaIntelectual: '',
        deficienciaMental: '',
        deficienciaVisual: '',
        outraDeficiencia: '',
        racaCor: '',
        secao: '',
        titulo: '',
        zona: '',
        dependentes: []        
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                    ufEnd: uf
                }));
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleDependenteChange = (index, event) => {
        const { name, value } = event.target;
        const newDependentes = formData.dependentes.map((dep, idx) => {
            if (idx === index) {
                return { ...dep, [name]: value };
            }
            return dep;
        });
        setFormData({ ...formData, dependentes: newDependentes });
    };

    const addDependente = () => {
        setFormData(prevState => ({
            ...prevState,
            dependentes: [...prevState.dependentes, { nome: '', cpf: '', dataNascimento: '', parentesco: ''}]
        }));
    };

    const removeDependente = index => {
        setFormData(prevState => ({
            ...prevState,
            dependentes: prevState.dependentes.filter((_, idx) => idx !== index)
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/addFuncionario.php`, formData)
            .then(response => {
                console.log('Sucesso:', response);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    };

    return (
        <Container component="main" maxWidth="lg">
            <Typography component="h1" variant="h5">Formulário de Admissão de Funcionário</Typography>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
                <TextField
                    fullWidth
                    label='Nome'
                    name='nome'
                    value={formData.nome}
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
                    value={formData.cpf}
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
                    value={formData.rg}
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
                        value={formData.ufRg}
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
                    value={formData.orgaoRg}
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
                    value={formData.dataExpedicao}
                    onChange={handleChange}
                    variant="outlined"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='CTPS'
                    name='ctps'
                    value={formData.ctps}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Série da CTPS'
                    name='serieCtps'
                    value={formData.serieCtps}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
                    <InputLabel id="ufCtps">UF da CTPS</InputLabel>
                    <Select
                        labelId="ufCtps"
                        name='ufCtps'
                        value={formData.ufCtps}
                        label="UF da CTPS"
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
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='PIS'
                    name='pis'
                    value={formData.pis}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Raça/Cor'
                    name='racaCor'
                    value={formData.racaCor}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Título de Eleitor'
                    name='titulo'
                    value={formData.titulo}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Seção'
                    name='secao'
                    value={formData.secao}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>            
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Zona Eleitoral'
                    name='zona'
                    value={formData.zona}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
           
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Data de Nascimento'
                    name='dataNascimento'
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    variant="outlined"
                    type='date'
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='País de Nascimento'
                    name='paisNascimento'
                    value={formData.paisNascimento}
                    onChange={handleChange}
                    variant="outlined"
                />                
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Cidade de Nascimento'
                    name='cidadeNascimento'
                    value={formData.cidadeNascimento}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="ufNasc">UF de Nascimento</InputLabel>
                    <Select
                        labelId="ufNasc"
                        name='ufNasc'
                        value={formData.ufNasc}
                        label="UF de Nascimento"
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
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    <InputLabel id="sexo">Sexo</InputLabel>
                    <Select
                        labelId="sexo"
                        name='sexo'
                        value={formData.sexo}
                        label="Sexo"
                        onChange={handleChange}                        
                    >
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Feminino">Feminino</MenuItem>
                        <MenuItem value="Outro">Outro</MenuItem>
                    </Select>
                </FormControl> 
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="estadoCivil">Estado Civil</InputLabel>
                    <Select
                        labelId="estadoCivil"
                        name='estadoCivil'
                        value={formData.estadoCivil}
                        label="Estado Civil"
                        onChange={handleChange}                        
                    >
                        <MenuItem value="Solteiro">Solteiro(a)</MenuItem>
                        <MenuItem value="Casado">Casado(a)</MenuItem>
                        <MenuItem value="Divorciado">Divorciado(a)</MenuItem>
                        <MenuItem value="Viúvo">Viúvo(a)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Telefone'
                    name='telefone'
                    value={formData.telefone}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Celular'
                    name='celular'
                    value={formData.celular}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Email'
                    name='email'
                    value={formData.email}
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
                    value={formData.cep}
                    onChange={handleCepChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={9}>
                <TextField
                    fullWidth
                    label='Endereço'
                    name='endereco'
                    value={formData.endereco}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    label='Número'
                    name='numero'
                    value={formData.numero}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    fullWidth
                    label='Complemento'
                    name='complemento'
                    value={formData.complemento}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Bairro'
                    name='bairro'
                    value={formData.bairro}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Cidade'
                    name='cidade'
                    value={formData.cidade}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                 <FormControl fullWidth>
                    <InputLabel id="ufEnd">UF</InputLabel>
                    <Select
                        labelId="ufEnd"
                        name='ufEnd'
                        value={formData.ufEnd}
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
                    value={formData.admissao}
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
                    value={formData.salario}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Jornada de Trabalho'
                    name='jornada'
                    value={formData.jornada}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Código do Cargo'
                    name='codCargo'
                    value={formData.codCargo}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    fullWidth
                    label='Descrição do Cargo'
                    name='descricaoCargo'
                    value={formData.descricaoCargo}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
          
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Código do Departamento'
                    name='codDpto'
                    value={formData.codDpto}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    fullWidth
                    label='Descrição do Departamento'
                    name='descricaoDpto'
                    value={formData.descricaoDpto}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Código do Serviço'
                    name='codServico'
                    value={formData.codServico}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    fullWidth
                    label='Descrição do Serviço'
                    name='descricaoServico'
                    value={formData.descricaoServico}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Código do Centro de Custo'
                    name='codCcusto'
                    value={formData.codCcusto}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    fullWidth
                    label='Descrição do Centro de Custo'
                    name='descricaoCcusto'
                    value={formData.descricaoCcusto}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='CBO'
                    name='cbo'
                    value={formData.cbo}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    fullWidth
                    label='Grau de Instrução'
                    name='grauInstrucao'
                    value={formData.grauInstrucao}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Nome do Banco'
                    name='nomeBanco'
                    value={formData.nomeBanco}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Conta'
                    name='conta'
                    value={formData.conta}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label='Agência'
                    name='agencia'
                    value={formData.agencia}
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
                        value={formData.tipoConta}
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
                    label='Sindicato'
                    name='sindicato'
                    value={formData.sindicato}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Código do Sindicato'
                    name='codSind'
                    value={formData.codSind}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Código do eSocial'
                    name='codEsocial'
                    value={formData.codEsocial}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="reabilitado">Reabilitado</InputLabel>
                    <Select
                        labelId="reabilitado"
                        name='reabilitado'
                        value={formData.reabilitado}
                        label="Reabilitado"
                        onChange={handleChange}
                    >
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="possuiDeficiencia">Possui Deficiência</InputLabel>
                    <Select
                        labelId="possuiDeficiencia"
                        name='possuiDeficiencia'
                        value={formData.possuiDeficiencia}
                        label="Possui Deficiência"
                        onChange={handleChange}
                    >
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Deficiência Auditiva'
                    name='deficienciaAuditiva'
                    value={formData.deficienciaAuditiva}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Deficiência Física'
                    name='deficienciaFisica'
                    value={formData.deficienciaFisica}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Deficiência Intelectual'
                    name='deficienciaIntelectual'
                    value={formData.deficienciaIntelectual}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Deficiência Mental'
                    name='deficienciaMental'
                    value={formData.deficienciaMental}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Deficiência Visual'
                    name='deficienciaVisual'
                    value={formData.deficienciaVisual}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Outra Deficiência'
                    name='outraDeficiencia'
                    value={formData.outraDeficiencia}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
                        
                
            {formData.dependentes.map((dependente, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nome do Dependente"
                                    name="nome"
                                    value={dependente.nome}
                                    onChange={(e) => handleDependenteChange(index, e)}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="CPF do Dependente"
                                    name="cpf"
                                    value={dependente.cpf}
                                    onChange={(e) => handleDependenteChange(index, e)}
                                    variant="outlined"
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label='Data de Nascimento'
                                    name='dataNascimento'
                                    value={dependente.dataNascimento}
                                    onChange={(e) => handleDependenteChange(index, e)}
                                    variant="outlined"
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={11} sm={5}>
                                <TextField
                                    fullWidth
                                    label="Parentesco"
                                    name="parentesco"
                                    value={dependente.parentesco}
                                    onChange={(e) => handleDependenteChange(index, e)}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={1} sm={1}>
                                <IconButton onClick={() => removeDependente(index)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    ))}
                    <Grid item xs={12} sm={12} container justifyContent="flex-end">
                        <Button
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={addDependente}
                            variant="contained"
                        >
                            Adicionar Dependente
                        </Button>
                    </Grid>
           
        </Grid>
        <Grid item xs={12} sm={12} container justifyContent="center">
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                Salvar
            </Button>
        </Grid>
                
            </form>
        </Container>
    );
};

export default AddColaborador;
