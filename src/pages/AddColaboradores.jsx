import React, { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { Button, Typography } from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import Link from '@mui/material/Link';
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
    { label: "Código eSocial", key: "codEsocial", alternateMatches: ["CÓD ESOCIAL"], fieldType: { type: "input" } },
    { label: "Admissão", key: "admissao", alternateMatches: ["ADMISSÃO"], fieldType: { type: "input" } },
    { label: "Fim Determinado", key: "fimDeterminado", alternateMatches: ["FIM DETERMINADO"], fieldType: { type: "input" } },
    { label: "Fim Prorrogação", key: "fimProrrogacao", alternateMatches: ["FIM PRORROGAÇÃO"], fieldType: { type: "input" } },
    { label: "Salário", key: "salario", alternateMatches: ["SALÁRIO"], fieldType: { type: "input" } },
    { label: "Categoria", key: "categoria", alternateMatches: ["CATEGORIA"], fieldType: { type: "input" } },
    { label: "Código do Cargo", key: "codCargo", alternateMatches: ["CÓD CARGO"], fieldType: { type: "input" } },
    { label: "Descrição do Cargo", key: "descricaoCargo", alternateMatches: ["DESCRIÇÃO CARGO"], fieldType: { type: "input" } },
    { label: "CBO", key: "cbo", alternateMatches: ["CBO"], fieldType: { type: "input" } },
    { label: "Código da Função", key: "codFuncao", alternateMatches: ["CÓD FUNÇÃO"], fieldType: { type: "input" } },
    { label: "Descrição da Função", key: "descricaoFuncao", alternateMatches: ["DESCRIÇÃO FUNÇÃO"], fieldType: { type: "input" } },
    { label: "Código do Centro de Custo", key: "codCcusto", alternateMatches: ["CÓD CCUSTO"], fieldType: { type: "input" } },
    { label: "Descrição do Centro de Custo", key: "descricaoCcusto", alternateMatches: ["DESCRIÇÃO CCUSTO"], fieldType: { type: "input" } },
    { label: "Código do Serviço", key: "codServico", alternateMatches: ["CÓD SERVIÇO"], fieldType: { type: "input" } },
    { label: "Descrição do Serviço", key: "descricaoServico", alternateMatches: ["DESCRIÇÃO SERVIÇO"], fieldType: { type: "input" } },
    { label: "Código do Departamento", key: "codDpto", alternateMatches: ["CÓD DPTO"], fieldType: { type: "input" } },
    { label: "Descrição do Departamento", key: "descricaoDpto", alternateMatches: ["DESCRIÇÃO DPTO"], fieldType: { type: "input" } },
    { label: "Código do Sindicato", key: "codSind", alternateMatches: ["CÓD SIND"], fieldType: { type: "input" } },
    { label: "Sindicato", key: "sindicato", alternateMatches: ["SINDICATO"], fieldType: { type: "input" } },
    { label: "CPF", key: "cpf", alternateMatches: ["CPF"], fieldType: { type: "input" }, validations: [{ rule: "required", errorMessage: "CPF é obrigatório." }] },
    { label: "PIS", key: "pis", alternateMatches: ["PIS"], fieldType: { type: "input" } },
    { label: "RG", key: "rg", alternateMatches: ["RG"], fieldType: { type: "input" } },
    { label: "UF RG", key: "ufRg", alternateMatches: ["UF RG"], fieldType: { type: "input" } },
    { label: "Órgão RG", key: "orgaoRg", alternateMatches: ["ORGÃO RG"], fieldType: { type: "input" } },
    { label: "Data de Expedição", key: "dataExpedicao", alternateMatches: ["DATA EX"], fieldType: { type: "input" } },
    { label: "Data de Nascimento", key: "dataNascimento", alternateMatches: ["DATA NASCIMENTO"], fieldType: { type: "input" } },
    { label: "Cidade de Nascimento", key: "cidadeNascimento", alternateMatches: ["CIDADE NASCIMENTO"], fieldType: { type: "input" } },
    { label: "UF de Nascimento", key: "ufNasc", alternateMatches: ["UF NASC"], fieldType: { type: "input" } },
    { label: "País de Nascimento", key: "paisNascimento", alternateMatches: ["PAÍS NASCIMENTO"], fieldType: { type: "input" } },
    { label: "Endereço", key: "endereco", alternateMatches: ["ENDEREÇO"], fieldType: { type: "input" } },
    { label: "Número", key: "numero", alternateMatches: ["NÚMERO"], fieldType: { type: "input" } },
    { label: "Complemento", key: "complemento", alternateMatches: ["COMPLEMENTO"], fieldType: { type: "input" } },
    { label: "Bairro", key: "bairro", alternateMatches: ["BAIRRO"], fieldType: { type: "input" } },
    { label: "CEP", key: "cep", alternateMatches: ["CEP"], fieldType: { type: "input" } },
    { label: "Cidade", key: "cidade", alternateMatches: ["CIDADE"], fieldType: { type: "input" } },
    { label: "UF", key: "ufEnd", alternateMatches: ["UF END"], fieldType: { type: "input" } },
    { label: "Telefone", key: "telefone", alternateMatches: ["TELEFONE"], fieldType: { type: "input" } },
    { label: "Celular", key: "celular", alternateMatches: ["CELULAR"], fieldType: { type: "input" } },
    { label: "Email", key: "email", alternateMatches: ["EMAIL"], fieldType: { type: "input" } },
    { label: "RIC", key: "ric", alternateMatches: ["RIC"], fieldType: { type: "input" } },
    { label: "Órgão RIC", key: "orgaoRic", alternateMatches: ["ORGÃO RIC"], fieldType: { type: "input" } },
    { label: "Local RIC", key: "localRic", alternateMatches: ["LOCAL RIC"], fieldType: { type: "input" } },
    { label: "Data de Expedição do RIC", key: "dataExpRic", alternateMatches: ["DATA EXP RIC"], fieldType: { type: "input" } },
    { label: "Validade do RIC", key: "validadeRic", alternateMatches: ["VALIDADE RIC"], fieldType: { type: "input" } },
    { label: "Passaporte", key: "passaporte", alternateMatches: ["PASSAPORTE"], fieldType: { type: "input" } },
    { label: "UF Passaporte", key: "ufPass", alternateMatches: ["UF PASS"], fieldType: { type: "input" } },
    { label: "Emissão Passaporte", key: "emissaoPass", alternateMatches: ["EMISSÃO PASS"], fieldType: { type: "input" } },
    { label: "Validade Passaporte", key: "validadePass", alternateMatches: ["VALIDADE PASS"], fieldType: { type: "input" } },
    { label: "RNE", key: "rne", alternateMatches: ["RNE"], fieldType: { type: "input" } },
    { label: "Órgão RNE", key: "orgaoRne", alternateMatches: ["ORGÃO RNE"], fieldType: { type: "input" } },
    { label: "Expedição RNE", key: "expedicaoRne", alternateMatches: ["EXPEDIÇÃO RNE"], fieldType: { type: "input" } },
    { label: "CNH", key: "cnh", alternateMatches: ["CNH"], fieldType: { type: "input" } },
    { label: "Categoria CNH", key: "categoriaCnh", alternateMatches: ["CATEGORIA CNH"], fieldType: { type: "input" } },
    { label: "Expedição CNH", key: "expedicaoCnh", alternateMatches: ["EXPEDIÇÃO CNH"], fieldType: { type: "input" } },
    { label: "Vencimento CNH", key: "vencimentoCnh", alternateMatches: ["VENCIMENTO CNH"], fieldType: { type: "input" } },
    { label: "Reservista", key: "reservista", alternateMatches: ["RESERVISTA"], fieldType: { type: "input" } },
    { label: "Título", key: "titulo", alternateMatches: ["TÍTULO"], fieldType: { type: "input" } },
    { label: "Zona", key: "zona", alternateMatches: ["ZONA"], fieldType: { type: "input" } },
    { label: "Seção", key: "secao", alternateMatches: ["SEÇÃO"], fieldType: { type: "input" } },
    { label: "CTPS", key: "ctps", alternateMatches: ["CTPS"], fieldType: { type: "input" } },
    { label: "Série CTPS", key: "serieCtps", alternateMatches: ["SÉRIE CTPS"], fieldType: { type: "input" } },
    { label: "UF CTPS", key: "ufCtps", alternateMatches: ["UF CTPS"], fieldType: { type: "input" } },
    { label: "Expedição CTPS", key: "expedicaoCtps", alternateMatches: ["EXPEDIÇÃO CTPS"], fieldType: { type: "input" } },
    { label: "Nome da Mãe", key: "nomeMae", alternateMatches: ["NOME MÃE"], fieldType: { type: "input" } },
    { label: "Nome do Pai", key: "nomePai", alternateMatches: ["NOME PAI"], fieldType: { type: "input" } },
    { label: "Sexo", key: "sexo", alternateMatches: ["SEXO"], fieldType: { type: "input" } },
    { label: "Estado Civil", key: "estadoCivil", alternateMatches: ["ESTADO CIVIL"], fieldType: { type: "input" } },
    { label: "Raça/Cor", key: "racaCor", alternateMatches: ["RAÇA/COR"], fieldType: { type: "input" } },
    { label: "Jornada", key: "jornada", alternateMatches: ["JORNADA"], fieldType: { type: "input" } },
    { label: "Nome do Banco", key: "nomeBanco", alternateMatches: ["NOME BANCO"], fieldType: { type: "input" } },
    { label: "Tipo de Conta", key: "tipoConta", alternateMatches: ["TIPO CONTA"], fieldType: { type: "input" } },
    { label: "Agência", key: "agencia", alternateMatches: ["AGÊNCIA"], fieldType: { type: "input" } },
    { label: "Conta", key: "conta", alternateMatches: ["CONTA"], fieldType: { type: "input" } },
    { label: "Nome Social", key: "nomeSocial", alternateMatches: ["NOME SOCIAL"], fieldType: { type: "input" } },
    { label: "Grau de Instrução", key: "grauInstrucao", alternateMatches: ["GRAU INSTRUÇÃO"], fieldType: { type: "input" } },
    { label: "Situação", key: "situacao", alternateMatches: ["SITUAÇÃO"], fieldType: { type: "input" } },
    { label: "Data de Demissão", key: "dataDemissao", alternateMatches: ["DATA DEMISSÃO"], fieldType: { type: "input" } },
    { label: "Motivo da Demissão", key: "motivoDemissao", alternateMatches: ["MOTIVO DEMISSÃO"], fieldType: { type: "input" } },
    { label: "Tipo de Empregado", key: "tipoEmpregado", alternateMatches: ["TIPO EMPREGADO"], fieldType: { type: "input" } },
    { label: "Possui Deficiência", key: "possuiDeficiencia", alternateMatches: ["POSSUI DEFICIÊNCIA"], fieldType: { type: "input" } },
    { label: "Deficiência Física", key: "deficienciaFisica", alternateMatches: ["DEFICIÊNCIA FÍSICA"], fieldType: { type: "input" } },
    { label: "Deficiência Visual", key: "deficienciaVisual", alternateMatches: ["DEFICIÊNCIA VISUAL"], fieldType: { type: "input" } },
    { label: "Deficiência Auditiva", key: "deficienciaAuditiva", alternateMatches: ["DEFICIÊNCIA AUDITIVA"], fieldType: { type: "input" } },
    { label: "Deficiência Intelectual", key: "deficienciaIntelectual", alternateMatches: ["DEFICIÊNCIA INTELECTUAL"], fieldType: { type: "input" } },
    { label: "Deficiência Mental", key: "deficienciaMental", alternateMatches: ["DEFICIÊNCIA MENTAL"], fieldType: { type: "input" } },
    { label: "Outra Deficiência", key: "outraDeficiencia", alternateMatches: ["OUTRA DEFICIÊNCIA"], fieldType: { type: "input" } },
    { label: "Reabilitado(a)", key: "reabilitado", alternateMatches: ["REABILITADO(A)"], fieldType: { type: "input" } },
    { label: "Observação da Deficiência", key: "observacaoDeficiencia", alternateMatches: ["OBSERVAÇÃO DEFICIÊNCIA"], fieldType: { type: "input" } },
    { label: "Cota Deficiente", key: "cotaDeficiente", alternateMatches: ["COTA DEFICIENTE"], fieldType: { type: "input" } },
    { label: "Nome do Conselho", key: "nomeConselho", alternateMatches: ["NOME CONSELHO"], fieldType: { type: "input" } },
    { label: "Número do Conselho", key: "numeroConselho", alternateMatches: ["NÚMERO CONSELHO"], fieldType: { type: "input" } },
    { label: "Expedição do Conselho", key: "expedicaoConselho", alternateMatches: ["EXPEDIÇÃO CONSELHO"], fieldType: { type: "input" } },
    { label: "Validade do Conselho", key: "validadeConselho", alternateMatches: ["VALIDADE CONSELHO"], fieldType: { type: "input" } },
    { label: "Nome Dependente 1", key: "nomeDependente1", alternateMatches: ["NOME DEPENDENTE 1"], fieldType: { type: "input" } },
    { label: "Nascimento Dependente 1", key: "nascimentoDependente1", alternateMatches: ["NASCIMENTO DEPENDENTE 1"], fieldType: { type: "input" } },
    { label: "CPF Dependente 1", key: "cpfDependente1", alternateMatches: ["CPF DEPENDENTE 1"], fieldType: { type: "input" } },
    { label: "Parentesco Dependente 1", key: "parentescoDependente1", alternateMatches: ["PARENTESCO DEPENDENTE 1"], fieldType: { type: "input" } },
    { label: "Nome Dependente 2", key: "nomeDependente2", alternateMatches: ["NOME DEPENDENTE 2"], fieldType: { type: "input" } },
    { label: "Nascimento Dependente 2", key: "nascimentoDependente2", alternateMatches: ["NASCIMENTO DEPENDENTE 2"], fieldType: { type: "input" } },
    { label: "CPF Dependente 2", key: "cpfDependente2", alternateMatches: ["CPF DEPENDENTE 2"], fieldType: { type: "input" } },
    { label: "Parentesco Dependente 2", key: "parentescoDependente2", alternateMatches: ["PARENTESCO DEPENDENTE 2"], fieldType: { type: "input" } },
    { label: "Nome Dependente 3", key: "nomeDependente3", alternateMatches: ["NOME DEPENDENTE 3"], fieldType: { type: "input" } },
    { label: "Nascimento Dependente 3", key: "nascimentoDependente3", alternateMatches: ["NASCIMENTO DEPENDENTE 3"], fieldType: { type: "input" } },
    { label: "CPF Dependente 3", key: "cpfDependente3", alternateMatches: ["CPF DEPENDENTE 3"], fieldType: { type: "input" } },
    { label: "Parentesco Dependente 3", key: "parentescoDependente3", alternateMatches: ["PARENTESCO DEPENDENTE 3"], fieldType: { type: "input" } },
    { label: "Nome Dependente 4", key: "nomeDependente4", alternateMatches: ["NOME DEPENDENTE 4"], fieldType: { type: "input" } },
    { label: "Nascimento Dependente 4", key: "nascimentoDependente4", alternateMatches: ["NASCIMENTO DEPENDENTE 4"], fieldType: { type: "input" } },
    { label: "CPF Dependente 4", key: "cpfDependente4", alternateMatches: ["CPF DEPENDENTE 4"], fieldType: { type: "input" } },
    { label: "Parentesco Dependente 4", key: "parentescoDependente4", alternateMatches: ["PARENTESCO DEPENDENTE 4"], fieldType: { type: "input" } },
    { label: "Nome Dependente 5", key: "nomeDependente5", alternateMatches: ["NOME DEPENDENTE 5"], fieldType: { type: "input" } },
    { label: "Nascimento Dependente 5", key: "nascimentoDependente5", alternateMatches: ["NASCIMENTO DEPENDENTE 5"], fieldType: { type: "input" } },
    { label: "CPF Dependente 5", key: "cpfDependente5", alternateMatches: ["CPF DEPENDENTE 5"], fieldType: { type: "input" } },
    { label: "Parentesco Dependente 5", key: "parentescoDependente5", alternateMatches: ["PARENTESCO DEPENDENTE 5"], fieldType: { type: "input" } },
    { label: "Nome Dependente 6", key: "nomeDependente6", alternateMatches: ["NOME DEPENDENTE 6"], fieldType: { type: "input" } },
    { label: "Nascimento Dependente 6", key: "nascimentoDependente6", alternateMatches: ["NASCIMENTO DEPENDENTE 6"], fieldType: { type: "input" } },
    { label: "CPF Dependente 6", key: "cpfDependente6", alternateMatches: ["CPF DEPENDENTE 6"], fieldType: { type: "input" } },
    { label: "Parentesco Dependente 6", key: "parentescoDependente6", alternateMatches: ["PARENTESCO DEPENDENTE 6"], fieldType: { type: "input" } },
    { label: "Nome Dependente 7", key: "nomeDependente7", alternateMatches: ["NOME DEPENDENTE 7"], fieldType: { type: "input" } },
    { label: "Nascimento Dependente 7", key: "nascimentoDependente7", alternateMatches: ["NASCIMENTO DEPENDENTE 7"], fieldType: { type: "input" } },
    { label: "CPF Dependente 7", key: "cpfDependente7", alternateMatches: ["CPF DEPENDENTE 7"], fieldType: { type: "input" } },
    { label: "Parentesco Dependente 7", key: "parentescoDependente7", alternateMatches: ["PARENTESCO DEPENDENTE 7"], fieldType: { type: "input" } },
    

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
                        Clicando no botão abaixo, você poderá fazer a importação da planilha de funcionários.
                    </Typography>
                    <Typography sx={{fontSize: '18px'}} variant="body1">
                        A planilha deverá conter as colunas de <span style={{fontWeight: 'bold'}}>id (matrícula), nome, codEsocial, admissao, salario, codigoCargo, decriaoCargo, CBO, codigoCentroCusto, descricaoCentroCusto, CPF, PIS, RG, ufRg, orgaoRg, dataExpedicao, dataNascimento, telefone, celular, nomeBanco, tipoConta, conta, agencia, grauInstrucao, dataDemissao, motivoDemissao,</span>  no link a seguir é possível fazer o download da {" "}
                        <Link 
                        href={`${import.meta.env.VITE_REACT_APP_URL}/api/modelos/PLANILHA_MODELO_CADASTRO_FUNCIONARIOS.xlsx`} 
                        target="_blank" rel="noopener noreferrer"
                        sx={{color: 'text.info', fontWeight: 'bold'}}
                        >
                            PLANILHA MODELO
                        </Link>.
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