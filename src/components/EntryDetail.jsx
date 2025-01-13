import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';
import '../styles/styleEntryDetail.scss';

function EntryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState({
        title: 'Sample Entry',
        date: new Date().toISOString(),
        author: localStorage.getItem('username'),
        content: '',
        images: [],
        comments: []
    });
    const [newComment, setNewComment] = useState('');

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now(),
                text: newComment,
                author: localStorage.getItem('username'),
                date: new Date().toISOString()
            };
            setEntry({
                ...entry,
                comments: [...entry.comments, comment]
            });
            setNewComment('');
        }
    };

    return (
        <div className="entry-detail-container">
            <Paper className="entry-detail-content">
                <Button onClick={handleBack} className="back-button">
                    Back to Dashboard
                </Button>
                
                <Typography variant="h4" className="entry-title">
                    {entry.title}
                </Typography>
                
                <Typography color="textSecondary" className="entry-metadata">
                    Created by {entry.author} on {new Date(entry.date).toLocaleString()}
                </Typography>
                
                <TextField
                    multiline
                    rows={6}
                    fullWidth
                    placeholder="Add your detailed entry here..."
                    value={entry.content}
                    onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                    className="entry-content"
                />
                
                <Box className="comments-section">
                    <Typography variant="h6">Comments</Typography>
                    {entry.comments.map((comment) => (
                        <Paper key={comment.id} className="comment">
                            <Typography variant="body2" color="textSecondary">
                                {comment.author} - {new Date(comment.date).toLocaleString()}
                            </Typography>
                            <Typography>{comment.text}</Typography>
                        </Paper>
                    ))}
                    
                    <Box className="add-comment">
                        <TextField
                            fullWidth
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button onClick={handleAddComment}>Add Comment</Button>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
}

export default EntryDetail;