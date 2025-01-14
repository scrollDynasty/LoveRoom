import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Popover,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import DataService from '../services/DataService.js';
import ImageViewer from './ImageViewer.jsx';
import '../styles/styleRecord.scss';

const RecordView = ({ record, onClose, onUpdate, onDelete, userName }) => {
  const [contents, setContents] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const contentEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadContents();
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [record.id]);

  useEffect(() => {
    scrollToBottom();
  }, [contents]);

  const loadContents = async () => {
    try {
      const savedContents = JSON.parse(localStorage.getItem(`chat_${record.id}`) || '[]');
      const updatedContents = await Promise.all(savedContents.map(async (content) => {
        if (content.files && content.files.length > 0) {
          const updatedFiles = await Promise.all(content.files.map(async (file) => {
            if (file.key) {
              const url = await DataService.getFileUrl(file.key);
              return { ...file, url };
            }
            return file;
          }));
          return { ...content, files: updatedFiles };
        }
        return content;
      }));

      setContents(updatedContents);
    } catch (error) {
      console.error('Error loading contents:', error);
      showSnackbar('Error loading messages', 'error');
    }
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const scrollToBottom = () => {
    contentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContentAdd = async () => {
    if (!newContent.trim() && files.length === 0) return;
    setIsUploading(true);

    try {
      const uploadedFiles = await Promise.all(
        files.map(async ({ file }) => {
          const onProgress = (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          };
          return await DataService.uploadFile(file, `chat_${record.id}/`, onProgress);
        })
      );

      const newContentItem = {
        text: newContent.trim(),
        files: uploadedFiles,
        author: userName,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };

      const updatedContents = [...contents, newContentItem];
      setContents(updatedContents);
      localStorage.setItem(`chat_${record.id}`, JSON.stringify(updatedContents));
      onUpdate(record.id, newContentItem);

      setNewContent('');
      setFiles([]);
      setUploadProgress({});
      showSnackbar('Message sent successfully', 'success');
    } catch (error) {
      console.error('Error adding content:', error);
      showSnackbar('Error sending message', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (contentId, fileKey) => {
    try {
      await DataService.deleteFile(fileKey);
      const updatedContents = contents.map(content => {
        if (content.id === contentId) {
          return {
            ...content,
            files: content.files.filter(file => file.key !== fileKey)
          };
        }
        return content;
      });
      setContents(updatedContents);
      localStorage.setItem(`chat_${record.id}`, JSON.stringify(updatedContents));
      showSnackbar('File deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting file:', error);
      showSnackbar('Error deleting file', 'error');
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      const contentToDelete = contents.find(content => content.id === contentId);
      if (contentToDelete?.files) {
        await Promise.all(
          contentToDelete.files.map(file => DataService.deleteFile(file.key))
        );
      }
      const updatedContents = contents.filter(content => content.id !== contentId);
      setContents(updatedContents);
      localStorage.setItem(`chat_${record.id}`, JSON.stringify(updatedContents));
      showSnackbar('Message deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting message:', error);
      showSnackbar('Error deleting message', 'error');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMenuOpen = (event, content) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedContent(content);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedContent(null);
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType.startsWith('video/')) return <VideoCameraBackIcon />;
    return <InsertDriveFileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <>
      <Dialog 
        open={true} 
        onClose={onClose} 
        className="record-view-dialog"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{record.title}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent className="dialog-content">
          <div className="existing-contents">
            {contents.map((content, index) => (
              <div key={index} className={`content-item ${content.author === userName ? 'sent' : 'received'}`}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar className="user-avatar">
                    {content.author[0].toUpperCase()}
                  </Avatar>
                  <Typography className="sender-name" variant="subtitle2">
                    {content.author}
                  </Typography>
                  {content.author === userName && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, content)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Box>

                <div className="message-bubble">
                  {content.text && (
                    <Typography className="content-text">
                      {content.text}
                    </Typography>
                  )}
                  {content.files && content.files.length > 0 && (
                    <div className="files-container">
                      {content.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="file-item">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              onClick={() => setSelectedImage(file.url)}
                            />
                          ) : file.type.startsWith('video/') ? (
                            <video controls>
                              <source src={file.url} type={file.type} />
                            </video>
                          ) : (
                            <Box className="file-box">
                              {getFileIcon(file.type)}
                              <Typography variant="caption">
                                {file.name}
                                <br />
                                {formatFileSize(file.size)}
                              </Typography>
                            </Box>
                          )}
                          {content.author === userName && (
                            <IconButton
                              size="small"
                              className="delete-file"
                              onClick={() => handleDeleteFile(content.id, file.key)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Typography className="content-meta" variant="caption">
                  {new Date(content.timestamp).toLocaleString()}
                </Typography>
              </div>
            ))}
            <div ref={contentEndRef} />
          </div>
          
          <div className="add-content-form">
            <div className="upload-progress">
              {files.length > 0 && (
                <div className="file-preview-container">
                  {files.map((file, index) => (
                    <div key={index} className="file-preview-item">
                      {file.file.type.startsWith('image/') ? (
                        <div className="image-preview">
                          <img src={file.preview} alt={file.file.name} />
                          <div className="image-overlay">
                            <Typography variant="caption">{file.file.name}</Typography>
                          </div>
                        </div>
                      ) : file.file.type.startsWith('video/') ? (
                        <div className="video-preview">
                          <video width="100" height="100">
                            <source src={file.preview} type={file.file.type} />
                            Your browser does not support the video tag.
                          </video>
                          <div className="video-overlay">
                            <Typography variant="caption">{file.file.name}</Typography>
                          </div>
                        </div>
                      ) : (
                        <div className="file-preview">
                          <InsertDriveFileIcon />
                          <Typography variant="caption" className="file-name">
                            {file.file.name}
                          </Typography>
                        </div>
                      )}
                      <IconButton
                        size="small"
                        className="remove-file-button"
                        onClick={() => {
                          const newFiles = [...files];
                          newFiles.splice(index, 1);
                          setFiles(newFiles);
                          URL.revokeObjectURL(file.preview);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      {isUploading && (
                        <CircularProgress
                          size={24}
                          className="upload-progress-indicator"
                          variant="determinate"
                          value={uploadProgress[file.file.name] || 0}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="content-input-container">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
                accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              
              <div className="input-buttons-left">
                <Tooltip title="Attach files">
                  <IconButton
                    className="upload-button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                  >
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Add emoji">
                  <IconButton
                    className="emoji-button"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    disabled={isUploading}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <TextField
                className="message-input"
                fullWidth
                multiline
                maxRows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Type your message..."
                disabled={isUploading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleContentAdd();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isTyping && (
                        <CircularProgress
                          size={20}
                          className="typing-indicator"
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <div className="input-buttons-right">
                {(newContent.trim() || files.length > 0) && (
                  <Tooltip title="Send message">
                    <IconButton
                      className="send-button"
                      onClick={handleContentAdd}
                      disabled={isUploading}
                      color="primary"
                    >
                      <SendIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div className="emoji-picker-container">
                <EmojiPicker
                  onEmojiClick={(event, emojiObject) => {
                    setNewContent((prev) => prev + emojiObject.emoji);
                    setAnchorEl(null);
                  }}
                />
              </div>
            </Popover>

            {isUploading && (
              <div className="upload-overlay">
                <div className="upload-progress-container">
                  <CircularProgress size={48} />
                  <Typography variant="body2" className="upload-status">
                    Uploading files...
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </DialogContent>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Dialog>
    </>
  );
};

RecordView.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired
};

export default RecordView;