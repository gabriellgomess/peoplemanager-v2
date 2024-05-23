import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Chip, Box, MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import axios from 'axios';

const DocumentsModal = ({ open, handleClose, colaborador }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [docType, setDocType] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [preview, setPreview] = useState({ src: '', x: 0, y: 0 });

    useEffect(() => {
        if (colaborador.id) {
            fetchDocuments();
        }
    }, [colaborador.id]);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/getDocuments.php?colaboradorId=${colaborador.id}`);
            if (Array.isArray(response.data)) {
                setDocuments(response.data);
            } else {
                setDocuments([]);
            }
        } catch (error) {
            console.error('Erro ao buscar documentos:', error);
            setDocuments([]);
        }
    };

    const onDrop = (acceptedFiles) => {
        setFiles(acceptedFiles);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files[]', file);
            formData.append('docType', docType);
        });
        formData.append('colaboradorId', colaborador.id);

        setUploading(true);

        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_URL}/api/uploadDocuments.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchDocuments(); // Refresh the document list
            setFiles([]);
            setDocType('');
        } catch (error) {
            console.error('Erro ao fazer upload dos documentos:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!deleting) {
            setDeleting(true);
            try {
                await axios.delete(`${import.meta.env.VITE_REACT_APP_URL}/api/deleteDocument.php?documentId=${documentId}`);
                fetchDocuments(); // Refresh the document list
            } catch (error) {
                console.error('Erro ao deletar documento:', error);
            } finally {
                setDeleting(false);
            }
        }
    };

    const getDocumentProps = (tipo) => {
        switch (tipo) {
            case 'CPF':
                return { icon: <DescriptionIcon />, color: 'primary' };
            case 'Certificado de Conclusao de Curso':
                return { icon: <PictureAsPdfIcon />, color: 'secondary' };
            case 'Diploma':
                return { icon: <InsertDriveFileIcon />, color: 'success' };
            case 'Foto 3x4':
                return { icon: <ImageIcon />, color: 'default' };
            // Adicione mais casos conforme necessário
            default:
                return { icon: <InsertDriveFileIcon />, color: 'default' };
        }
    };

    const handleMouseEnter = (e, caminho) => {
        setPreview({ src: `${import.meta.env.VITE_REACT_APP_URL}${caminho}`, x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setPreview({ src: '', x: 0, y: 0 });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>Pasta do funcionário</DialogTitle>
            <DialogContent>
                <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    {files.length === 0 ? (
                        <p>Arraste e solte os arquivos aqui, ou clique para selecionar arquivos</p>
                    ) : (
                        <div>
                            <h4>Arquivos prontos para upload:</h4>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <TextField
                    select
                    label="Tipo de Documento"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="CPF">CPF</MenuItem>
                    <MenuItem value="RG">RG</MenuItem>
                    <MenuItem value="Certidao">Certidão</MenuItem>
                    <MenuItem value="Carteira de Trabalho">Carteira de Trabalho</MenuItem>
                    <MenuItem value="Titulo de Eleitor">Título de Eleitor</MenuItem>
                    <MenuItem value="Comprovante de Residencia">Comprovante de Residência</MenuItem>
                    <MenuItem value="Carteira de Habilitacao">Carteira de Habilitação</MenuItem>
                    <MenuItem value="Certificado de Reservista">Certificado de Reservista</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="Certificado de Conclusao de Curso">Certificado de Conclusão de Curso</MenuItem>
                    <MenuItem value="Atestado de Antecedentes Criminais">Atestado de Antecedentes Criminais</MenuItem>
                    <MenuItem value="Foto 3x4">Foto 3x4</MenuItem>
                    <MenuItem value="Certidão dos Dependentes">Declaração de Dependentes</MenuItem>
                    {/* Adicione outros tipos de documentos conforme necessário */}
                </TextField>

                {uploading && <CircularProgress />}
                <h4>Documentos Salvos</h4>
                <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {Array.isArray(documents) && documents.map((doc) => {
                        const { icon, color } = getDocumentProps(doc.tipo);
                        return (
                            <Chip
                                key={doc.id}
                                label={doc.tipo}
                                onClick={() => window.open(`${import.meta.env.VITE_REACT_APP_URL}${doc.caminho}`, '_blank')}
                                deleteIcon={<DeleteIcon />}
                                onDelete={() => handleDelete(doc.id)}
                                variant="outlined"
                                icon={icon}
                                color={color}
                                onMouseEnter={(e) => doc.tipo === 'Foto 3x4' && handleMouseEnter(e, doc.caminho)}
                                onMouseLeave={handleMouseLeave}
                            />
                        );
                    })}
                </Box>
                {preview.src && (
                    <img
                        src={preview.src}
                        alt="Pré-visualização"
                        style={{
                            position: 'fixed',
                            top: preview.y,
                            left: preview.x,
                            maxWidth: '200px',
                            maxHeight: '200px',
                            zIndex: 1000,
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            padding: '5px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleUpload} disabled={uploading || !files.length || !docType}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentsModal;
