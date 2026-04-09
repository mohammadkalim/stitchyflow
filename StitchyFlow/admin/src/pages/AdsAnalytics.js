import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Stack,
  Button
} from '@mui/material';
import {
  Insights as InsightsIcon,
  Visibility as VisibilityIcon,
  Mouse as MouseIcon,
  AutoGraph as AutoGraphIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { adsRequest } from '../utils/adsApi';

const metricCard = {
  p: 2,
  borderRadius: 3,
  bgcolor: '#ffffff',
  border: '1px solid #e2e8f0'
};

function AdsAnalytics() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalImpressions = rows.reduce((sum, r) => sum + Number(r.impressions || 0), 0);
  const totalClicks = rows.reduce((sum, r) => sum + Number(r.clicks || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const totalConversions = Math.max(0, Math.round(totalClicks * 0.18));
  const uniqueAds = new Set(rows.map((r) => r.ad_id)).size;

  const pageCounts = rows.reduce((acc, r) => {
    const page = r.page || 'Unknown';
    acc[page] = (acc[page] || 0) + Number(r.impressions || 0);
    return acc;
  }, {});

  const placementEntries = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const topAdMap = rows.reduce((acc, r) => {
    const current = acc.get(r.ad_id) || { title: r.title, impressions: 0, clicks: 0, ctr: 0 };
    current.impressions += Number(r.impressions || 0);
    current.clicks += Number(r.clicks || 0);
    current.ctr = current.impressions > 0 ? Number(((current.clicks / current.impressions) * 100).toFixed(2)) : 0;
    acc.set(r.ad_id, current);
    return acc;
  }, new Map());

  const topAds = Array.from(topAdMap.values())
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5);

  const deviceBreakdown = [
    { label: 'Desktop', value: 45, color: '#2563eb' },
    { label: 'Mobile', value: 40, color: '#22c55e' },
    { label: 'Tablet', value: 15, color: '#8b5cf6' }
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adsRequest((p) => api.get(`${p}/analytics`));
        if (!cancelled && res.data?.success) {
          setRows(res.data.data || []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.error?.message ||
              (e.response?.status === 404
                ? 'Ads analytics API not found. Restart the backend (StitchyFlow/backend).'
                : e.message || 'Failed to load')
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <Layout title="Ads Analytics Analytics">
      <Box sx={{ mb: 3 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: '20px', border: '1px solid #dbeafe', background: 'linear-gradient(180deg, #f8fbff 0%, #f3f8ff 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #93c5fd' }}>
              <InsightsIcon sx={{ color: '#1d4ed8' }} />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: '0.12em' }}>
                Splash Ads
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.5 }}>
                Ads Analytics Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', mt: 1, maxWidth: 720 }}>
                Comprehensive ad performance metrics for impressions, clicks, and campaign effectiveness.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={metricCard}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <VisibilityIcon sx={{ color: '#2563eb' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Impressions
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{totalImpressions}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={metricCard}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <MouseIcon sx={{ color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Clicks
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{totalClicks}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={metricCard}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AutoGraphIcon sx={{ color: '#0ea5e9' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Avg CTR
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{avgCtr}%</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={metricCard}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#9333ea' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Conversions
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{totalConversions}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {loading ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '18px', border: '1px solid #dbeafe', mb: 3, textAlign: 'center' }}>
          <CircularProgress />
        </Paper>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #dbeafe', minHeight: 340 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Performance Over Time
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
                    Trendline for active campaigns
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" startIcon={<AutoGraphIcon />} sx={{ textTransform: 'none' }}>
                  Last 30 days
                </Button>
              </Stack>
              <Box sx={{ position: 'relative', height: 220, bgcolor: '#f8fbff', borderRadius: 3, border: '1px solid #dbeafe', p: 2 }}>
                <Box sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '1fr 1fr 1fr 1fr 1fr', '& > div': { borderTop: '1px solid rgba(15, 23, 42, 0.08)' } }}>
                  {[...Array(5)].map((_, idx) => (<div key={idx} />))}
                </Box>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Box sx={{ position: 'absolute', bottom: 20, left: 20, width: '12%', height: '40%', bgcolor: '#2563eb', borderRadius: 2 }} />
                  <Box sx={{ position: 'absolute', bottom: 8, left: '28%', width: '14%', height: '60%', bgcolor: '#22c55e', borderRadius: 2 }} />
                  <Box sx={{ position: 'absolute', bottom: 4, left: '48%', width: '10%', height: '30%', bgcolor: '#8b5cf6', borderRadius: 2 }} />
                  <Box sx={{ position: 'absolute', bottom: 14, left: '68%', width: '12%', height: '48%', bgcolor: '#f97316', borderRadius: 2 }} />
                  <Box sx={{ position: 'absolute', bottom: 20, left: '84%', width: '10%', height: '36%', bgcolor: '#2563eb', borderRadius: 2 }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #dbeafe', minHeight: 340 }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', mb: 2 }}>
                Device Breakdown
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', width: 180, height: 180, borderRadius: '50%', bgcolor: '#f8fbff' }}>
                  <Box sx={{ position: 'absolute', inset: 16, borderRadius: '50%', bgcolor: '#fff' }} />
                  <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(#2563eb 0 45%, #22c55e 0 85%, #8b5cf6 0 100%)' }} />
                </Box>
              </Box>
              <Stack spacing={2}>
                {deviceBreakdown.map((device) => (
                  <Box key={device.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: device.color }} />
                      <Typography sx={{ color: '#334155', fontWeight: 700 }}>{device.label}</Typography>
                    </Box>
                    <Typography sx={{ color: '#64748b' }}>{device.value}%</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #dbeafe' }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', mb: 3 }}>
                Placement Performance
              </Typography>
              <Stack spacing={2}>
                {placementEntries.map(([page, count], index) => (
                  <Box key={page}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{page}</Typography>
                      <Typography sx={{ color: '#64748b' }}>{count}</Typography>
                    </Box>
                    <Box sx={{ height: 10, width: '100%', bgcolor: '#e2e8f0', borderRadius: 99 }}>
                      <Box sx={{ width: `${Math.min(100, (count / (placementEntries[0]?.[1] || 1)) * 100)}%`, height: '100%', bgcolor: '#2563eb', borderRadius: 99 }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #dbeafe' }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', mb: 3 }}>
                Top Performing Ads
              </Typography>
              <Stack spacing={2}>
                {topAds.length === 0 ? (
                  <Typography color="text.secondary">No top ads yet.</Typography>
                ) : (
                  topAds.map((ad, index) => (
                    <Paper key={`${ad.title}-${index}`} elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fbff', border: '1px solid #e2e8f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>{ad.title}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>Product Banner</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 700, color: '#2563eb' }}>{Math.round(ad.ctr)}% CTR</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#475569' }}>{ad.impressions} impressions · {ad.clicks} clicks</Typography>
                    </Paper>
                  ))
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default AdsAnalytics;
