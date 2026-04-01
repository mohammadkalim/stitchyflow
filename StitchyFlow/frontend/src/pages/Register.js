import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment, IconButton,
  Checkbox, FormControlLabel, Divider, Paper, Grid,
  Dialog, DialogContent, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Header from '../components/Header';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', fontSize: '0.95rem',
    bgcolor: '#fff',
    '&:hover fieldset': { borderColor: '#2563eb' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #fff inset',
      WebkitTextFillColor: '#1a1a2e',
    },
  },
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', phone: '', role: 'customer', customerType: 'standard',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: '', type: 'error' });
  const [loading, setLoading] = useState(false);

  const showPopup = (message, type = 'error') => setPopup({ open: true, message, type });
  const closePopup = () => setPopup(p => ({ ...p, open: false }));

  const set = (field) => (e) => setFormData(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showPopup('Passwords do not match. Please try again.');
    }
    if (!agreed) {
      return showPopup('Please agree to the Terms of Service and Privacy Policy.');
    }
    
    setLoading(true);
    try {
      // Send verification code
      const response = await axios.post('http://localhost:5000/api/v1/verification/register/send-code', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        customerType: formData.customerType
      });
      
      if (response.data.success) {
        // Navigate to verification page
        navigate('/verify-code', {
          state: {
            email: formData.email,
            formData: formData,
            expiresIn: response.data.data.expiresIn
          }
        });
      }
    } catch (error) {
      showPopup(error.response?.data?.error?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: '#e8f4f8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', px: 2, py: 5,
    }}>
      <Header />
      {/* Heading */}
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 0.8, mt: '80px' }}>
        Create Your Account
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3.5 }}>
        Join StitchyFlow and start your tailoring journey
      </Typography>

      {/* Card */}
      <Paper elevation={0} sx={{
        width: '100%', maxWidth: 500,
        borderRadius: '16px', p: { xs: 3, sm: 4 },
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      }}>

        {/* Tab switcher */}
        <Box sx={{
          display: 'flex', bgcolor: '#f3f4f6',
          borderRadius: '10px', p: '4px', mb: 3,
        }}>
          {['signin', 'signup'].map((t) => (
            <Button key={t} fullWidth
              onClick={() => t === 'signin' ? navigate('/login') : null}
              sx={{
                borderRadius: '8px', py: 0.9,
                fontWeight: 600, fontSize: '0.9rem', textTransform: 'none',
                bgcolor: t === 'signup' ? '#fff' : 'transparent',
                color: t === 'signup' ? '#2563eb' : '#9ca3af',
                boxShadow: t === 'signup' ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: t === 'signup' ? '#fff' : 'rgba(0,0,0,0.04)' },
              }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          ))}
        </Box>

        <form onSubmit={handleSubmit}>

          {/* Account Type */}
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'block' }}>
            Account Type
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
            {[
              { value: 'customer', label: 'Customer', sub: 'Book tailors', icon: <PersonOutlineIcon sx={{ fontSize: 22, color: formData.role === 'customer' ? '#2563eb' : '#9ca3af' }} /> },
              { value: 'tailor',   label: 'Tailor Shop',   sub: 'Offer stitching', icon: <StorefrontOutlinedIcon sx={{ fontSize: 22, color: formData.role === 'tailor' ? '#2563eb' : '#9ca3af' }} /> },
            ].map((opt) => (
              <Grid item xs={6} key={opt.value}>
                <Box onClick={() => setFormData(f => ({ ...f, role: opt.value }))} sx={{
                  border: `1.5px solid ${formData.role === opt.value ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: '10px', p: 1.5, cursor: 'pointer',
                  bgcolor: formData.role === opt.value ? '#eff6ff' : '#fff',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#2563eb' },
                }}>
                  <Box sx={{ mb: 0.5 }}>{opt.icon}</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{
                      width: 14, height: 14, borderRadius: '50%',
                      border: `2px solid ${formData.role === opt.value ? '#2563eb' : '#d1d5db'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {formData.role === opt.value && (
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.85rem' }}>
                      {opt.label}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', pl: '22px', display: 'block' }}>
                    {opt.sub}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* First + Last Name */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>First Name</Typography>
              <TextField fullWidth required placeholder="First name" value={formData.firstName} onChange={set('firstName')}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#9ca3af', fontSize: 18 }} /></InputAdornment> }}
                sx={fieldSx} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>Last Name</Typography>
              <TextField fullWidth required placeholder="Last name" value={formData.lastName} onChange={set('lastName')}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#9ca3af', fontSize: 18 }} /></InputAdornment> }}
                sx={fieldSx} />
            </Grid>
          </Grid>

          {/* Email */}
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>Email Address</Typography>
          <TextField fullWidth required type="email" placeholder="Enter your email"
            value={formData.email} onChange={set('email')}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: '#9ca3af', fontSize: 18 }} /></InputAdornment> }}
            sx={{ ...fieldSx, mb: 2 }} />

          {/* Phone */}
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>Phone Number</Typography>
          <TextField fullWidth placeholder="+92 300 1234567"
            value={formData.phone} onChange={set('phone')}
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={{ color: '#9ca3af', fontSize: 18 }} /></InputAdornment> }}
            sx={{ ...fieldSx, mb: 2 }} />

          {/* Password */}
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>Password</Typography>
          <TextField fullWidth required placeholder="Create a password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password} onChange={set('password')}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#9ca3af', fontSize: 18 }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18, color: '#9ca3af' }} /> : <VisibilityIcon sx={{ fontSize: 18, color: '#9ca3af' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ ...fieldSx, mb: 2 }} />

          {/* Confirm Password */}
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>Confirm Password</Typography>
          <TextField fullWidth required placeholder="Confirm your password"
            type={showConfirm ? 'text' : 'password'}
            value={formData.confirmPassword} onChange={set('confirmPassword')}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#9ca3af', fontSize: 18 }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? <VisibilityOffIcon sx={{ fontSize: 18, color: '#9ca3af' }} /> : <VisibilityIcon sx={{ fontSize: 18, color: '#9ca3af' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ ...fieldSx, mb: 2 }} />

          {/* Terms */}
          <FormControlLabel
            control={
              <Checkbox size="small" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#2563eb' } }} />
            }
            label={
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.83rem' }}>
                I agree to the{' '}
                <Box component="span" sx={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Terms of Service</Box>
                {' '}and{' '}
                <Box component="span" sx={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</Box>
              </Typography>
            }
            sx={{ mb: 2.5, alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0.2 } }}
          />

          {/* Create Account button */}
          <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{
            bgcolor: '#2563eb', fontWeight: 700, borderRadius: '10px',
            py: 1.5, fontSize: '1rem', textTransform: 'none',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)', mb: 2.5,
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 6px 20px rgba(37,99,235,0.45)' },
            '&:disabled': { bgcolor: '#94a3b8' }
          }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Sending Code...
              </Box>
            ) : 'Create Account'}
          </Button>

          {/* Divider */}
          <Divider sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#9ca3af', px: 1 }}>Or continue with</Typography>
          </Divider>

          {/* Google */}
          <Button fullWidth variant="outlined" sx={{
            borderColor: '#e5e7eb', color: '#374151', fontWeight: 600,
            borderRadius: '10px', py: 1.3, fontSize: '0.95rem',
            textTransform: 'none', bgcolor: '#fff',
            '&:hover': { bgcolor: '#f9fafb', borderColor: '#d1d5db' },
          }}
            startIcon={
              <Box component="img"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google" sx={{ width: 20, height: 20 }} />
            }>
            Continue with Google
          </Button>
        </form>
      </Paper>

      {/* Bottom link */}
      <Typography variant="body2" sx={{ color: '#6b7280', mt: 3 }}>
        Already have an account?{' '}
        <Button variant="text" onClick={() => navigate('/login')} sx={{
          color: '#2563eb', fontWeight: 700, textTransform: 'none',
          p: 0, minWidth: 0, fontSize: '0.875rem',
          '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' },
        }}>
          Sign In
        </Button>
      </Typography>

      {/* Custom Alert Dialog */}
      <Dialog open={popup.open} onClose={closePopup}
        PaperProps={{
          sx: {
            borderRadius: '20px', p: 0,
            minWidth: 340, maxWidth: 400,
            boxShadow: '0 24px 64px rgba(0,0,0,0.14)', overflow: 'hidden',
          }
        }}>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: 5, bgcolor: popup.type === 'success' ? '#16a34a' : '#ef4444', borderRadius: '20px 20px 0 0' }} />
          <Box sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{
                width: 42, height: 42, borderRadius: '12px',
                bgcolor: popup.type === 'success' ? '#dcfce7' : '#fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {popup.type === 'success'
                  ? <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 24 }} />
                  : <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 24 }} />}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem' }}>
                {popup.type === 'success' ? 'Success' : 'Registration Error'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6, mb: 3, pl: '58px' }}>
              {popup.message}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={closePopup} variant="contained" sx={{
                bgcolor: popup.type === 'success' ? '#16a34a' : '#2563eb',
                color: '#fff', fontWeight: 700, borderRadius: '10px',
                px: 3.5, py: 1, textTransform: 'none', fontSize: '0.9rem',
                boxShadow: 'none',
                '&:hover': { bgcolor: popup.type === 'success' ? '#15803d' : '#1d4ed8' },
              }}>
                OK
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Register;
