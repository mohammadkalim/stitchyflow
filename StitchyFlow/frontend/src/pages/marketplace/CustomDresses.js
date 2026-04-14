import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, Container, Grid, Paper, Typography, CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { gex } from '../../utils/api';

function CustomDresses() {
  const sliderColor = '#4e0674';
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    gex('/business/public/all-tailors', { cache: 'no-store' })
      .then((d) => {
        if (!mounted) return;
        const list = d.success && Array.isArray(d.data) ? d.data : [];
        setTailors(list);
      })
      .catch(() => {
        if (mounted) setTailors([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getName = (t) => {
    const full = `${(t.first_name || '').trim()} ${(t.last_name || '').trim()}`.trim();
    return full || (t.owner_name || '').trim() || (t.shop_name || '').trim() || 'Tailor';
  };
  const getInitial = (t) => getName(t).charAt(0).toUpperCase() || 'T';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      <Box
        sx={{
          mt: '64px',
          background: 'linear-gradient(135deg, #4e0674 0%, #4e0674 100%)',
          py: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '20px', px: 2, py: 0.6, mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, letterSpacing: '0.05em' }}>
              Marketplace · All Tailors
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, mb: 1.5 }}>
            All <Box component="span" sx={{ color: '#fcd34d' }}>Tailors</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.86)', maxWidth: 620, mx: 'auto', lineHeight: 1.8 }}>
            Browse all active tailor profiles on StitchyFlow. Choose the right tailor for your stitching needs.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', color: '#1a1a2e', mb: 1 }}>
          All Tailor Profiles
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280', mb: 6 }}>
          Showing active tailor users on StitchyFlow.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#450002' }} />
          </Box>
        ) : tailors.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280' }}>
            No tailor profiles found yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {tailors.map((tailor) => {
              const profileId = tailor.owner_user_id || tailor.user_id || tailor.shop_id;
              return (
              <Grid item xs={12} sm={6} md={4} key={`${tailor.shop_id || tailor.user_id}`}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    bgcolor: '#fff',
                    p: 3,
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(78, 6, 116, 0.16)', transform: 'translateY(-3px)' },
                  }}
                >
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(78, 6, 116, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: sliderColor, fontSize: '1.3rem' }}>
                      {getInitial(tailor)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.6 }}>
                    {getName(tailor)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1.25 }}>
                    Tailor ID: #{profileId || '-'}
                  </Typography>
                  <Chip
                    icon={<PersonOutlineIcon sx={{ color: '#166534 !important' }} />}
                    label={(tailor.status || 'active').toUpperCase()}
                    size="small"
                    sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700, mb: 2 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => window.open(`/All-tailers/view/${profileId}`, '_blank', 'noopener,noreferrer')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      letterSpacing: '0.01em',
                      borderRadius: '10px',
                      py: 1.2,
                      bgcolor: sliderColor,
                      color: '#ffffff',
                      boxShadow: '0 6px 16px rgba(78, 6, 116, 0.35)',
                      '& .MuiButton-endIcon': { color: '#ffffff' },
                      '&:hover': {
                        bgcolor: '#5d1a7f',
                        color: '#ffffff',
                        boxShadow: '0 8px 18px rgba(78, 6, 116, 0.45)',
                      },
                    }}
                  >
                    View Tailor
                  </Button>
                </Paper>
              </Grid>
            );})}
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
export default CustomDresses;
