import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Alert, Box, Breadcrumbs, Button, Chip, CircularProgress, Container, Divider, Grid, Link, Paper, Stack, Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { gex } from '../utils/api';

const BRAND = '#4e0674';

function getName(tailor) {
  const full = `${(tailor?.first_name || '').trim()} ${(tailor?.last_name || '').trim()}`.trim();
  return full || (tailor?.owner_name || '').trim() || (tailor?.shop_name || '').trim() || 'Tailor';
}

function getTailorLocationLabel(tailor) {
  const parts = [tailor?.address, tailor?.city, tailor?.country]
    .map((v) => (v == null ? '' : String(v).trim()))
    .filter(Boolean);
  return parts.join(', ');
}

export default function TailorProfileDetails() {
  const { tailorId } = useParams();
  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('tailor');

  const load = useCallback(() => {
    if (!tailorId) return;
    setLoading(true);
    setError('');
    gex(`/users/public/tailors/${encodeURIComponent(tailorId)}`, { cache: 'no-store' })
      .then((d) => {
        const found = d.success && d.data ? d.data : null;
        if (found) setTailor(found);
        else throw new Error('Tailor not found.');
      })
      .catch(() => (
        gex(`/business/public/shops/${encodeURIComponent(tailorId)}`, { cache: 'no-store' })
          .then((d) => {
            const shop = d.success && d.data ? d.data : null;
            if (!shop) {
              setError('Tailor not found.');
              return;
            }
            setTailor({
              user_id: shop.owner_user_id || shop.shop_id,
              first_name: '',
              last_name: '',
              owner_name: shop.owner_name || '',
              shop_name: shop.shop_name || '',
              email: '',
              phone: shop.contact_number || shop.whatsapp_number || '',
              role: 'tailor',
              status: shop.shop_status || 'active',
              created_at: shop.updated_at || null,
              city: shop.city || '',
              country: shop.country || '',
              address: shop.address || '',
              contact_number: shop.contact_number || '',
              whatsapp_number: shop.whatsapp_number || '',
            });
            setError('');
          })
          .catch((e) => setError(e.message || 'Tailor not found.'))
      ))
      .finally(() => setLoading(false));
  }, [tailorId]);

  useEffect(() => {
    load();
  }, [load]);

  const locationLabel = getTailorLocationLabel(tailor);
  const mapsQuery = locationLabel || getName(tailor);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 16 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      )}

      {!loading && error && (
        <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>Unable to load tailor profile</Typography>
            <Typography sx={{ color: '#64748b', mb: 3 }}>{error}</Typography>
            <Button component={RouterLink} to="/All-tailers" variant="contained" sx={{ bgcolor: BRAND, textTransform: 'none', fontWeight: 700 }}>
              Back to All Tailors
            </Button>
          </Paper>
        </Container>
      )}

      {!loading && tailor && (
        <>
          {tailor.status && String(tailor.status).toLowerCase() !== 'active' && (
            <Container maxWidth="lg" sx={{ pt: 2 }}>
              <Alert severity="warning" sx={{ borderRadius: '12px' }}>
                This tailor profile is currently marked as <strong>{tailor.status}</strong>.
              </Alert>
            </Container>
          )}

          <Box
            sx={{
              mt: '64px',
              py: { xs: 8, md: 10 },
              background: 'linear-gradient(135deg, #4e0674 0%, #5d1a7f 100%)',
            }}
          >
            <Container maxWidth="lg">
              <Breadcrumbs
                separator={<NavigateNextIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />}
                sx={{ mb: 2.5, '& .MuiBreadcrumbs-li': { fontSize: '0.82rem' } }}
              >
                <Link component={RouterLink} to="/All-tailers" underline="hover" sx={{ color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>
                  All Tailors
                </Link>
                <Typography sx={{ color: '#fff', fontWeight: 700 }}>Profile</Typography>
              </Breadcrumbs>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: '#fff',
                    fontWeight: 800,
                  }}
                >
                  {getName(tailor).charAt(0).toUpperCase()}
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '2rem', md: '2.6rem' } }}>
                    {getName(tailor)}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.4 }}>
                    Tailor ID: #{tailor.user_id}
                  </Typography>
                  <Chip
                    icon={<PersonOutlineIcon sx={{ color: '#166534 !important' }} />}
                    label={(tailor.status || 'active').toUpperCase()}
                    size="small"
                    sx={{ mt: 1.25, bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }}
                  />
                </Box>
              </Stack>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                bgcolor: '#fff',
                mb: 3,
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <Chip
                  icon={<PersonOutlineIcon />}
                  label="Tailor Information"
                  clickable
                  onClick={() => setActiveSection('tailor')}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#fff',
                    color: '#111827',
                    border: activeSection === 'tailor' ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                  }}
                />
                <Chip
                  icon={<MapOutlinedIcon />}
                  label="Maps & Location"
                  clickable
                  onClick={() => setActiveSection('maps')}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#fff',
                    color: '#111827',
                    border: activeSection === 'maps' ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                  }}
                />
                <Chip
                  icon={<BadgeOutlinedIcon />}
                  label="Personal Information"
                  clickable
                  onClick={() => setActiveSection('personal')}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#fff',
                    color: '#111827',
                    border: activeSection === 'personal' ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                  }}
                />
              </Stack>
            </Paper>

            {activeSection === 'tailor' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', mb: 2 }}>
                    Tailor Information
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                      <Typography sx={{ color: '#64748b', fontWeight: 600 }}>First Name</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{tailor.first_name || '-'}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                      <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Last Name</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{tailor.last_name || '-'}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                      <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Role</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 700, textTransform: 'capitalize' }}>{tailor.role || 'tailor'}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                      <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Joined</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>
                        {tailor.created_at ? new Date(tailor.created_at).toLocaleDateString() : '-'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                </Grid>
              </Grid>
            )}

            {activeSection === 'maps' && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>Maps & Location</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOnOutlinedIcon sx={{ color: '#0f172a' }} />
                    <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>
                      {locationLabel || 'Location not provided'}
                    </Typography>
                  </Box>
                  <Button
                    component="a"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 700, borderColor: BRAND, color: BRAND }}
                  >
                    Open in Google Maps
                  </Button>
                </Paper>
                </Grid>
              </Grid>
            )}

            {activeSection === 'personal' && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>Personal Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1.25}>
                    <Typography sx={{ color: '#334155', fontWeight: 600 }}>
                      Full Name: <strong>{getName(tailor)}</strong>
                    </Typography>
                    <Typography sx={{ color: '#334155', fontWeight: 600 }}>
                      User ID: <strong>#{tailor.user_id}</strong>
                    </Typography>
                    <Typography sx={{ color: '#334155', fontWeight: 600, textTransform: 'capitalize' }}>
                      Role: <strong>{tailor.role || 'tailor'}</strong>
                    </Typography>
                    <Typography sx={{ color: '#334155', fontWeight: 600, textTransform: 'capitalize' }}>
                      Status: <strong>{tailor.status || 'active'}</strong>
                    </Typography>
                    <Divider sx={{ my: 0.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <EmailOutlinedIcon sx={{ color: '#000' }} />
                      <Typography sx={{ color: '#000', fontWeight: 600, overflowWrap: 'anywhere' }}>
                        {tailor.email || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <PhoneOutlinedIcon sx={{ color: '#000' }} />
                      <Typography sx={{ color: '#000', fontWeight: 600 }}>
                        {tailor.phone || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <EventNoteOutlinedIcon sx={{ color: '#000' }} />
                      <Typography sx={{ color: '#000', fontWeight: 600, textTransform: 'capitalize' }}>
                        Status: {tailor.status || 'active'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    component={RouterLink}
                    to="/All-tailers"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: BRAND,
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '10px',
                      '&:hover': { bgcolor: '#5d1a7f' },
                    }}
                  >
                    Back to All Tailors
                  </Button>
                </Paper>
                </Grid>
              </Grid>
            )}
          </Container>
        </>
      )}

      <Footer />
    </Box>
  );
}
