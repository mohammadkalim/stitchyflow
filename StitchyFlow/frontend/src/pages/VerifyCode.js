import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Paper, Dialog, DialogContent,
  CircularProgress, Link, Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';
import Header from '../components/Header';

function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [isExpired, setIsExpired] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: '', type: 'error' });
  const inputRefs = useRef([]);

  // Get email and form data from location state
  const email = location.state?.email || '';
  const formData = location.state?.formData || {};
  const expireSeconds = location.state?.expiresIn || 600;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }
    setTimeLeft(expireSeconds);
  }, [email, expireSeconds, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const showPopup = (message, type = 'error') => setPopup({ open: true, message, type });
  const closePopup = () => setPopup(p => ({ ...p, open: false }));

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      showPopup('Please enter the complete 6-digit code');
      return;
    }

    if (isExpired) {
      showPopup('Code has expired. Please request a new code.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/verification/register/verify', {
        email,
        code: fullCode
      });

      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        showPopup('Account created successfully!', 'success');
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 1500);
      }
    } catch (error) {
      const errorData = error.response?.data?.error;
      if (errorData?.code === 'CODE_EXPIRED') {
        setIsExpired(true);
        showPopup('Verification code has expired. Please request a new code.');
      } else {
        showPopup(errorData?.message || 'Invalid verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/verification/register/resend-code', {
        email
      });

      if (response.data.success) {
        setTimeLeft(response.data.data.expiresIn);
        setIsExpired(false);
        setCode(['', '', '', '', '', '']);
        showPopup('New verification code sent to your email!', 'success');
      }
    } catch (error) {
      showPopup(error.response?.data?.error?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: '#e8f4f8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', px: 2, py: 5,
    }}>
      <Header />

      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 0.8, mt: '80px' }}>
        Verify Your Email
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3.5, textAlign: 'center' }}>
        We've sent a 6-digit verification code to your email
      </Typography>

      <Paper elevation={0} sx={{
        width: '100%', maxWidth: 480,
        borderRadius: '16px', p: { xs: 3, sm: 4 },
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      }}>
        {/* Email display */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          bgcolor: '#f8fafc', p: 2, borderRadius: '12px', mb: 3
        }}>
          <EmailOutlinedIcon sx={{ color: '#2563eb', fontSize: 24 }} />
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
              Verification code sent to
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
              {email}
            </Typography>
          </Box>
        </Box>

        {/* Timer */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
            label={isExpired ? 'Code Expired' : `Expires in ${formatTime(timeLeft)}`}
            color={isExpired ? 'error' : 'primary'}
            variant={isExpired ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Code inputs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 3 }}>
          {code.map((digit, index) => (
            <TextField
              key={index}
              inputRef={el => inputRefs.current[index] = el}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isExpired || loading}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  padding: '12px 0',
                  width: '48px'
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: isExpired ? '#f1f5f9' : '#fff',
                }
              }}
            />
          ))}
        </Box>

        {/* Expired message */}
        {isExpired && (
          <Box sx={{
            bgcolor: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '12px', p: 2, mb: 3, textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600 }}>
              Code is expired
            </Typography>
            <Typography variant="caption" sx={{ color: '#7f1d1d', display: 'block', mt: 0.5 }}>
              The verification code has expired. Please request a new one.
            </Typography>
          </Box>
        )}

        {/* Resend link */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Didn't receive the code?{' '}
            <Link
              component="button"
              onClick={handleResend}
              disabled={resendLoading}
              sx={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none',
                cursor: resendLoading ? 'not-allowed' : 'pointer',
                opacity: resendLoading ? 0.6 : 1,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {resendLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <RefreshIcon sx={{ fontSize: 16, animation: 'spin 1s linear infinite' }} />
                  Sending...
                </Box>
              ) : (
                'Resend Code'
              )}
            </Link>
          </Typography>
        </Box>

        {/* Submit button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || code.join('').length !== 6}
          sx={{
            bgcolor: '#2563eb',
            fontWeight: 700,
            borderRadius: '10px',
            py: 1.5,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 6px 20px rgba(37,99,235,0.45)' },
            '&:disabled': { bgcolor: '#94a3b8' }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Verifying...
            </Box>
          ) : (
            'Verify & Create Account'
          )}
        </Button>

        {/* Back link */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            component="button"
            onClick={() => navigate('/register')}
            sx={{
              color: '#64748b',
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            ← Back to Registration
          </Link>
        </Box>
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

      {/* Add keyframes for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}

export default VerifyCode;
