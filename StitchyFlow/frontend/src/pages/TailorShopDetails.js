/**
 * Public tailor shop detail — opens from Tailor Shops “Visit Shop” (new tab).
 * Data: GET /api/v1/business/public/shops/:shopId
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Grid, Paper, Chip, Button, Breadcrumbs, Link, CircularProgress, Divider, Stack, Alert,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { gex, resolvePublicBusinessImageUrl } from '../utils/api';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const SHOP_IMAGE_FALLBACK = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
];

/** Banner image: cover first (wide hero), then legacy shop image, API hero, then logo. */
function resolveHeroImage(shop) {
  const raw =
    (shop.cover_image && String(shop.cover_image).trim()) ||
    (shop.shop_image && String(shop.shop_image).trim()) ||
    (shop.hero_image && String(shop.hero_image).trim()) ||
    (shop.logo_image && String(shop.logo_image).trim());
  if (!raw) return SHOP_IMAGE_FALLBACK[(Number(shop.shop_id) || 0) % SHOP_IMAGE_FALLBACK.length];
  return resolvePublicBusinessImageUrl(raw, shop);
}

/** Use letterboxed logo style only when there is no dedicated cover/shop photo. */
function heroBannerIsLogoOnly(shop) {
  const hasCover = shop.cover_image && String(shop.cover_image).trim();
  const hasShop = shop.shop_image && String(shop.shop_image).trim();
  if (hasCover || hasShop) return false;
  return Boolean(
    (shop.hero_image && String(shop.hero_image).trim()) ||
    (shop.logo_image && String(shop.logo_image).trim())
  );
}

/** Wide banner photo from tailor upload — keep image bright; only fade bottom for text. */
function hasDedicatedCoverOrShopPhoto(shop) {
  return Boolean(
    (shop.cover_image && String(shop.cover_image).trim()) ||
    (shop.shop_image && String(shop.shop_image).trim())
  );
}

const BRAND = '#1310ca';
const PAGE_BG = '#f1f5f9';

function SectionTitle({ children, icon: Icon }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {Icon && <Icon sx={{ fontSize: 22, color: BRAND }} />}
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', color: '#64748b', textTransform: 'uppercase' }}>
        {children}
      </Typography>
    </Box>
  );
}

