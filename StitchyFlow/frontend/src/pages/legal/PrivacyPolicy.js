/**
 * Privacy Policy Page - Dynamic content from database
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import { gex } from '../../utils/api';

function PrivacyPolicy() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await gex('/privacy-pages/privacy');
        if (response.success && response.data) {
          setPageData(response.data);
        } else {
          setError('Failed to load privacy policy');
        }
      } catch (err) {
        console.error('Error fetching privacy policy:', err);
        setError('Failed to load privacy policy. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#29B6F6' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!pageData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Privacy policy not found.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: { xs: 2, md: 3 },
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a2e',
              mb: 3,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            {pageData.title}
          </Typography>
          
          <Box
            sx={{
              color: '#374151',
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1rem' },
              '& h2': {
                color: '#1565C0',
                fontWeight: 600,
                mt: { xs: 2, md: 3 },
                mb: { xs: 1, md: 1.5 },
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              },
              '& h3': {
                color: '#1976D2',
                fontWeight: 600,
                mt: { xs: 1.5, md: 2 },
                mb: { xs: 0.75, md: 1 },
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              },
              '& p': {
                mb: { xs: 1.5, md: 2 },
              },
              '& ul, & ol': {
                pl: { xs: 2, md: 3 },
                mb: { xs: 1.5, md: 2 },
              },
              '& li': {
                mb: { xs: 0.5, md: 0.75 },
              },
              '& a': {
                color: '#1565C0',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                my: 2,
              },
            }}
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default PrivacyPolicy;
