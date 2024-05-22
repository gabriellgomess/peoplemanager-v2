import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../contexts/MyContext';
import axios from 'axios';
import { Tooltip, IconButton, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PrintIcon from '@mui/icons-material/Print';
import EditModal from '../components/EditModal';
import ShutdownModal from '../components/ShutdownModal';
import DocumentsModal from '../components/DocumentsModal';

const Colaboradores = () => {
    const [colaboradores, setColaboradores] = useState([]);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openModalShutdown, setOpenModalShutdown] = useState(false);
    const [openModalDocuments, setOpenModalDocuments] = useState(false);
    const [currentColaborador, setCurrentColaborador] = useState({});

    const {rootState} = useContext(MyContext);
    const {theUser} = rootState;
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/getFuncionarios.php`)
        .then((response) => {
            setColaboradores(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Hubo un error!', error);
        });
    }, [update]);
    console.log("user: ", theUser.name);

    const handleEditClick = (colaborador) => {
        setCurrentColaborador(colaborador);
        setOpenModal(true);
    };

    const handleDocumentsClick = (colaborador) => {
        setCurrentColaborador(colaborador);
        setOpenModalDocuments(true);
    };

    const handleShutdownClick = (colaborador) => {
        setCurrentColaborador(colaborador);
        setOpenModalShutdown(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setUpdate(!update);
    };

    const handleCloseModalShutdown = () => {
        setOpenModalShutdown(false);
        setUpdate(!update);
    };

    const handleCloseModalDocuments = () => {
        setOpenModalDocuments(false);
    }; 
    

    const columns = [
        {
            field: 'id',
            headerName: 'Matrícula',
            width: 80,
            editable: false,
            renderCell: (params) => {
                return params.value.toString().padStart(6, '0');
            }
        },
        {
            field: 'nome',
            headerName: 'Nome',
            width: 250,
            editable: false
        },
        {
            field: 'cpf',
            headerName: 'CPF',
            width: 110,
            editable: false
        },        
        {
            field: 'dataNascimento',
            headerName: 'Nascimento',
            width: 110,
            editable: false,
            renderCell: (params) => {
                return params.value.split('-').reverse().join('/');
            }
        },
        {
            field: 'celular',
            headerName: 'Celular',
            width: 110,
            editable: false
        },
        {
            field: 'email',
            headerName: 'E-mail',
            width: 250,
            editable: false
        },
        {
            field: 'dataDemissao',
            headerName: 'Status',
            width: 100,
            editable: false,
            renderCell: (params) => {
                if (params.value) {
                    return (
                        <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                            <Tooltip title={`Desligamento em ${params.value.split('-').reverse().join('/')}`} arrow>
                                <IconButton>
                                    <HighlightOffIcon color="error" /> 
                                </IconButton>                                
                            </Tooltip>    
                        </Box>
                    );
                } else {
                    return (
                        <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                            <Tooltip title="Ativo" arrow>
                                <IconButton>
                                    <CheckCircleOutlineIcon color="success" /> 
                                </IconButton>                            
                            </Tooltip> 
                        </Box>
                    );
                }
            }
        },
        {
            field: 'documentos',
            headerName: 'Documentos',
            width: 110,
            renderCell: (params) => {
                return (
                    <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                        <Tooltip title={`Documentos de ${params.row.nome.split(' ')[0]}`} arrow>
                            <IconButton aria-label="view" color="primary" onClick={() => handleDocumentsClick(params.row)}>
                                <FolderOpenIcon />
                            </IconButton>   
                        </Tooltip>
                    </Box>
                )
            }
        },
        {
            field: 'edit',
            headerName: 'Edição',
            width: 80,
            renderCell: (params) => {
                return (
                    params.row.dataDemissao ? null : (
                        <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                            <IconButton aria-label="edit" color="primary" onClick={() => handleEditClick(params.row)}>
                                <EditIcon />
                            </IconButton>  
                        </Box>
                    )
                )
            }
        },
        {
            field: 'print',
            headerName: 'Impressão',
            width: 90,
            renderCell: (params) => {
                return (   
                    <a href={`${import.meta.env.VITE_REACT_APP_URL}/api/generate_pdf.php?id=${params.row.id}`} target='_blank'>               
                        <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                            <IconButton aria-label="edit" color="text.primary">
                                <PrintIcon />
                            </IconButton>  
                        </Box>
                    </a>  
                )
            }
        },
        {
            field: 'shutdown',
            headerName: 'Demissão',
            width: 100,
            renderCell: (params) => {
                return (
                    params.row.dataDemissao ? null : (
                        <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                            <Tooltip title="Desligar colaborador" arrow>
                                <IconButton aria-label="delete" color="error" onClick={() => handleShutdownClick(params.row)}>
                                    <PersonRemoveIcon />
                                </IconButton> 
                            </Tooltip>  
                        </Box>                              
                    )                       
                )
            }
        }
    ];

    return (
        <Box sx={{width: '100%', maxWidth: '1400px'}}>
            <h1>Colaboradores</h1>
            <DataGrid
                rows={colaboradores}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick={true}
            />
            <EditModal
                open={openModal}
                handleClose={handleCloseModal}
                colaborador={currentColaborador}
            />
            <ShutdownModal
                open={openModalShutdown}
                handleClose={handleCloseModalShutdown}
                colaborador={currentColaborador}
            />
            <DocumentsModal
                open={openModalDocuments}
                handleClose={handleCloseModalDocuments}
                colaborador={currentColaborador}
            />
        </Box>
    );
};

export default Colaboradores;
