import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RecordView from './RecordView';
import '../styles/styleDashboard.scss';

function Dashboard({ setAuthenticated }) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [records, setRecords] = useState(() => {
        const savedRecords = localStorage.getItem('records');
        return savedRecords ? JSON.parse(savedRecords) : [];
    });
    const [openNewRecord, setOpenNewRecord] = useState(false);
    const [newRecordTitle, setNewRecordTitle] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        localStorage.setItem('records', JSON.stringify(records));
    }, [records]);

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        localStorage.removeItem('username');
        setAuthenticated(false);
        navigate('/login');
    };

    const handleAddRecord = () => {
        if (!newRecordTitle.trim()) return;

        const newRecord = {
            id: Date.now().toString(),
            title: newRecordTitle,
            author: username,
            timestamp: format(new Date(), 'dd.MM.yyyy HH:mm', { locale: uz, timeZone: 'Asia/Tashkent' }),
            contents: []
        };

        setRecords(prevRecords => [...prevRecords, newRecord]);
        setNewRecordTitle('');
        setOpenNewRecord(false);
    };

    const handleUpdateRecord = (recordId, newContent) => {
        setRecords(prevRecords => 
            prevRecords.map(record => {
                if (record.id === recordId) {
                    const updatedContents = [...(record.contents || []), {
                        ...newContent,
                        timestamp: format(new Date(), 'dd.MM.yyyy HH:mm', { locale: uz, timeZone: 'Asia/Tashkent' }),
                        author: username
                    }];
                    return {
                        ...record,
                        contents: updatedContents
                    };
                }
                return record;
            })
        );
    };

    const handleDeleteRecord = (recordId) => {
        setRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
        setSelectedRecord(null);
    };

    const handleOpenRecord = (record) => {
        if (record && record.id) {
            setSelectedRecord({
                ...record,
                contents: record.contents || []
            });
        }
    };

    const handleCloseRecord = () => {
        setSelectedRecord(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddRecord();
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h4">
                        Welcome, {username}!
                    </Typography>
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenNewRecord(true)}
                            className="add-button"
                            sx={{ mr: 2 }}
                        >
                            New Record
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </div>

            <Grid container spacing={3} className="records-grid">
                {records.map(record => (
                    <Grid item xs={12} sm={6} md={4} key={record.id}>
                        <Box 
                            className="record-card" 
                            onClick={() => handleOpenRecord(record)}
                        >
                            <Box className="record-content">
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="h6" className="record-title">
                                        {record.title}
                                    </Typography>
                                    <IconButton 
                                        size="small" 
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRecord(record.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="caption">
                                    Created by {record.author} on {record.timestamp}
                                </Typography>
                                {record.contents && record.contents.length > 0 && (
                                    <Typography variant="body2" className="messages-count">
                                        {record.contents.length} message{record.contents.length !== 1 ? 's' : ''}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog для создания новой записи */}
            <Dialog 
                open={openNewRecord} 
                onClose={() => setOpenNewRecord(false)}
                className="new-record-dialog"
            >
                <DialogTitle>Create New Record</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Record Title"
                        fullWidth
                        value={newRecordTitle}
                        onChange={(e) => setNewRecordTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewRecord(false)}>Cancel</Button>
                    <Button 
                        onClick={handleAddRecord}
                        disabled={!newRecordTitle.trim()}
                        className="create-button"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* RecordView компонент */}
            {selectedRecord && (
                <RecordView
                    record={selectedRecord}
                    onClose={handleCloseRecord}
                    onUpdate={handleUpdateRecord}
                    onDelete={handleDeleteRecord}
                    userName={username}
                />
            )}
        </div>
    );
}

export default Dashboard;