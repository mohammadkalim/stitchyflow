import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function GoogleAuthSuccess() {
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token  = params.get('token');
    const refreshToken = params.get('refreshToken');
    const userRaw = params.get('user');

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'customer') navigate('/customer-dashboard');
        else if (user.role === 'tailor' || user.role === 'business_owner') navigate('/tailor-dashboard');
        else navigate('/home');
      } catch (_) {
        navigate('/login?error=parse_failed');
      }
    } else {
      navigate('/login?error=google_failed');
    }
  }, [location, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress size={40} sx={{ color: '#2563eb' }} />
      <Typography variant="body1" sx={{ color: '#6b7280' }}>Signing you in with Google...</Typography>
    </Box>
  );
}
