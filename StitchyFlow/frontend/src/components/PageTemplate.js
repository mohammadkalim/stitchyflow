import React from 'react';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SliderBackground from './SliderBanner';

/**
 * Reusable professional page template
 * Props: heroTitle, heroSubtitle, heroBadge, heroGradient, icon, features[], ctaText, sliderPage
 */
function PageTemplate({ heroTitle, heroHighlight, heroSubtitle, heroBadge, icon, features = [], ctaText = 'Get Started', ctaPath = '/register', extraSection, sliderPage }) {
  const navigate = useNavigate();

  const heroGradient = 'linear-gradient(135deg, #1a3a8f 0%, #1e4db7 40%, #1565c0 65%, #0d7a6e 100%)';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      {/* Hero Banner — slider images set as background if available */}
      <SliderBackground
        page={sliderPage}
        fallbackSx={{
          mt: '64px',
          background: heroGradient,
          py: { xs: 8, md: 11 },
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', pointerEvents: 'none', zIndex: 1 }} />

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2, py: { xs: 8, md: 11 } }}>
          {heroBadge && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: 'rgba(255,255,255,0.12)', borderRadius: '20px',
              px: 2, py: 0.6, mb: 3,
            }}>
              {icon}
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.05em' }}>
                {heroBadge}
              </Typography>
            </Box>
          )}
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2, mb: 1.5 }}>
            {heroTitle}{' '}
            {heroHighlight && <Box component="span" sx={{ color: '#f59e0b' }}>{heroHighlight}</Box>}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 520, mx: 'auto', lineHeight: 1.8, mb: 4, fontSize: '1.05rem' }}>
            {heroSubtitle}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate(ctaPath)}
              sx={{ bgcolor: '#f59e0b', color: '#fff', fontWeight: 700, borderRadius: '10px', px: 4, py: 1.5, fontSize: '0.95rem', textTransform: 'none', boxShadow: '0 4px 14px rgba(245,158,11,0.4)', '&:hover': { bgcolor: '#d97706' } }}>
              {ctaText}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/home')}
              sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', fontWeight: 600, borderRadius: '10px', px: 4, py: 1.5, textTransform: 'none', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', borderColor: '#fff' } }}>
              Learn More
            </Button>
          </Box>
        </Container>
      </SliderBackground>

      {/* Features Grid */}
      {features.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', color: '#1a1a2e', mb: 1 }}>
            What We Offer
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280', mb: 6, maxWidth: 480, mx: 'auto' }}>
            Everything you need, all in one place
          </Typography>
          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper elevation={0} sx={{
                  p: 3.5, borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  bgcolor: '#fff',
                  height: '100%',
                  transition: 'all 0.25s',
                  '&:hover': { boxShadow: '0 8px 32px rgba(37,99,235,0.1)', transform: 'translateY(-4px)', borderColor: '#bfdbfe' },
                }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '12px',
                    bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 2, fontSize: '1.5rem',
                  }}>
                    {f.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1, fontSize: '1rem' }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.7 }}>
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Bottom CTA */}
      <Box sx={{
        py: 7,
        background: 'linear-gradient(135deg, #1a3a8f 0%, #1e4db7 50%, #0d7a6e 100%)',
        textAlign: 'center',
      }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1.5 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4 }}>
            Join thousands of satisfied customers on StitchyFlow today.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/register')}
            sx={{
              bgcolor: '#fff', color: '#1e4db7', fontWeight: 700,
              borderRadius: '10px', px: 5, py: 1.5, fontSize: '0.95rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}>
            Create Free Account
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default PageTemplate;
