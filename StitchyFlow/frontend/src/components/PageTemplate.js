import React from 'react';
import { Box, Typography, Container, Button, Grid, Paper, CircularProgress, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SliderBackground from './SliderBanner';

/**
 * Reusable professional page template
 * Props: heroTitle, heroSubtitle, heroBadge, icon, features[], ctaText, sliderPage, sliderTheme, showHeroButtons,
 *        useShopSection, shops, shopsLoading — when useShopSection is true, shows API shop cards instead of feature cards.
 */
const SHOP_IMAGE_FALLBACK = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
];

function resolveShopImageUrl(shop) {
  const raw = shop.shop_image || shop.cover_image || shop.logo_image;
  if (!raw) return SHOP_IMAGE_FALLBACK[(Number(shop.shop_id) || 0) % SHOP_IMAGE_FALLBACK.length];
  if (String(raw).startsWith('http')) return raw;
  const base = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace(/\/api\/v\d+\/?$/i, '')
    : `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000'}`;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return `${base}${path}`;
}

function getShopAvailability(shop) {
  const availableFrom = shop.available_from || '10:00 AM';
  const availableTo = shop.available_to || '7:00 PM';
  const notAvailable = shop.not_available_note || 'Evenings, Sundays & outside listed hours';
  return { availableFrom, availableTo, notAvailable };
}

