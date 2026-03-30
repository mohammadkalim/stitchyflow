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
      bgcolor: '#f0f2f5',
      backgroundImage: 'linear-gradient(135deg, #f0f2f5 0%, #e8eaed 100%)'
    }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{
          p: 5,
          borderRadius: '24px',
          bgcolor: '#ffffff',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.04)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 72,
              height: 72,
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(33, 150, 243, 0.35)'
            }}>
              <Typography sx={{ fontSize: 36, color: '#ffffff', fontWeight: 700 }}>S</Typography>
            </Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#1a1a2e',
              mb: 1,
              letterSpacing: '-0.5px'
            }}>
              StitchyFlow
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', fontSize: '0.95rem' }}>
              Sign in to your admin account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email Address"
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
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: '#2196F3'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196F3',
                    borderWidth: '2px'
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
                      sx={{ color: '#999', '&:hover': { color: '#2196F3' } }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: '#2196F3'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196F3',
                    borderWidth: '2px'
                  }
                }
              }}
            />

            {error && (
              <Box sx={{
                mb: 2.5,
                p: 2,
                bgcolor: '#FFF5F5',
                borderRadius: '12px',
                border: '1px solid #FFCDD2'
              }}>
                <Typography sx={{ color: '#D32F2F', fontSize: '0.875rem', textAlign: 'center', fontWeight: 500 }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: 1.8,
                background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(33, 150, 243, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
                  boxShadow: '0 12px 32px rgba(33, 150, 243, 0.45)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </Button>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center', pt: 3, borderTop: '1px solid #f0f0f0' }}>
            <Typography variant="caption" sx={{ color: '#999', fontSize: '0.8rem' }}>
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

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#999', fontSize: '0.8rem' }}>
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
