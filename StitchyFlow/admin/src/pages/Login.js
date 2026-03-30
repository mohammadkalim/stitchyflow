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
      bgcolor: '#ffffff',
      position: 'relative'
    }}>
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={24} sx={{
          p: 5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 80,
              height: 80,
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}>
              <Typography sx={{ fontSize: 48, color: '#ffffff', fontWeight: 700 }}>
                S
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#1976d2',
              mb: 1,
              letterSpacing: '-0.5px'
            }}>
              StitchyFlow Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#64B5F6', fontSize: '0.95rem' }}>
              Welcome back! Please login to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Enter your email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#64B5F6' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover': {
                    bgcolor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#90CAF9'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                    '& fieldset': {
                      borderColor: '#2196F3',
                      borderWidth: '2px'
                    }
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px 14px',
                  fontSize: '0.95rem'
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#64B5F6' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#64B5F6' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover': {
                    bgcolor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#90CAF9'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                    '& fieldset': {
                      borderColor: '#2196F3',
                      borderWidth: '2px'
                    }
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px 14px',
                  fontSize: '0.95rem'
                }
              }}
            />

            {error && (
              <Box sx={{
                mb: 2,
                p: 2,
                bgcolor: '#FFEBEE',
                borderRadius: 2,
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
                mt: 2,
                py: 1.8,
                background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)'
                },
                '&:active': {
                  transform: 'translateY(0px)'
                }
              }}
            >
              Login
            </Button>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#90A4AE', fontSize: '0.75rem' }}>
              © 2026 StitchyFlow. All rights reserved.{' '}
              <a 
                href="https://logixinventor.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#2196F3', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#1976d2'}
                onMouseLeave={(e) => e.target.style.color = '#2196F3'}
              >
                LOGIXINVENTOR PVT LTD
              </a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
