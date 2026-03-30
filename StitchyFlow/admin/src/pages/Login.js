import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: '#ffffff',
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 80,
              height: 80,
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}>
              <Typography sx={{ fontSize: 48, color: '#ffffff', fontWeight: 700 }}>
                S
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: '#2196F3',
              mb: 1
            }}>
              StitchyFlow Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#64B5F6', fontSize: '0.875rem' }}>
              Welcome back! Please login to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#2196F3' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: '#e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#2196F3'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196F3'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#2196F3' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#2196F3' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: '#e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#2196F3'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196F3'
                  }
                }
              }}
            />

            {error && (
              <Box sx={{
                mb: 2,
                p: 1.5,
                bgcolor: '#FFEBEE',
                borderRadius: 1,
                border: '1px solid #FFCDD2'
              }}>
                <Typography sx={{ color: '#D32F2F', fontSize: '0.875rem', textAlign: 'center' }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: 1.5,
                background: '#2196F3',
                borderRadius: 1,
                fontWeight: 600,
                '&:hover': {
                  background: '#1976d2'
                }
              }}
            >
              Login
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
              © 2026 StitchyFlow. All rights reserved.{' '}
              <a 
                href="https://logixinventor.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 600 }}
              >
                LOGIXINVENTOR PVT LTD
              </a>
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
            Developed By{' '}
            <a 
              href="https://markinventor.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 600 }}
            >
              MARKINVENTOR
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
