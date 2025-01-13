import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import '../styles/styleRecord.scss';

function RecordView({ record, onClose, onUpdate, onDelete, userName }) {
    const [newContent, setNewContent] = useState('');
    const [files, setFiles] = useState([]);
    const [contents, setContents] = useState(record.contents || []);
    const [selectedImage, setSelectedImage] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setContents(record.contents || []);
    }, [record.contents]);

    useEffect(() => {
        scrollToBottom();
    }, [contents]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleContentAdd = async () => {
        if (!newContent.trim() && files.length === 0) return;

        // Создаем новый элемент сообщения
        const newContentItem = {
            text: newContent,
            files: [],
            author: userName,
            timestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })
        };

        // Если есть файлы для загрузки
        if (files.length > 0) {
            // Сначала добавляем сообщение с файлами в состоянии загрузки
            const filesInProgress = files.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name,
                type: file.type,
                size: file.size,
                uploading: true,
                progress: 0
            }));

            newContentItem.files = filesInProgress;
            setContents(prev => [...prev, newContentItem]);

            // Эмулируем процесс загрузки для каждого файла
            const uploadedFiles = await Promise.all(files.map(async (file, index) => {
                const fileData = filesInProgress[index];

                // Эмуляция процесса загрузки
                for (let progress = 0; progress <= 100; progress += 10) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    fileData.progress = progress;
                    
                    // Обновляем состояние, чтобы показать прогресс
                    setContents(prev => {
                        const newContents = [...prev];
                        const lastMessage = {...newContents[newContents.length - 1]};
                        lastMessage.files = [...lastMessage.files];
                        lastMessage.files[index] = {...fileData};
                        newContents[newContents.length - 1] = lastMessage;
                        return newContents;
                    });
                }

                // Файл загружен
                fileData.uploading = false;
                return fileData;
            }));

            // Обновляем сообщение с загруженными файлами
            newContentItem.files = uploadedFiles;
        }

        // Обновляем состояние с новым сообщением
        setContents(prev => {
            if (files.length > 0) {
                return prev.slice(0, -1).concat(newContentItem);
            }
            return [...prev, newContentItem];
        });
        
        onUpdate(record.id, newContentItem);
        setNewContent('');
        setFiles([]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleContentAdd();
        }
    };

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const isCurrentUser = (author) => author === userName;

    return (
        <>
            <Dialog
                open={Boolean(record)}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                className="record-view-dialog"
            >
                <DialogTitle className="dialog-title">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{record.title}</Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="caption">
                        Created by {record.author} on {record.timestamp}
                    </Typography>
                </DialogTitle>

                <DialogContent className="dialog-content">
                    <div className="existing-contents">
                        {contents.map((content, index) => (
                            <div 
                                key={index} 
                                className={`content-item ${isCurrentUser(content.author) ? 'sent' : 'received'}`}
                            >
                                <Typography className="sender-name">
                                    {content.author}
                                </Typography>
                                <div className="message-bubble">
                                    {content.text && (
                                        <Typography className="content-text">
                                            {content.text}
                                        </Typography>
                                    )}
                                    {content.files && content.files.length > 0 && (
                                        <div className="files-container">
                                            {content.files.map((file, fileIndex) => (
                                                <div 
                                                    key={fileIndex} 
                                                    className={`file-item ${file.uploading ? 'uploading' : ''}`}
                                                >
                                                    {file.type?.startsWith('image/') ? (
                                                        <img 
                                                            src={file.url} 
                                                            alt="uploaded content"
                                                            onClick={() => handleImageClick(file.url)}
                                                        />
                                                    ) : file.type?.startsWith('video/') ? (
                                                        <video controls>
                                                            <source src={file.url} type={file.type} />
                                                        </video>
                                                    ) : (
                                                        <Typography>{file.name}</Typography>
                                                    )}
                                                    {file.uploading && (
                                                        <div className="upload-progress-overlay">
                                                            <div className="progress-circle" />
                                                            <div className="progress-text">
                                                                <span className="progress-percentage">
                                                                    {file.progress}%
                                                                </span>
                                                                <span className="file-size">
                                                                    {formatFileSize(file.size)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Typography variant="caption" className="content-meta">
                                    {content.timestamp}
                                </Typography>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="add-content-form">
                        <div className="content-input-container">
                            <TextField
                                multiline
                                maxRows={4}
                                fullWidth
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                variant="outlined"
                            />
                            <input
                                type="file"
                                multiple
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*,video/*"
                            />
                            <IconButton 
                                className="upload-button"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <AttachFileIcon />
                            </IconButton>
                            <IconButton
                                className="send-button"
                                onClick={handleContentAdd}
                                disabled={!newContent.trim() && files.length === 0}
                            >
                                <SendIcon />
                            </IconButton>
                        </div>

                        {files.length > 0 && (
                            <div className="file-preview-container">
                                {files.map((file, index) => (
                                    <div key={index} className="file-preview-item">
                                        {file.type.startsWith('image/') ? (
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt="preview" 
                                            />
                                        ) : file.type.startsWith('video/') ? (
                                            <video>
                                                <source 
                                                    src={URL.createObjectURL(file)} 
                                                    type={file.type}
                                                />
                                            </video>
                                        ) : (
                                            <Typography>{file.name}</Typography>
                                        )}
                                        <IconButton 
                                            className="remove-file-button"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Модальное окно для просмотра изображений */}
            <Dialog
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                maxWidth={false}
                className="image-viewer-modal"
            >
                <div className="image-viewer-container">
                    <div className="image-wrapper">
                        <img 
                            src={selectedImage} 
                            alt="Full size" 
                            onClick={() => setSelectedImage(null)}
                        />
                    </div>
                    <IconButton
                        className="close-button"
                        onClick={() => setSelectedImage(null)}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
            </Dialog>
        </>
    );
}

export default RecordView;