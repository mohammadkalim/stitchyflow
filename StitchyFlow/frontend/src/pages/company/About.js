/**
 * About Page - Dynamic content from database
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import { gex } from '../../utils/api';

function About() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await gex('/privacy-pages/about');
        if (response.success && response.data) {
          setPageData(response.data);
        } else {
          setError('Failed to load about page');
        }
      } catch (err) {
        console.error('Error fetching about page:', err);
        setError('Failed to load about page. Please try again later.');
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
        <Alert severity="info">About page not found.</Alert>
      </Container>
    );
  }

  const lastUpdated = pageData.updatedAt
    ? new Date(pageData.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 4, md: 7 },
        background:
          'linear-gradient(180deg, #f4f8ff 0%, #eef3ff 24%, #f8f9fc 48%, #ffffff 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            px: { xs: 2.5, md: 4 },
            py: { xs: 3, md: 4 },
            borderRadius: { xs: 2.5, md: 3 },
            background: 'linear-gradient(135deg, #0f2a54 0%, #17498d 55%, #2a79d4 100%)',
            color: '#fff',
            boxShadow: '0 20px 36px rgba(14, 42, 84, 0.22)',
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 1.3,
              opacity: 0.85,
            }}
          >
            CORPORATE PROFILE
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mt: 0.5,
              mb: 1.5,
              fontSize: { xs: '1.9rem', md: '2.8rem' },
              lineHeight: 1.2,
            }}
          >
            {pageData.title || 'About Us'}
          </Typography>
          <Typography
            sx={{
              maxWidth: 820,
              fontSize: { xs: '0.96rem', md: '1.05rem' },
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Learn more about our mission, values, and commitment to delivering reliable digital
            solutions with modern standards in quality, innovation, and trust.
          </Typography>
          {lastUpdated && (
            <Typography
              sx={{
                mt: 2,
                fontSize: { xs: '0.75rem', md: '0.82rem' },
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Box>

        <Paper
          sx={{
            p: { xs: 2.5, md: 5 },
            borderRadius: { xs: 2.5, md: 3 },
            boxShadow: '0 16px 34px rgba(12, 24, 46, 0.08)',
            border: '1px solid rgba(26, 76, 145, 0.08)',
            backgroundColor: '#fff',
          }}
        >
          <Box
            sx={{
              color: '#23324a',
              lineHeight: 1.86,
              fontSize: { xs: '0.95rem', md: '1.02rem' },
              '& > :first-of-type': {
                mt: 0,
              },
              '& h2': {
                color: '#143f79',
                fontWeight: 700,
                mt: { xs: 3, md: 4 },
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '1.35rem', md: '1.75rem' },
                lineHeight: 1.35,
              },
              '& h3': {
                color: '#19529b',
                fontWeight: 600,
                mt: { xs: 2.5, md: 3 },
                mb: { xs: 1, md: 1.2 },
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              },
              '& p': {
                color: '#3d4d65',
                mb: { xs: 1.7, md: 2.1 },
              },
              '& ul, & ol': {
                pl: { xs: 2, md: 3 },
                mb: { xs: 1.7, md: 2.1 },
              },
              '& li': {
                color: '#3d4d65',
                mb: { xs: 0.7, md: 0.85 },
              },
              '& a': {
                color: '#1d61b8',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& blockquote': {
                m: 0,
                my: { xs: 2, md: 3 },
                px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
                borderLeft: '4px solid #1f6ecc',
                backgroundColor: '#f5f9ff',
                color: '#27466f',
                borderRadius: 1,
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1.5,
                my: 2,
              },
              '& hr': {
                border: 0,
                borderTop: '1px solid rgba(26, 76, 145, 0.16)',
                my: { xs: 2.5, md: 3.5 },
              },
            }}
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default About;
