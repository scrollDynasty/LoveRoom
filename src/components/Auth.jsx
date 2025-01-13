import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/styleAuth.scss';

const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

function Auth({ setAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username', username);
      setAuthenticated(true);
      showNotification('Login successful!', 'success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      showNotification('Invalid username or password', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        show: false
      }));
    }, 5000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <Typography variant="h4">
          Welcome Back
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <Button
          className="login-button"
          variant="contained"
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </div>

      <div className="notification-container">
        <Snackbar
          open={notification.show}
          autoHideDuration={5000}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            severity={notification.type}
            className={`${notification.type}-alert`}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Auth;