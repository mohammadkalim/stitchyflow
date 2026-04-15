import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Chip, Container, Grid, Paper, Typography, CircularProgress, Divider,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { gex } from '../../utils/api';
import { norm, groupShopsByBusinessCategory } from './tailorBrowseGrouping';

function parseServiceTags(service) {
  const raw = service?.tags;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((t) => norm(t)).filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((t) => norm(t)).filter(Boolean);
    } catch {
      /* ignore */
    }
  }
  return [];
}

function wordTokens(s) {
  return norm(s)
    .split(/[^a-z0-9]+/g)
    .filter((w) => w.length >= 3);
}

/** Relate a public shop row to the selected admin service (name, category, tags, keywords). */
function matchesServiceType(tailor, service) {
  const needles = new Set([
    norm(service?.service_name),
    norm(service?.category),
    ...parseServiceTags(service),
    ...wordTokens(service?.service_name || ''),
    ...wordTokens(service?.category || ''),
  ]);
  needles.delete('');

  if (!needles.size) return false;

  const tailorFields = [
    tailor?.business_type_name,
    tailor?.specialization_name,
    tailor?.category_name,
    tailor?.subcategory_name,
    tailor?.shop_name,
    tailor?.owner_name,
  ].map(norm).filter(Boolean);

  return [...needles].some((needle) =>
    needle.length >= 2 &&
    tailorFields.some((field) => field.includes(needle) || needle.includes(field))
  );
}

export default function TailorServiceTypePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [serviceRes, tailorsRes] = await Promise.all([
          gex(`/tailor-services/${encodeURIComponent(serviceId)}`, { cache: 'no-store' }),
          gex('/business/public/all-tailors', { cache: 'no-store' }),
        ]);
        if (!mounted) return;

        const serviceRow = serviceRes?.success ? serviceRes.data : null;
        const tailorRows = tailorsRes?.success && Array.isArray(tailorsRes.data) ? tailorsRes.data : [];
        if (!serviceRow) {
          setError('Service type not found.');
          setService(null);
          setTailors([]);
          return;
        }

        setService(serviceRow);
        setTailors(tailorRows.filter((row) => matchesServiceType(row, serviceRow)));
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load service type.');
        setService(null);
        setTailors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [serviceId]);

  const title = useMemo(() => (service?.service_name || 'Tailor Service'), [service]);

  const grouped = useMemo(() => groupShopsByBusinessCategory(tailors), [tailors]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      <Box sx={{ mt: '64px', background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', py: { xs: 8, md: 11 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '1.9rem', md: '2.8rem' }, mb: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.88)', maxWidth: 680, mx: 'auto', lineHeight: 1.7 }}>
            Businesses are grouped by business category, then listed under each category.
          </Typography>
          {service?.category && (
            <Chip
              label={`Type: ${service.category}`}
              sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.16)', color: '#fff', fontWeight: 700 }}
            />
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#1d4ed8' }} />
          </Box>
        ) : error ? (
          <Paper elevation={0} sx={{ p: 3, borderRadius: '14px', border: '1px solid #fecaca', bgcolor: '#fff1f2', textAlign: 'center' }}>
            <Typography sx={{ color: '#9f1239', fontWeight: 700, mb: 1 }}>{error}</Typography>
            <Button variant="outlined" onClick={() => navigate('/All-tailers')} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Back to Tailors
            </Button>
          </Paper>
        ) : tailors.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>No businesses found for this service</Typography>
            <Typography sx={{ color: '#64748b', mb: 2.5 }}>
              No tailor shop profile matches this admin service yet. Try another service or browse all shops.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/tailor-shops')} sx={{ textTransform: 'none', fontWeight: 700, mr: 1 }}>
              Browse tailor shops
            </Button>
            <Button variant="outlined" onClick={() => navigate('/All-tailers')} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Browse all tailors
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {grouped.map(([categoryLabel, shops]) => (
              <Paper key={categoryLabel}
                elevation={0}
                sx={{
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                }}
              >
                <Box sx={{ px: { xs: 2, md: 3 }, py: 2, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase', mb: 0.35 }}>
                    Business category
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StorefrontOutlinedIcon sx={{ fontSize: 22, color: '#2563eb' }} />
                    {categoryLabel}
                    <Chip size="small" label={`${shops.length} business${shops.length === 1 ? '' : 'es'}`} sx={{ ml: 0.5, fontWeight: 700 }} />
                  </Typography>
                </Box>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Grid container spacing={2.5}>
                    {shops.map((tailor) => {
                      const shopId = tailor.shop_id;
                      const profileId = tailor.owner_user_id || tailor.user_id || shopId;
                      const businessName = (tailor.shop_name || tailor.owner_name || 'Business').trim();
                      return (
                        <Grid item xs={12} sm={6} md={4} key={`${shopId || 's'}-${profileId}`}>
                          <Paper
                            elevation={0}
                            sx={{
                              borderRadius: '14px',
                              border: '1px solid #e5e7eb',
                              bgcolor: '#fafafa',
                              p: 2.5,
                              height: '100%',
                              transition: 'all 0.2s',
                              '&:hover': { boxShadow: '0 8px 24px rgba(37,99,235,0.12)', borderColor: '#bfdbfe', bgcolor: '#fff' },
                            }}
                          >
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>
                              Business
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.75, lineHeight: 1.3 }}>
                              {businessName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 1.25 }}>
                              {tailor.owner_name && tailor.shop_name && norm(tailor.owner_name) !== norm(tailor.shop_name)
                                ? `${tailor.owner_name} · `
                                : ''}
                              {tailor.city
                                ? `${tailor.city}${tailor.country ? `, ${tailor.country}` : ''}`
                                : 'Location not specified'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                              {tailor.specialization_name && (
                                <Chip size="small" variant="outlined" label={tailor.specialization_name} />
                              )}
                            </Box>
                            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                            <Button
                              fullWidth
                              variant="contained"
                              endIcon={<ArrowForwardIcon />}
                              onClick={() =>
                                shopId
                                  ? window.open(`/tailor-shops/view/${shopId}`, '_blank', 'noopener,noreferrer')
                                  : window.open(`/All-tailers/view/${profileId}`, '_blank', 'noopener,noreferrer')
                              }
                              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}
                            >
                              View business
                            </Button>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
