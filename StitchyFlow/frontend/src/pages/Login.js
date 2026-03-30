import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', formData);
      localStorage.setItem('token', response.data.data.accessToken);
      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 12, mb: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(65, 0, 147, 0.12)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#410093',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Sign in to continue to StitchyFlow
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label="Email Address" 
              margin="normal" 
              type="email" 
              required
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#410093',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#410093',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#410093',
                },
              }}
            />
            <TextField 
              fullWidth 
              label="Password" 
              margin="normal" 
              type={showPassword ? 'text' : 'password'} 
              required
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#410093',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#410093',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#410093',
                },
              }}
            />
            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              sx={{ 
                mt: 3,
                py: 1.5,
                backgroundColor: '#410093',
                fontWeight: 600,
                borderRadius: '10px',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(65, 0, 147, 0.3)',
                '&:hover': {
                  backgroundColor: '#7f00ff',
                  boxShadow: '0 6px 20px rgba(65, 0, 147, 0.4)',
                },
              }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Don't have an account?{' '}
                <Button 
                  onClick={() => navigate('/register')} 
                  sx={{ 
                    color: '#410093',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default Login;
