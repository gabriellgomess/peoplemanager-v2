import React, { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { Button, Typography } from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import axios from 'axios';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const translations = {
    uploadStep: {
        title: "Carregar arquivo",
        manifestTitle: "Dados que esperamos:",
        manifestDescription: "(Você terá a chance de renomear ou remover colunas nos próximos passos)",
        maxRecordsExceeded: (maxRecords) => `Muitos registros. Até ${maxRecords} permitidos`,
        dropzone: {
            title: "Carregar arquivo .xlsx, .xls ou .csv",
            errorToastDescription: "Carregamento rejeitado",
            activeDropzoneTitle: "Solte o arquivo aqui...",
            buttonTitle: "Selecionar arquivo",
            loadingTitle: "Processando...",
        },
        selectSheet: {
            title: "Selecione a planilha a ser usada",
            nextButtonTitle: "Próximo",
            backButtonTitle: "Voltar",
        },
    },
    selectHeaderStep: {
        title: "Selecionar linha de cabeçalho",
        nextButtonTitle: "Próximo",
        backButtonTitle: "Voltar",
    },
    matchColumnsStep: {
        title: "Corresponder Colunas",
        nextButtonTitle: "Próximo",
        backButtonTitle: "Voltar",
        userTableTitle: "Sua tabela",
        templateTitle: "Se tornará",
        selectPlaceholder: "Selecionar coluna...",
        ignoredColumnText: "Coluna ignorada",
        subSelectPlaceholder: "Selecionar...",
        matchDropdownTitle: "Corresponder",
        unmatched: "Não correspondido",
        duplicateColumnWarningTitle: "Outra coluna não selecionada",
        duplicateColumnWarningDescription: "As colunas não podem se duplicar",
    },
    validationStep: {
        title: "Validar dados",
        nextButtonTitle: "Confirmar",
        backButtonTitle: "Voltar",
        noRowsMessage: "Nenhum dado encontrado",
        noRowsMessageWhenFiltered: "Nenhum dado contendo erros",
        discardButtonTitle: "Descartar linhas selecionadas",
        filterSwitchTitle: "Mostrar apenas linhas com erros",
    },
    alerts: {
        confirmClose: {
            headerTitle: "Sair do fluxo de importação",
            bodyText: "Tem certeza? Suas informações atuais não serão salvas.",
            cancelButtonTitle: "Cancelar",
            exitButtonTitle: "Sair do fluxo",
        },
        submitIncomplete: {
            headerTitle: "Erros detectados",
            bodyText: "Ainda há algumas linhas que contêm erros. As linhas com erros serão ignoradas ao enviar.",
            bodyTextSubmitForbidden: "Ainda há algumas linhas contendo erros.",
            cancelButtonTitle: "Cancelar",
            finishButtonTitle: "Enviar",
        },
        submitError: {
            title: "Erro",
            defaultMessage: "Ocorreu um erro ao enviar os dados",
        },
        unmatchedRequiredFields: {
            headerTitle: "Não todas as colunas correspondidas",
            bodyText: "Existem colunas obrigatórias que não estão correspondidas ou foram ignoradas. Deseja continuar?",
            listTitle: "Colunas não correspondidas:",
            cancelButtonTitle: "Cancelar",
            continueButtonTitle: "Continuar",
        },
        toast: {
            error: "Erro",
        },
    },
};



// Campos configurados para corresponder à planilha.
const fields = [
    { label: "ID", key: "id", alternateMatches: ["ID"], fieldType: { type: "input" } },
    { label: "Nome", key: "nome", alternateMatches: ["NOME"], fieldType: { type: "input" }, validations: [{ rule: "required", errorMessage: "Nome é obrigatório." }] },
    { label: "CPF", key: "cpf", alternateMatches: ["CPF"], fieldType: { type: "input" }, validations: [{ rule: "required", errorMessage: "CPF é obrigatório." }] },
    { label: "RG", key: "rg", alternateMatches: ["RG"], fieldType: { type: "input" } },
    { label: "UF RG", key: "ufRg", alternateMatches: ["UFRG"], fieldType: { type: "input" } },
    { label: "Órgão RG", key: "orgaoRg", alternateMatches: ["ORGAORG"], fieldType: { type: "input" } },
    { label: "Data de Expedição", key: "dataExpedicao", alternateMatches: ["DATAEXPEDICAO"], fieldType: { type: "input" } },
    { label: "PIS", key: "pis", alternateMatches: ["PIS"], fieldType: { type: "input" } },
    { label: "Data de Nascimento", key: "dataNascimento", alternateMatches: ["DATANASCIMENTO"], fieldType: { type: "input" } },
    { label: "Telefone", key: "telefone", alternateMatches: ["TELEFONE"], fieldType: { type: "input" } },
    { label: "Celular", key: "celular", alternateMatches: ["CELULAR"], fieldType: { type: "input" } },
    { label: "Email", key: "email", alternateMatches: ["EMAIL"], fieldType: { type: "input" } },
    { label: "CEP", key: "cep", alternateMatches: ["CEP"], fieldType: { type: "input" } },
    { label: "Endereço", key: "endereco", alternateMatches: ["ENDERECO"], fieldType: { type: "input" } },
    { label: "Número", key: "numero", alternateMatches: ["NUMERO"], fieldType: { type: "input" } },
    { label: "Complemento", key: "complemento", alternateMatches: ["COMPLEMENTO"], fieldType: { type: "input" } },
    { label: "Bairro", key: "bairro", alternateMatches: ["BAIRRO"], fieldType: { type: "input" } },
    { label: "Cidade", key: "cidade", alternateMatches: ["CIDADE"], fieldType: { type: "input" } },
    { label: "UF", key: "uf", alternateMatches: ["UF"], fieldType: { type: "input" } },
    { label: "Data de Admissão", key: "admissao", alternateMatches: ["ADMISSAO"], fieldType: { type: "input" } },
    { label: "Salário", key: "salario", alternateMatches: ["SALARIO"], fieldType: { type: "input" } },
    { label: "Código do Cargo", key: "codigoCargo", alternateMatches: ["CODIGOCARGO"], fieldType: { type: "input" } },
    { label: "Descrição do Cargo", key: "descricaoCargo", alternateMatches: ["DESCRICAOCARGO"], fieldType: { type: "input" } },
    { label: "CBO", key: "cbo", alternateMatches: ["CBO"], fieldType: { type: "input" } },
    { label: "Código eSocial", key: "codEsocial", alternateMatches: ["codEsocial"], fieldType: { type: "input" } },
    { label: "Código do Centro de Custo", key: "codigoCentroCusto", alternateMatches: ["CODIGOCENTROCUSTO"], fieldType: { type: "input" } },
    { label: "Descrição do Centro de Custo", key: "descricaoCentroCusto", alternateMatches: ["DESCRICAOCENTROCUSTO"], fieldType: { type: "input" } },
    { label: "Nome do Banco", key: "nomeBanco", alternateMatches: ["NOMEBANCO"], fieldType: { type: "input" } },
    { label: "Tipo de Conta", key: "tipoConta", alternateMatches: ["TIPOCONTA"], fieldType: { type: "input" } },
    { label: "Conta", key: "conta", alternateMatches: ["CONTA"], fieldType: { type: "input" }},
    { label: "Agência", key: "agencia", alternateMatches: ["AGENCIA"], fieldType: { type: "input" }},
    { label: "Grau de Instrução", key: "grauInstrucao", alternateMatches: ["GRAUINSTRUCAO"], fieldType: { type: "input" } },
    { label: "Data de Demissão", key: "dataDemissao", alternateMatches: ["DATADEMISSAO"], fieldType: { type: "input" } },
    { label: "Motivo da Demissão", key: "motivoDemissao", alternateMatches: ["MOTIVODEMISSAO"], fieldType: { type: "input" } }
];


const AddColaboradores = ({ user, theme }) => {
    // Estado para controlar a visibilidade do modal de importação.
    const [isOpen, setIsOpen] = useState(false);

    // Estado para controlar o backdrop
    const [loading, setLoading] = useState(false);


    // Função para abrir o modal.
    const handleOpen = () => setIsOpen(true);

    // Função para fechar o modal.
    const onClose = () => setIsOpen(false);

    const handleBackdrop = () => {
        setLoading(true);
    }



    // Função para lidar com o envio dos dados importados.
    const onSubmit = (data) => {

        setLoading(true);

        const importacao = {
            ...data,
            dadosImportacao: user
        }



        // Aqui você pode processar os dados importados conforme necessário.
        axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/addFuncionarios.php`, importacao)
            .then((response) => {
                if (response.data.success) {
                    setLoading(false);
                    Swal.fire({
                        title: response.data.message,
                        text: `Foram inseridos ${response.data.linhasAfetadas} registros na importação nº ${response.data.importacaoId}, totalizando ${new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(response.data.valorTotal)}`,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    })
                } else {
                    setLoading(false);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Ocorreu um erro na importação',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                }

            }, (error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Card elevation={5} sx={{marginBottom: '20px'}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Bem-vindo, 
                    </Typography>
                    <Typography sx={{fontSize: '18px'}} variant="body1">
                        Clicando no botão abaixo, você poderá fazer a importação da planilha de dados para débito em conta, cada planilha corresponderá à um banco.
                    </Typography>
                    <Typography sx={{fontSize: '18px'}} variant="body1">
                        A planilha deverá conter as colunas de <span style={{fontWeight: 'bold'}}>Nome, CPF, Valor, Banco, Agência, Conta, Dígito e Vencimento,</span>  pois estes serão os dados usados na geração do arquivo remessa.
                    </Typography>
                </CardContent>
            </Card>
            <Button variant="contained" onClick={handleOpen} endIcon={<CloudUploadIcon />} size='large'>Importar Dados</Button>
            <ReactSpreadsheetImport
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                fields={fields}
                translations={translations}
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: '999', display: 'flex', flexDirection: 'column'}}
                open={loading}
            >
                <CircularProgress color="inherit" />
                <Typography variant="h6" component="div" sx={{ marginTop: '20px' }}>Processando...</Typography>
            </Backdrop>
        </>
    );
};

export default AddColaboradores;