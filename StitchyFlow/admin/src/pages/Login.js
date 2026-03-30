import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', formData);
      localStorage.setItem('adminToken', response.data.data.accessToken);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#ffffff'
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2196F3', mb: 1 }}>
            StitchyFlow Login
          </Typography>
        </Box>
        <Paper elevation={3} sx={{
          p: 5,
          borderRadius: 2,
          bgcolor: '#ffffff',
          border: '1px solid #e0e0e0'
        }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#2196F3' }
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#2196F3' }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#2196F3' }
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#2196F3' }
              }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: '#2196F3',
                '&:hover': { bgcolor: '#1976d2' },
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