export default function TailorShopDetails() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    if (!shopId) return;
    setLoading(true);
    setError('');
    gex(`/business/public/shops/${encodeURIComponent(shopId)}`, { cache: 'no-store' })
      .then((d) => {
        if (d.success && d.data) setShop(d.data);
        else setError('Could not load this shop.');
      })
      .catch((e) => setError(e.message || 'Shop not found or unavailable.'))
      .finally(() => setLoading(false));
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const availableFrom = shop?.available_from || '10:00 AM';
  const availableTo = shop?.available_to || '7:00 PM';
  const notAvailable = shop?.not_available_note || 'Evenings, Sundays & outside listed hours';

  const bannerPhoto = shop ? hasDedicatedCoverOrShopPhoto(shop) : false;
  /* Taller cover band + lighter scrim so uploaded photos stay bright and sharp (“saaf”). */
  const heroH = { xs: bannerPhoto ? 288 : 220, md: bannerPhoto ? 400 : 300 };
  const heroMaxH = bannerPhoto ? 480 : 360;
  const heroOverlayBg = bannerPhoto
    ? 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0) 55%, rgba(15,23,42,0.04) 72%, rgba(15,23,42,0.14) 100%)'
    : 'linear-gradient(180deg, transparent 0%, transparent 48%, rgba(15,23,42,0.45) 100%)';
  const heroTitleShadow = bannerPhoto
    ? '0 1px 3px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.45)'
    : '0 1px 3px rgba(0,0,0,0.65)';
  const heroSubtitleShadow = bannerPhoto
    ? '0 1px 3px rgba(0,0,0,0.85), 0 1px 14px rgba(0,0,0,0.4)'
    : '0 1px 2px rgba(0,0,0,0.55)';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: PAGE_BG }}>
      <Header />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 16 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      )}

      {!loading && error && (
        <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>Unable to load shop</Typography>
            <Typography sx={{ color: '#64748b', mb: 3 }}>{error}</Typography>
            <Button component={RouterLink} to="/tailor-shops" variant="contained" sx={{ bgcolor: BRAND, textTransform: 'none', fontWeight: 700 }}>
              Back to Tailor Shops
            </Button>
          </Paper>
        </Container>
      )}

      {!loading && shop && (
        <>
          {shop.shop_status && shop.shop_status !== 'active' && (
            <Container maxWidth="lg" sx={{ pt: 2 }}>
              <Alert severity="warning" sx={{ borderRadius: '12px' }}>
                This shop is currently <strong>{shop.shop_status}</strong> on StitchyFlow. Contact details may still be useful for reference.
              </Alert>
            </Container>
          )}
          <Box
            sx={{
              position: 'relative',
              mt: '64px',
              minHeight: heroH,
              maxHeight: heroMaxH,
              overflow: 'hidden',
              bgcolor: '#e8e7ff',
            }}
          >
            <Box
              component="img"
              src={resolveHeroImage(shop)}
              alt=""
              decoding="async"
              fetchPriority="high"
              sx={{
                width: '100%',
                height: heroH,
                objectFit: heroBannerIsLogoOnly(shop) ? 'contain' : 'cover',
                objectPosition: bannerPhoto ? 'center center' : 'center',
                display: 'block',
                px: heroBannerIsLogoOnly(shop) ? { xs: 3, md: 5 } : 0,
                py: heroBannerIsLogoOnly(shop) ? 2 : 0,
                boxSizing: 'border-box',
              }}
              onError={(e) => { e.target.src = SHOP_IMAGE_FALLBACK[0]; }}
            />
            {/* Uploaded cover: minimal tint so photo stays vivid; logo/fallback: slightly stronger bottom fade. */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: heroOverlayBg,
              }}
            />
            <Container maxWidth="lg" sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, pb: 3, zIndex: 1 }}>
              <Breadcrumbs
                separator={<NavigateNextIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />}
                sx={{ mb: 1.5, '& .MuiBreadcrumbs-li': { fontSize: '0.8rem' } }}
              >
                <Link component={RouterLink} to="/tailor-shops" underline="hover" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  Tailor Shops
                </Link>
                <Typography sx={{ color: '#fff', fontWeight: 700, maxWidth: '100%', overflowWrap: 'anywhere' }}>View details</Typography>
              </Breadcrumbs>
              <Stack direction="row" alignItems="flex-start" gap={2} flexWrap="wrap">
                <StorefrontOutlinedIcon sx={{ fontSize: 40, color: '#fff', display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: '#fff',
                      lineHeight: 1.2,
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      textShadow: heroTitleShadow,
                    }}
                  >
                    {shop.shop_name}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.92)', mt: 0.75, fontSize: '1rem', textShadow: heroSubtitleShadow }}>
                    {shop.owner_name}
                    {shop.city ? ` · ${shop.city}` : ''}
                    {shop.country ? `, ${shop.country}` : ''}
                  </Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
                    {shop.business_type_name && (
                      <Chip label={shop.business_type_name} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }} />
                    )}
                    {shop.specialization_name && (
                      <Chip label={shop.specialization_name} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }} />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
                  <SectionTitle icon={LocationOnOutlinedIcon}>Location & address</SectionTitle>
                  <Typography sx={{ color: '#334155', lineHeight: 1.75, overflowWrap: 'anywhere' }}>
                    {[shop.address, shop.city, shop.country].filter(Boolean).join(', ') || 'Address on request — contact the business directly.'}
                  </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
                  <SectionTitle icon={ScheduleOutlinedIcon}>Hours & availability</SectionTitle>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                        Typically available
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: '#166534', fontSize: '1.05rem' }}>
                        {availableFrom} – {availableTo}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                        Not available
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <EventBusyOutlinedIcon sx={{ color: '#b91c1c', fontSize: 20, mt: 0.2 }} />
                        <Typography sx={{ color: '#991b1b', lineHeight: 1.5, overflowWrap: 'anywhere' }}>{notAvailable}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <SectionTitle icon={CategoryOutlinedIcon}>Business profile</SectionTitle>
                  <Stack spacing={1.25}>
                    {shop.business_type_name && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Business type</Typography>
                        <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{shop.business_type_name}</Typography>
                      </Box>
                    )}
                    {shop.specialization_name && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Specialization</Typography>
                        <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{shop.specialization_name}</Typography>
                      </Box>
                    )}
                    {shop.category_name && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Category</Typography>
                        <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{shop.category_name}</Typography>
                      </Box>
                    )}
                    {shop.subcategory_name && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Subcategory</Typography>
                        <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{shop.subcategory_name}</Typography>
                      </Box>
                    )}
                    {!shop.business_type_name && !shop.specialization_name && !shop.category_name && (
                      <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>Further categories will appear when the tailor completes their profile.</Typography>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid #c7d2fe',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                    position: { md: 'sticky' },
                    top: { md: 88 },
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 2, fontSize: '1.05rem' }}>Contact</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {shop.contact_number && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                      <PhoneOutlinedIcon sx={{ color: BRAND }} />
                      <Link href={`tel:${shop.contact_number}`} underline="hover" sx={{ color: '#0f172a', fontWeight: 700 }}>
                        {shop.contact_number}
                      </Link>
                    </Box>
                  )}
                  {shop.whatsapp_number && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                      <WhatsAppIcon sx={{ color: '#16a34a' }} />
                      <Link
                        href={`https://wa.me/${String(shop.whatsapp_number).replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: '#0f172a', fontWeight: 700 }}
                      >
                        WhatsApp
                      </Link>
                    </Box>
                  )}
                  {!shop.contact_number && !shop.whatsapp_number && (
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>No phone listed. Use StitchyFlow messaging after you place an order.</Typography>
                  )}
                  <Button
                    component={RouterLink}
                    to="/register"
                    fullWidth
                    variant="contained"
                    disableElevation
                    endIcon={<OpenInNewIcon sx={{ fontSize: 18, color: 'inherit' }} />}
                    sx={{
                      mt: 2,
                      py: 1.25,
                      bgcolor: '#bae6fd',
                      color: '#0d47a1',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 14px rgba(13, 71, 161, 0.18)',
                      '&:hover': { bgcolor: '#90caf9', color: '#0d47a1' },
                    }}
                  >
                    Get started on StitchyFlow
                  </Button>
                  <Button component={RouterLink} to="/tailor-shops" fullWidth sx={{ mt: 1.5, textTransform: 'none', fontWeight: 700, color: '#475569' }}>
                    Browse more shops
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </>
      )}

      <Footer />
    </Box>
  );
}
