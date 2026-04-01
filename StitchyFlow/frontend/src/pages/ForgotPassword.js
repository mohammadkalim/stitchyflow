import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment, IconButton,
  Paper, Stepper, Step, StepLabel, Dialog, DialogContent,
  CircularProgress, Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '../components/Header';

const steps = ['Enter Email', 'Verify Identity', 'Set New Password'];

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: '', type: 'error' });

  // Form states
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get email from localStorage if user was logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email) {
        setEmail(user.email);
        setUserData(user);
      }
    }
  }, []);

  const showPopup = (message, type = 'error') => setPopup({ open: true, message, type });
  const closePopup = () => setPopup(p => ({ ...p, open: false }));

  // Step 1: Validate email and continue
  const handleStep1Next = async () => {
    if (!email) {
      showPopup('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/password/check-user/${email}`);
      if (response.data.success && response.data.data.exists) {
        setUserData(response.data.data.user);
        setActiveStep(1);
      } else {
        showPopup('No account found with this email address');
      }
    } catch (error) {
      showPopup(error.response?.data?.error?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate old password
  const handleStep2Next = async () => {
    if (!oldPassword) {
      showPopup('Please enter your old password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/password/validate', {
        email,
        oldPassword
      });

      if (response.data.success) {
        setActiveStep(2);
      }
    } catch (error) {
      showPopup(error.response?.data?.error?.message || 'Old password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update password
  const handleStep3Submit = async () => {
    if (!newPassword) {
      showPopup('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      showPopup('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      showPopup('New password and confirm password do not match');
      return;
    }

    if (oldPassword === newPassword) {
      showPopup('New password must be different from old password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/password/update', {
        email,
        oldPassword,
        newPassword
      });

      if (response.data.success) {
        showPopup('Password updated successfully! Please login with your new password.', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      showPopup(error.response?.data?.error?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/login');
    } else {
      setActiveStep(activeStep - 1);
    }
  };

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

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: '#e8f4f8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', px: 2, py: 5,
    }}>
      <Header />

      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 0.8, mt: '80px' }}>
        Forgot Password
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3.5, textAlign: 'center' }}>
        Reset your password securely
      </Typography>

      <Paper elevation={0} sx={{
        width: '100%', maxWidth: 500,
        borderRadius: '16px', p: { xs: 3, sm: 4 },
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Email */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!userData?.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldSx, mb: 3 }}
            />

            {userData?.email && (
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                Email is pre-filled from your account and cannot be edited.
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  flex: 1,
                  borderRadius: '10px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleStep1Next}
                disabled={loading}
                sx={{
                  flex: 2,
                  bgcolor: '#2563eb',
                  fontWeight: 700,
                  borderRadius: '10px',
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 6px 20px rgba(37,99,235,0.45)' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Old Password */}
        {activeStep === 1 && (
          <Box>
            <Box sx={{ 
              bgcolor: '#eff6ff', p: 2, borderRadius: '12px', mb: 3,
              display: 'flex', alignItems: 'center', gap: 1.5
            }}>
              <EmailOutlinedIcon sx={{ color: '#2563eb' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af' }}>
                {email}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>
              Old Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your old password"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end" size="small">
                      {showOldPassword
                        ? <VisibilityOffIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
                        : <VisibilityIcon sx={{ fontSize: 20, color: '#9ca3af' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldSx, mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{
                  flex: 1,
                  borderRadius: '10px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleStep2Next}
                disabled={loading}
                sx={{
                  flex: 2,
                  bgcolor: '#2563eb',
                  fontWeight: 700,
                  borderRadius: '10px',
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 6px 20px rgba(37,99,235,0.45)' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: New Password */}
        {activeStep === 2 && (
          <Box>
            <Box sx={{ 
              bgcolor: '#eff6ff', p: 2, borderRadius: '12px', mb: 3,
              display: 'flex', alignItems: 'center', gap: 1.5
            }}>
              <EmailOutlinedIcon sx={{ color: '#2563eb' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af' }}>
                {email}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>
              New Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter new password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" size="small">
                      {showNewPassword
                        ? <VisibilityOffIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
                        : <VisibilityIcon sx={{ fontSize: 20, color: '#9ca3af' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldSx, mb: 2 }}
            />

            <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.6, display: 'block' }}>
              Confirm New Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                      {showConfirmPassword
                        ? <VisibilityOffIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
                        : <VisibilityIcon sx={{ fontSize: 20, color: '#9ca3af' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldSx, mb: 3 }}
            />

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{
                  flex: 1,
                  borderRadius: '10px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleStep3Submit}
                disabled={loading}
                sx={{
                  flex: 2,
                  bgcolor: '#16a34a',
                  fontWeight: 700,
                  borderRadius: '10px',
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                  '&:hover': { bgcolor: '#15803d', boxShadow: '0 6px 20px rgba(22,163,74,0.45)' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

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
                {popup.type === 'success' ? 'Success' : 'Error'}
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

export default ForgotPassword;
