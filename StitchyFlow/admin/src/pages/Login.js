import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Checkbox, FormControlLabel, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContentCut as ScissorsIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../utils/api';
import { prefetchAdminPage } from '../adminPageChunks';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const schedule =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => prefetchAdminPage('/dashboard'))
        : setTimeout(() => prefetchAdminPage('/dashboard'), 200);
    return () => {
      if (typeof window.cancelIdleCallback === 'function' && typeof schedule === 'number') {
        window.cancelIdleCallback(schedule);
      } else {
        clearTimeout(schedule);
      }
    };
  }, []);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      localStorage.setItem('adminToken', response.data.data.accessToken);
      navigate('/');
    } catch (error) {
      if (!error.response) {
        setError('Backend API is not reachable. Please run backend on localhost:5000 and try again.');
      } else {
        setError(error.response?.data?.error?.message || 'Login failed');
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#f5f5f5',
      position: 'relative',
      pt: 2
    }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: '16px',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)'
        }}>
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 64,
              height: 64,
              margin: '0 auto 16px',
              background: '#1976d2',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ScissorsIcon sx={{ fontSize: 36, color: '#ffffff' }} />
            </Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: '#212121',
              mb: 0.5
            }}>
              StitchyFlow Admin
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              Sign in to access the admin dashboard
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#5f6368', fontWeight: 500, fontSize: '0.875rem' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#f0f4ff',
                    fontSize: '0.9375rem',
                    '& fieldset': {
                      borderColor: '#e0e7ff',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#d0d7ef'
                    },
                    '&.Mui-focused': {
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px'
                      }
                    },
                    '& input': {
                      padding: '14px 16px',
                      '&::placeholder': {
                        color: '#c5cae9',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#5f6368', fontWeight: 500, fontSize: '0.875rem' }}>
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                InputProps={{
                  endAdornment: (
                    <Box
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#9e9e9e',
                        '&:hover': {
                          color: '#5f6368'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: 22 }} /> : <Visibility sx={{ fontSize: 22 }} />}
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#f0f4ff',
                    fontSize: '0.9375rem',
                    '& fieldset': {
                      borderColor: '#e0e7ff',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#d0d7ef'
                    },
                    '&.Mui-focused': {
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px'
                      }
                    },
                    '& input': {
                      padding: '14px 16px',
                      '&::placeholder': {
                        color: '#c5cae9',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Box>

            {/* Remember Me and Forgot Password */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{ 
                      color: '#dadce0',
                      '&.Mui-checked': {
                        color: '#1976d2'
                      }
                    }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: '#5f6368', fontSize: '0.875rem' }}>Remember me</Typography>}
              />
              <Link href="#" underline="none" sx={{ fontSize: '0.875rem', color: '#1976d2', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </Box>

            {error && (
              <Box sx={{
                mb: 2.5,
                p: 2,
                bgcolor: '#fce8e6',
                borderRadius: '12px',
                border: '1px solid #f5c6cb'
              }}>
                <Typography sx={{ color: '#c5221f', fontSize: '0.875rem', textAlign: 'center' }}>
                  {error}
                </Typography>
              </Box>
            )}

            {/* Sign In Button */}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: 1.75,
                background: '#1976d2',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  background: '#1565c0',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <Box sx={{ 
            mt: 3, 
            p: 2.5, 
            bgcolor: '#f8f9fa', 
            borderRadius: '12px',
            border: '1px solid #e8eaed'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#202124', mb: 1.5, fontSize: '0.875rem' }}>
              Admin Credentials
            </Typography>
            <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '0.8125rem', mb: 0.5 }}>
              <strong>Master Admin:</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '0.8125rem' }}>
              Email: admin@stitchyflow.com
            </Typography>
            <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '0.8125rem' }}>
              Password: admin123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
