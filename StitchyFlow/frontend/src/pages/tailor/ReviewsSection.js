import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Paper, Chip, Avatar,
  TextField, CircularProgress, Alert, LinearProgress, InputAdornment, Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { apiFetch } from '../../utils/api';

const G = '#1b4332';
const GL = '#2d6a4f';

function LockScreen() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <LockOutlinedIcon sx={{ fontSize: 36, color: '#94a3b8' }} />
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', mb: 0.75 }}>Section Locked</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 340 }}>
        This section is available after your tailor account is approved by an administrator.
      </Typography>
    </Box>
  );
}

function StarRow({ rating }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map(i => (
        i <= rating
          ? <StarIcon key={i} sx={{ fontSize: 16, color: '#f59e0b' }} />
          : <StarBorderIcon key={i} sx={{ fontSize: 16, color: '#d1d5db' }} />
      ))}
    </Box>
  );
}

export default function ReviewsSection({ isApproved }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/business/verifications');
      setReviews(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isApproved) load(); }, [isApproved, load]);

  if (!isApproved) return <LockScreen />;

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    return !q || (r.tailor_name || '').toLowerCase().includes(q) || (r.review_notes || '').toLowerCase().includes(q);
  });

  const avgRating = 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({ star: n, count: 0 }));

  const stats = [
    { label: 'Total Reviews', value: reviews.length, color: G },
    { label: '5 Star', value: 0, color: '#f59e0b' },
    { label: 'Avg Rating', value: avgRating.toFixed(1), color: '#2563eb' },
    { label: 'Response Rate', value: '0%', color: '#7c3aed' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>Reviews</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.3 }}>Customer feedback and ratings</Typography>
        </Box>
        <TextField placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
          sx={{ width: { xs: '100%', sm: 280 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
      </Box>

      {/* Rating Overview */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 3, bgcolor: '#fff', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontWeight: 900, fontSize: '4rem', color: '#0f172a', lineHeight: 1 }}>{avgRating.toFixed(1)}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, my: 1 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <StarBorderIcon key={i} sx={{ fontSize: 24, color: '#d1d5db' }} />
              ))}
            </Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>Based on {reviews.length} reviews</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 3, bgcolor: '#fff', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', mb: 2 }}>Rating Breakdown</Typography>
            {ratingCounts.map(({ star, count }) => (
              <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 40 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>{star}</Typography>
                  <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                </Box>
                <LinearProgress variant="determinate" value={reviews.length ? (count / reviews.length) * 100 : 0}
                  sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b', borderRadius: 4 } }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', width: 24, textAlign: 'right' }}>{count}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.8rem', color: s.color }}>{s.value}</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.3 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: G }} /></Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 6, textAlign: 'center', bgcolor: '#fff' }}>
          <RateReviewOutlinedIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}>No reviews yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.83rem' }}>Customer reviews will appear here once you start receiving orders.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((r) => (
            <Paper key={r.verification_id} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ width: 44, height: 44, bgcolor: `${G}18`, color: G, fontWeight: 700, fontSize: '1rem' }}>
                  {(r.tailor_name || 'U')[0].toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{r.tailor_name || 'Anonymous'}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarRow rating={0} />
                      <Chip label={r.verification_status || 'pending'} size="small"
                        sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                    </Box>
                  </Box>
                  {r.review_notes && (
                    <Typography sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.7, mb: 1.5 }}>{r.review_notes}</Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<ThumbUpOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                      sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}>
                      Helpful
                    </Button>
                    <Button size="small" startIcon={<ReplyOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                      sx={{ color: GL, fontWeight: 600, textTransform: 'none', fontSize: '0.75rem', borderRadius: '8px', border: `1px solid ${GL}40`, '&:hover': { bgcolor: `${GL}10` } }}>
                      Reply
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
