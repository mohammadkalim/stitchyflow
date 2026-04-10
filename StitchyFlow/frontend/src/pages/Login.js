import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, Checkbox, FormControlLabel, Divider, Paper,
  Dialog, DialogContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { validateEmail } from '../utils/validators';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Header from '../components/Header';

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [popup, setPopup] = useState({ open: false, message: '', type: 'error' });

  const showPopup = (message, type = 'error') => setPopup({ open: true, message, type });
  const closePopup = () => setPopup(p => ({ ...p, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      return showPopup('Please enter a valid email address.');
    }
    if (!formData.password) {
      return showPopup('Please enter your password.');
    }

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      const wasActivated = localStorage.getItem('accountWasActivated');
      if (wasActivated === user.email) {
        localStorage.removeItem('accountWasActivated');
        showPopup('🎉 Your account has been activated! Welcome back.', 'success');
        setTimeout(() => {
          if (user.role === 'tailor') navigate('/tailor-dashboard');
          else navigate('/customer-dashboard');
        }, 2500);
        return;
      }

      if (user.role === 'tailor') navigate('/tailor-dashboard');
      else navigate('/customer-dashboard');
    } catch (error) {
      const msg = error.message || 'Login failed. Please try again.';
      showPopup(msg);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#e8f4f8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
    }}>
      <Header />
      {/* Heading above card */}
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 0.8, mt: '80px' }}>
        Welcome Back
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3.5 }}>
        Sign in to access your StitchyFlow account
      </Typography>

      {/* Card */}
      <Paper elevation={0} sx={{
        width: '100%', maxWidth: 480,
        borderRadius: '16px',
        p: { xs: 3, sm: 4 },
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      }}>

        {/* Tab switcher */}
        <Box sx={{
          display: 'flex',
          bgcolor: '#f3f4f6',
          borderRadius: '10px',
          p: '4px',
          mb: 3.5,
        }}>
          {['signin', 'signup'].map((t) => (
            <Button key={t} fullWidth
              onClick={() => t === 'signup' ? navigate('/register') : setTab(t)}
              sx={{
                borderRadius: '8px',
                py: 0.9,
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                bgcolor: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#1a1a2e' : '#9ca3af',
                boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: tab === t ? '#fff' : 'rgba(0,0,0,0.04)' },
              }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          ))}
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>
            Email Address
          </Typography>
          <TextField fullWidth required type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '0.95rem',
                bgcolor: '#fff',
                '&:hover fieldset': { borderColor: '#2563eb' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #fff inset',
                  WebkitTextFillColor: '#1a1a2e',
                },
              },
            }}
          />

          {/* Password */}
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>
            Password
          </Typography>
          <TextField fullWidth required
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#590000', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword
                      ? <VisibilityOffIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
                      : <VisibilityIcon sx={{ fontSize: 20, color: '#9ca3af' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '0.95rem',
                bgcolor: '#fff',
                '&:hover fieldset': { borderColor: '#000000fc' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #fff inset',
                  WebkitTextFillColor: '#1a1a2e',
                },
              },
            }}
          />

          {/* Remember me + Forgot password */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <FormControlLabel
              control={
                <Checkbox size="small" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                  sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#2563eb' } }} />
              }
              label={<Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.85rem' }}>Remember me</Typography>}
              sx={{ m: 0 }}
            />
            <Button variant="text" onClick={() => navigate('/forgot-password')} sx={{
              color: '#2563eb', fontWeight: 600, fontSize: '0.85rem',
              textTransform: 'none', p: 0, minWidth: 0,
              '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' },
            }}>
              Forgot password?
            </Button>
          </Box>

          {/* Sign In button */}
          <Button fullWidth variant="contained" type="submit" sx={{
            bgcolor: '#2563eb', fontWeight: 700, borderRadius: '10px',
            py: 1.5, fontSize: '1rem', textTransform: 'none',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            mb: 2.5,
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 6px 20px rgba(37,99,235,0.45)' },
          }}>
            Sign In
          </Button>

          {/* Divider */}
          <Divider sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#9ca3af', px: 1 }}>Or continue with</Typography>
          </Divider>

          {/* Google button */}
          <Button fullWidth variant="outlined" sx={{
            borderColor: '#e5e7eb', color: '#374151',
            fontWeight: 600, borderRadius: '10px',
            py: 1.3, fontSize: '0.95rem', textTransform: 'none',
            bgcolor: '#fff',
            '&:hover': { bgcolor: '#f9fafb', borderColor: '#d1d5db' },
          }}
            onClick={() => window.location.href = '/api/v1/auth/google'}
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
        Don't have an account?{' '}
        <Button variant="text" onClick={() => navigate('/register')} sx={{
          color: '#2563eb', fontWeight: 700, textTransform: 'none',
          p: 0, minWidth: 0, fontSize: '0.875rem',
          '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' },
        }}>
          Sign up
        </Button>
      </Typography>

      {/* Custom Alert Dialog — handles error / success / suspended */}
      <Dialog open={popup.open} onClose={closePopup}
        PaperProps={{
          sx: {
            borderRadius: '24px', p: 0, minWidth: 360, maxWidth: 420,
            boxShadow: '0 32px 80px rgba(0,0,0,0.18)', overflow: 'hidden',
          }
        }}>
        <DialogContent sx={{ p: 0 }}>
          {/* Top accent bar */}
          <Box sx={{
            height: 5,
            bgcolor: popup.type === 'success' ? '#16a34a' : popup.type === 'suspended' ? '#dc2626' : '#ef4444',
            borderRadius: '24px 24px 0 0',
          }} />

          <Box sx={{ px: 4, pt: 3.5, pb: 4 }}>
            {/* Icon + Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{
                width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
                bgcolor: popup.type === 'success' ? '#dcfce7' : popup.type === 'suspended' ? '#fee2e2' : '#fef2f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: popup.type === 'success' ? '0 4px 12px rgba(22,163,74,0.2)' : '0 4px 12px rgba(220,38,38,0.2)',
              }}>
                {popup.type === 'success'
                  ? <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 28 }} />
                  : <ErrorOutlineIcon sx={{ color: '#dc2626', fontSize: 28 }} />}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.3 }}>
                  {popup.type === 'success' ? '✅ Account Activated!' : popup.type === 'suspended' ? '🚫 Account Suspended' : 'Login Failed'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  {popup.type === 'success' ? 'Welcome back to StitchyFlow' : popup.type === 'suspended' ? 'Access Restricted' : 'Authentication Error'}
                </Typography>
              </Box>
            </Box>

            {/* Divider */}
            <Box sx={{ height: 1, bgcolor: '#f1f5f9', mb: 2 }} />

            {/* Message */}
            <Box sx={{
              p: 2, borderRadius: '12px', mb: 3,
              bgcolor: popup.type === 'success' ? '#f0fdf4' : popup.type === 'suspended' ? '#fef2f2' : '#fef2f2',
              border: `1px solid ${popup.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            }}>
              <Typography variant="body2" sx={{ color: popup.type === 'success' ? '#15803d' : '#b91c1c', lineHeight: 1.7, fontWeight: 500 }}>
                {popup.message}
              </Typography>
            </Box>

            {popup.type === 'suspended' && (
              <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#fffbeb', border: '1px solid #fde68a', mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  What to do next?
                </Typography>
                <Typography variant="caption" sx={{ color: '#78350f', lineHeight: 1.6 }}>
                  Contact your administrator to review and restore your account access.
                </Typography>
              </Box>
            )}

            {/* Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={closePopup} variant="contained" sx={{
                bgcolor: popup.type === 'success' ? '#16a34a' : popup.type === 'suspended' ? '#dc2626' : '#2563eb',
                color: '#fff', fontWeight: 700, borderRadius: '12px', px: 4, py: 1.2,
                textTransform: 'none', fontSize: '0.9rem', boxShadow: 'none',
                '&:hover': {
                  bgcolor: popup.type === 'success' ? '#15803d' : popup.type === 'suspended' ? '#b91c1c' : '#1d4ed8',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}>
                {popup.type === 'success' ? 'Continue' : 'Understood'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Login;
