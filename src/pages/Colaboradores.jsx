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
import SmsIcon from '@mui/icons-material/Sms';
import Avatar from '@mui/material/Avatar';
import EditModal from '../components/EditModal';
import ShutdownModal from '../components/ShutdownModal';
import DocumentsModal from '../components/DocumentsModal';
import SmsModal from '../components/SmsModal';
import { formatToPhone } from 'brazilian-values';

const Colaboradores = () => {
    const [colaboradores, setColaboradores] = useState([]);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openModalShutdown, setOpenModalShutdown] = useState(false);
    const [openModalDocuments, setOpenModalDocuments] = useState(false);
    const [openModalSms, setOpenModalSms] = useState(false);
    const [currentColaborador, setCurrentColaborador] = useState({});

    const { rootState } = useContext(MyContext);
    const { theUser } = rootState;

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

    const handleSmsClick = (colaborador) => {
        setCurrentColaborador(colaborador);
        setOpenModalSms(true);
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

    const handleCloseModalSms = () => {
        setOpenModalSms(false);
    };

    // Função para verificar se um número é um celular válido
        const isCellPhone = (phone) => {
        const cellPhonePattern = /^(\(?\d{2}\)?\s?)?9[6-9]\d{3}-?\d{4}$/;
        return cellPhonePattern.test(phone);
    };
    
    // Função para verificar se o celular é válido ou se o telefone é um celular válido
    const getValidCellPhone = (celular, telefone) => {
        if (celular && isCellPhone(celular)) {
        // Limpar caracteres especiais
        return celular.replace(/[^\d]/g, '');
        } else if (telefone && isCellPhone(telefone)) {
        return telefone.replace(/[^\d]/g, '');
        }
        return null;
    };

    const columns = [
        {
            field: 'foto',
            headerName: 'Foto',
            width: 60,
            renderCell: (params) => {
                if(params.row.foto3x4 !== null){
                    return (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                            <Avatar sx={{width: 40, height: 40}} src={`${import.meta.env.VITE_REACT_APP_URL}${params.row.foto3x4}`} />
                        </div>                    
                        
                    )
                }else{
                    return (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                            <Avatar sx={{width: 40, height: 40}}>{params.row.nome?.split(' ')[0].charAt(0) + params.row.nome?.split(' ')[params.row.nome?.split(' ').length - 1].charAt(0)}</Avatar>
                        </div>                        

                    )

                }
            }
        },
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
            field: 'dataDemissao',
            headerName: 'Status',
            width: 80,
            editable: false,
            renderCell: (params) => {
                if (params.value) {
                    return (
                        <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                            <Tooltip title={`Desligamento em ${params.value?.split('-').reverse().join('/')}`} arrow>
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
            field: 'nome',
            headerName: 'Nome',
            width: 290,
            editable: false
        },
        {
            field: 'descricaoCcusto',
            headerName: 'Centro de Custo',
            width: 200,
            editable: false
        },
        {
            field: 'descricaoCargo',
            headerName: 'Cargo',
            width: 200,
            editable: false
        },
        {
            field: 'celular',
            headerName: 'Telefone',
            width: 160,
            editable: false,
            renderCell: (params) => {
              const validCellPhone = getValidCellPhone(params.row.celular, params.row.telefone);
        
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {validCellPhone ? formatToPhone(validCellPhone) : 'N/A'}
                  {validCellPhone && (
                    <Tooltip title="Enviar SMS" arrow>
                      <IconButton color="primary" onClick={() => handleSmsClick(params.row)}>
                        <SmsIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              );
            },
          },
       
        {
            field: 'documentos',
            headerName: 'Pasta',
            width: 80,
            renderCell: (params) => {
                return (
                    <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%'}}>
                        <Tooltip title={`Documentos de ${params.row.nome?.split(' ')[0]}`} arrow>
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
            width: 80,
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
        <Box sx={{ width: '100%', maxWidth: '1400px' }}>
            <h1>Colaboradores</h1>
            <DataGrid
                rows={colaboradores}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 50 } },
                }}
                pageSizeOptions={[25, 50, 100]}
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
            <SmsModal
                open={openModalSms}
                handleClose={handleCloseModalSms}
                colaborador={currentColaborador}
            />
        </Box>
    );
};

export default Colaboradores;
