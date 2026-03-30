import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, MenuItem, InputAdornment, IconButton, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '', role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Registration failed');
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
            boxShadow: '0 8px 40px rgba(41, 182, 246, 0.12)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#29B6F6',
                mb: 1
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Join StitchyFlow and get started
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="First Name" 
                  margin="normal" 
                  required
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#29B6F6' },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Last Name" 
                  margin="normal" 
                  required
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#29B6F6' },
                  }}
                />
              </Grid>
            </Grid>
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
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#29B6F6' },
              }}
            />
            <TextField 
              fullWidth 
              label="Phone Number" 
              margin="normal"
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#29B6F6' },
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
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#29B6F6' },
              }}
            />
            <TextField 
              fullWidth 
              select 
              label="I am a" 
              margin="normal" 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#29B6F6' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#29B6F6' },
              }}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="tailor">Tailor</MenuItem>
              <MenuItem value="business_owner">Business Owner</MenuItem>
            </TextField>
            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              sx={{ 
                mt: 3,
                py: 1.5,
                backgroundColor: '#29B6F6',
                fontWeight: 600,
                borderRadius: '10px',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(41, 182, 246, 0.3)',
                '&:hover': {
                  backgroundColor: '#4FC3F7',
                  boxShadow: '0 6px 20px rgba(41, 182, 246, 0.4)',
                },
              }}
            >
              Create Account
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Already have an account?{' '}
                <Button 
                  onClick={() => navigate('/login')} 
                  sx={{ 
                    color: '#29B6F6',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign In
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

export default Register;
