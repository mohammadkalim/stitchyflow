/**
 * Lists tailors for one admin CA/SUB category (same rows as /ca-sub/category in admin).
 * Public data: GET /api/v1/ca-sub/categories/public + /business/public/all-tailors
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Chip, Container, Grid, Paper, Typography, CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { gex, resolvePublicBusinessImageUrl } from '../../utils/api';

export default function TailorServiceCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const idNum = Number(categoryId);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (!Number.isFinite(idNum) || idNum < 1) {
          if (mounted) {
            setError('Invalid category.');
            setTailors([]);
            setCategoryTitle('');
          }
          return;
        }

        const [catRes, tailorsRes] = await Promise.all([
          gex('/ca-sub/categories/public', { cache: 'no-store' }),
          gex(`/catalog/tailors-by-category/${encodeURIComponent(idNum)}`, { cache: 'no-store' }),
        ]);
        if (!mounted) return;

        const cats = catRes?.success && Array.isArray(catRes.data) ? catRes.data : [];
        const cat = cats.find((c) => Number(c.id) === idNum);
        if (!cat) {
          setError('Category not found or inactive.');
          setCategoryTitle('');
          setTailors([]);
          return;
        }

        setCategoryTitle(cat.name || 'Category');
        setCategoryDesc(cat.description || '');

        const tailorRows = tailorsRes?.success && Array.isArray(tailorsRes.data) ? tailorsRes.data : [];
        setTailors(tailorRows);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load category.');
        setTailors([]);
        setCategoryTitle('');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [categoryId, idNum]);

  const getShopAvailability = (tailor) => ({
    availableFrom: tailor.available_from || '10:00 AM',
    availableTo: tailor.available_to || '7:00 PM',
    notAvailable: tailor.not_available_note || 'Evenings, Sundays & outside listed hours',
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      <Box
        sx={{
          mt: '64px',
          background: 'linear-gradient(135deg, #081933 0%, #0b2142 40%, #102e5c 60%, #081933 100%)',
          backgroundSize: '200% 200%',
          animation: 'categoryHeroGradientShift 10s ease-in-out infinite',
          py: { xs: 12, md: 16 },
          '@keyframes categoryHeroGradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            textAlign: 'center',
            animation: 'categoryHeroContentFade 700ms ease-out',
            '@keyframes categoryHeroContentFade': {
              '0%': { opacity: 0, transform: 'translateY(14px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '1.9rem', md: '2.8rem' }, mb: 1.2 }}>
            {categoryTitle || 'Category'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 680, mx: 'auto', lineHeight: 1.7 }}>
            {categoryDesc || 'All businesses linked to this category are listed below.'}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#0d9488' }} />
          </Box>
        ) : error ? (
          <Paper elevation={0} sx={{ p: 3, borderRadius: '14px', border: '1px solid #fecaca', bgcolor: '#fff1f2', textAlign: 'center' }}>
            <Typography sx={{ color: '#9f1239', fontWeight: 700, mb: 1 }}>{error}</Typography>
            <Button variant="outlined" onClick={() => navigate('/home')} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Back to home
            </Button>
          </Paper>
        ) : tailors.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>No tailors in this category yet</Typography>
            <Typography sx={{ color: '#64748b', mb: 2.5 }}>
              In My Businesses, set this category or a subcategory under it. Shops whose business type name matches the category name are included too.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/tailor-shops')} sx={{ textTransform: 'none', fontWeight: 700, mr: 1 }}>
              Browse tailor shops
            </Button>
            <Button variant="outlined" onClick={() => navigate('/All-tailers')} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Browse all tailors
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Chip size="small" label={`${tailors.length} business${tailors.length === 1 ? '' : 'es'}`} sx={{ fontWeight: 700 }} />
            </Box>
            <Grid container spacing={2.5}>
              {tailors.map((tailor) => {
                const shopId = tailor.shop_id;
                const profileId = tailor.owner_user_id || tailor.user_id || shopId;
                const businessName = (tailor.shop_name || tailor.owner_name || 'Business').trim();
                const logoUrl = resolvePublicBusinessImageUrl(tailor.logo_image, tailor);
                const { availableFrom, availableTo, notAvailable } = getShopAvailability(tailor);

                return (
                  <Grid item xs={12} sm={6} md={4} key={`${shopId || 's'}-${profileId}`}>
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
                          boxShadow: '0 8px 24px rgba(19,16,202,0.12)',
                          transform: 'translateY(-2px)',
                          borderColor: '#c7d2fe',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative', height: 168, bgcolor: '#e8e7ff', overflow: 'hidden' }}>
                        {logoUrl ? (
                          <Box
                            component="img"
                            src={logoUrl}
                            alt={businessName}
                            sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(19, 16, 202, 0.14)' }}>
                            <Typography component="span" sx={{ fontSize: { xs: '3.25rem', sm: '3.75rem' }, fontWeight: 800, color: '#1310ca', lineHeight: 1, userSelect: 'none' }}>
                              {(businessName || '?').charAt(0).toUpperCase()}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75, minWidth: 0 }}>
                          <StorefrontIcon sx={{ fontSize: 18, color: '#1310ca', mt: 0.15, flexShrink: 0 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem', lineHeight: 1.35, minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                            {businessName}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                          {tailor.owner_name || 'Owner not specified'}
                        </Typography>
                        {tailor.city && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: tailor.specialization_name ? 0.75 : 0 }}>
                            <LocationOnIcon sx={{ fontSize: 15, color: '#94a3b8' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                              {tailor.city}{tailor.country ? `, ${tailor.country}` : ''}
                            </Typography>
                          </Box>
                        )}
                        {tailor.specialization_name && (
                          <Chip
                            label={tailor.specialization_name}
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
                                {availableFrom} - {availableTo}
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
                            fullWidth
                            variant="text"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: 18, color: '#1310ca' }} />}
                            onClick={() =>
                              shopId
                                ? window.open(`/tailor-shops/view/${shopId}`, '_blank', 'noopener,noreferrer')
                                : window.open(`/All-tailers/view/${profileId}`, '_blank', 'noopener,noreferrer')
                            }
                            sx={{
                              color: '#1310ca',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              textTransform: 'none',
                              py: 0.75,
                              justifyContent: 'center',
                              '&:hover': { bgcolor: 'rgba(19, 16, 202, 0.06)' },
                            }}
                          >
                            Visit Shop
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