function PageTemplate({
  heroTitle,
  heroHighlight,
  heroSubtitle,
  heroBadge,
  icon,
  features = [],
  ctaText = 'Get Started',
  ctaPath = '/register',
  extraSection,
  sliderPage,
  sliderTheme = {},
  showHeroButtons = true,
  useShopSection = false,
  shops = [],
  shopsLoading = false,
  shopSectionTitle = 'Tailor shops',
  shopSectionSubtitle = 'Browse verified tailoring businesses on StitchyFlow',
  shopVisitPath = '/marketplace/custom-dresses',
}) {
  const navigate = useNavigate();

  const heroGradient = sliderTheme.heroGradient || 'linear-gradient(135deg, #1a3a8f 0%, #1e4db7 40%, #1565c0 65%, #0d7a6e 100%)';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      <SliderBackground
        page={sliderPage}
        theme={sliderTheme}
        fallbackSx={{
          mt: '64px',
          background: heroGradient,
          py: { xs: 8, md: 11 },
        }}
      >
        {(resolvedTheme) => (
          <>
            <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2, py: { xs: 8, md: 11 } }}>
              {heroBadge && (
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  bgcolor: resolvedTheme.heroBadgeBg, borderRadius: '20px',
                  px: 2, py: 0.6, mb: 3,
                }}>
                  {icon}
                  <Typography variant="caption" sx={{ color: resolvedTheme.heroBadgeTextColor, fontWeight: 600, letterSpacing: '0.05em' }}>
                    {heroBadge}
                  </Typography>
                </Box>
              )}
              <Typography variant="h2" sx={{ fontWeight: 800, color: resolvedTheme.heroTextColor, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2, mb: 1.5 }}>
                {heroTitle}{' '}
                {heroHighlight && (
                  <Box
                    component="span"
                    sx={{ color: resolvedTheme.heroTitleHighlightColor || resolvedTheme.heroAccentColor }}
                  >
                    {heroHighlight}
                  </Box>
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: resolvedTheme.heroMutedTextColor,
                  maxWidth: 520,
                  mx: 'auto',
                  lineHeight: 1.8,
                  mb: showHeroButtons ? 4 : 0,
                  fontSize: '1.05rem',
                }}
              >
                {heroSubtitle}
              </Typography>
              {showHeroButtons && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(ctaPath)}
                    sx={{
                      bgcolor: resolvedTheme.heroAccentColor,
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: '10px',
                      px: 4,
                      py: 1.5,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      boxShadow: resolvedTheme.heroCtaBoxShadow || '0 4px 14px rgba(245,158,11,0.4)',
                      '&:hover': { bgcolor: resolvedTheme.heroAccentHoverColor || '#d97706' },
                    }}
                  >
                    {ctaText}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/home')}
                    sx={{
                      borderColor: resolvedTheme.heroSecondaryButtonBorder,
                      color: resolvedTheme.heroTextColor,
                      fontWeight: 600,
                      borderRadius: '10px',
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      bgcolor: resolvedTheme.heroSecondaryButtonBg,
                      '&:hover': {
                        bgcolor: resolvedTheme.heroSecondaryButtonHoverBg,
                        borderColor: resolvedTheme.heroTextColor,
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              )}
            </Container>
          </>
        )}
      </SliderBackground>

      {useShopSection && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', color: '#1a1a2e', mb: 1 }}>
            {shopSectionTitle}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280', mb: 6, maxWidth: 560, mx: 'auto' }}>
            {shopSectionSubtitle}
          </Typography>
          {shopsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#1310ca' }} />
            </Box>
          ) : shops.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280' }}>
              No tailor shops listed yet. Check back soon.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {shops.map((shop) => {
                const { availableFrom, availableTo, notAvailable } = getShopAvailability(shop);
                return (
                <Grid item xs={12} sm={6} md={4} key={shop.shop_id}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      bgcolor: '#fff',
                      height: '100%',
                      overflow: 'hidden',
                      transition: 'all 0.25s',
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(19,16,202,0.12)',
                        transform: 'translateY(-4px)',
                        borderColor: '#c7d2fe',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 168, bgcolor: '#e8e7ff' }}>
                      <Box
                        component="img"
                        src={resolveShopImageUrl(shop)}
                        alt={shop.shop_name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = SHOP_IMAGE_FALLBACK[0];
                        }}
                      />
                      {shop.business_type_name && (
                        <Chip
                          label={shop.business_type_name}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            bgcolor: 'rgba(19,16,202,0.88)',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
                        <StorefrontIcon sx={{ fontSize: 18, color: '#1310ca', mt: 0.15 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem', lineHeight: 1.35 }}>
                          {shop.shop_name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                        {shop.owner_name}
                      </Typography>
                      {shop.city && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: shop.specialization_name ? 0.75 : 0 }}>
                          <LocationOnIcon sx={{ fontSize: 15, color: '#94a3b8' }} />
                          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                            {shop.city}
                          </Typography>
                        </Box>
                      )}
                      {shop.specialization_name && (
                        <Chip
                          label={shop.specialization_name}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#e5e7eb', color: '#475569', fontSize: '0.7rem', height: 22 }}
                        />
                      )}

                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: '#15803d', mt: 0.1, flexShrink: 0 }} />
                          <Box>
                            <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 600, letterSpacing: '0.02em' }}>
                              Available
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#166534', fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.35 }}>
                              {availableFrom} – {availableTo}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 1.5 }}>
                          <EventBusyIcon sx={{ fontSize: 16, color: '#b91c1c', mt: 0.1, flexShrink: 0 }} />
                          <Box>
                            <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 600, letterSpacing: '0.02em' }}>
                              Not available
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#991b1b', fontSize: '0.8rem', lineHeight: 1.4 }}>
                              {notAvailable}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          type="button"
                          variant="text"
                          fullWidth
                          onClick={() => navigate(shopVisitPath)}
                          sx={{
                            color: '#1310ca',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            textTransform: 'none',
                            py: 0.75,
                            justifyContent: 'center',
                            '&:hover': { bgcolor: 'rgba(19, 16, 202, 0.06)' },
                          }}
                          endIcon={<ArrowForwardIcon sx={{ fontSize: 18, color: '#1310ca' }} />}
                        >
                          Visit Shop
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ); })}
            </Grid>
          )}
        </Container>
      )}

      {!useShopSection && features.length > 0 && (
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