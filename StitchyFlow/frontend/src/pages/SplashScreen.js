import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, keyframes } from '@mui/material';

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function SplashScreen() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #29B6F6, #4FC3F7, #00bfff, #29B6F6)',
        backgroundSize: '400% 400%',
        animation: `${gradientMove} 8s ease infinite`,
      }}
    >
      <Box
        sx={{
          animation: `${fadeIn} 1s ease-out, ${float} 3s ease-in-out infinite`,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '30px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '3px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography
            sx={{
              fontSize: 60,
              fontWeight: 700,
              color: '#fff',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          >
            S
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            animation: `${fadeIn} 1s ease-out 0.3s both`,
            letterSpacing: '4px',
          }}
        >
          StitchyFlow
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mt: 1,
            fontWeight: 400,
            animation: `${fadeIn} 1s ease-out 0.5s both`,
            letterSpacing: '2px',
          }}
        >
          Professional Tailoring Marketplace
        </Typography>

        <Box
          sx={{
            mt: 4,
            animation: `${fadeIn} 1s ease-out 0.7s both`,
          }}
        >
          <CircularProgress
            size={40}
            sx={{
              color: '#fff',
              '& .MuiCircularProgress-circle': {
                strokeWidth: 3,
              },
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 3,
            animation: `${fadeIn} 1s ease-out 0.9s both`,
          }}
        >
          Loading...
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 30,
          color: 'rgba(255, 255, 255, 0.5)',
          animation: `${fadeIn} 1s ease-out 1s both`,
        }}
      >
        Powered by LogixInventor (PVT) Ltd.
      </Typography>
    </Box>
  );
}

export default SplashScreen;
