import React from 'react';
import {
  Box, Typography, Grid, Paper, Button, Chip, Divider,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const FOREST = '#1b4332';
const FOREST_LIGHT = '#2d6a4f';
const NAVY = '#0d1b2a';

const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.55}`;

/* ── Mini SVG Charts ── */
function LineChart({ data, color = '#40916c', height = 100 }) {
  const max = Math.max(...data, 1);
  const w = 400; const h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 12) - 6}`).join(' ');
  const gid = `lg${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, color = '#2563eb', height = 100, labels }) {
  const max = Math.max(...data, 1);
  const w = 400; const h = height; const gap = 10;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} style={{ width: '100%', height: height + 18 }}>
      {data.map((v, i) => {
        const bh = Math.max((v / max) * h, 4);
        return (
          <g key={i}>
            <rect x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx="4" fill={color} opacity="0.85" />
            {labels && <text x={i * (bw + gap) + bw / 2} y={h + 14} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="inherit">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, sub, icon, trend, trendUp, live, locked }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: '12px', p: 2, border: '1px solid #e2e8f0', bgcolor: '#fff', opacity: locked ? 0.55 : 1, position: 'relative', height: '100%' }}>
      {locked && <Box sx={{ position: 'absolute', top: 8, right: 8 }}><LockOutlinedIcon sx={{ fontSize: 13, color: '#cbd5e1' }} /></Box>}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.25 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
        {live && <Chip label="Live" size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#ede9fe', color: '#6d28d9', animation: `${pulse} 2s ease-in-out infinite` }} />}
        {trend !== undefined && !live && (
          <Chip size="small" icon={<TrendingUpIcon sx={{ fontSize: 11 }} />} label={trend}
            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: trendUp ? '#f0fdf4' : '#fef2f2', color: trendUp ? '#16a34a' : '#dc2626', '& .MuiChip-icon': { color: trendUp ? '#16a34a' : '#dc2626' } }} />
        )}
        {sub && !trend && !live && <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>{sub}</Typography>}
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.45rem', color: '#0f172a', lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, mt: 0.4 }}>{label}</Typography>
      {trend === undefined && !live && sub && (
        <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', mt: 0.3 }}>{sub}</Typography>
      )}
    </Paper>
  );
}

export default function OverviewSection({ user, isApproved, onNavigate }) {
  /* mock data — replace with real API data */
  const revenueData = [180000, 420000, 310000, 480000, 390000, 520000];
  const bookingData  = [5, 9, 4, 7, 3, 8, 6];
  const months6      = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months7      = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''];

  return (
    <Box>
      {/* ── Hero Banner ── */}
      <Paper elevation={0} sx={{ borderRadius: '14px', p: { xs: 2.5, md: 3 }, mb: 3, overflow: 'hidden', background: `linear-gradient(125deg, ${NAVY} 0%, #16324a 55%, #1b4965 100%)`, position: 'relative', boxShadow: '0 8px 32px rgba(13,27,42,0.18)' }}>
        <Box sx={{ position: 'absolute', top: -30, right: -10, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.45rem' }, mb: 0.6 }}>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.87rem', mb: 2.5, maxWidth: 580 }}>
          Here&apos;s what&apos;s happening with your business today. You have{' '}
          <Box component="span" sx={{ color: '#4ade80', fontWeight: 800 }}>0 pending orders</Box>{' '}
          requiring your attention.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon sx={{ fontSize: 17 }} />}
            disabled={!isApproved} onClick={() => onNavigate('businesses')}
            sx={{ bgcolor: FOREST_LIGHT, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 2.5, py: 0.9, fontSize: '0.85rem', boxShadow: '0 4px 14px rgba(27,67,50,0.4)', '&:hover': { bgcolor: FOREST }, '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' } }}>
            Add New Business
          </Button>
          <Button variant="outlined" startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: 17 }} />}
            disabled={!isApproved}
            sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', textTransform: 'none', fontWeight: 600, borderRadius: '10px', px: 2.5, py: 0.9, fontSize: '0.85rem', bgcolor: 'rgba(0,0,0,0.12)', '&:hover': { bgcolor: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.25)' } }}>
            View Calendar
          </Button>
        </Box>
      </Paper>

      {/* ── Free Plan Bar ── */}
      <Paper elevation={0} sx={{ borderRadius: '12px', p: 2, mb: 3, border: '1px solid #e8ecf1', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>Free Plan</Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.74rem' }}>Upgrade to unlock more potential for your business</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, flexWrap: 'wrap' }}>
          {[
            { icon: <StorefrontOutlinedIcon sx={{ fontSize: 14, color: '#64748b' }} />, text: '0 / 1 Businesses' },
            { icon: <WorkOutlineIcon sx={{ fontSize: 14, color: '#64748b' }} />, text: '/ 3 Services' },
            { icon: <VisibilityIcon sx={{ fontSize: 14, color: '#64748b' }} />, text: '/ 10 Media' },
          ].map((x) => (
            <Box key={x.text} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {x.icon}
              <Typography sx={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>{x.text}</Typography>
            </Box>
          ))}
          <Button variant="contained" startIcon={<UpgradeIcon sx={{ fontSize: 16 }} />} size="small"
            sx={{ bgcolor: FOREST, textTransform: 'none', fontWeight: 700, borderRadius: '9px', fontSize: '0.78rem', px: 2, boxShadow: 'none', '&:hover': { bgcolor: FOREST_LIGHT } }}>
            Upgrade Plan
          </Button>
        </Box>
      </Paper>

      {/* ── KPI Cards ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Revenue', value: 'Rs 0', sub: '+12%', trend: '+12%', trendUp: true, icon: <AttachMoneyIcon sx={{ fontSize: 20, color: '#40916c' }} /> },
          { label: 'Total Orders', value: '0', sub: '0 compared', icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#2563eb' }} /> },
          { label: 'Profile Views', value: '0', live: true, icon: <PeopleOutlineIcon sx={{ fontSize: 20, color: '#7c3aed' }} /> },
          { label: 'Rating Score', value: '0.0 / 5.0', sub: '0 reviews', icon: <StarIcon sx={{ fontSize: 20, color: '#f59e0b' }} /> },
        ].map((s) => (
          <Grid item xs={6} lg={3} key={s.label}>
            <StatCard {...s} locked={!isApproved} />
          </Grid>
        ))}
      </Grid>

      {/* ── Performance Analytics ── */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ShowChartIcon sx={{ fontSize: 18, color: FOREST }} />
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>Performance Analytics</Typography>
        </Box>
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Revenue Trend */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ borderRadius: '12px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', opacity: isApproved ? 1 : 0.55 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16, color: FOREST }} />
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Revenue Trend (PKR)</Typography>
                </Box>
                <Chip label="Last 6 Months" size="small" sx={{ bgcolor: '#f0fdf4', color: FOREST, fontSize: '0.65rem', fontWeight: 700, height: 20 }} />
              </Box>
              <LineChart data={revenueData} color="#40916c" height={120} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                {months6.map((m) => <Typography key={m} sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{m}</Typography>)}
              </Box>
            </Paper>
          </Grid>
          {/* Monthly Bookings */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ borderRadius: '12px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', opacity: isApproved ? 1 : 0.55 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Monthly Orders</Typography>
                </Box>
                <Typography sx={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Trend Analysis</Typography>
              </Box>
              <BarChart data={bookingData} color="#2563eb" height={120} labels={months7} />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ── Recent Bookings + Overview Stats + Pro Tip ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          {/* Recent Bookings */}
          <Paper elevation={0} sx={{ borderRadius: '12px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Recent Orders</Typography>
              <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />} disabled={!isApproved}
                sx={{ color: FOREST, textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}>View All →</Button>
            </Box>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <WorkOutlineIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>No recent orders found.</Typography>
            </Box>
          </Paper>

          {/* Your Businesses */}
          <Paper elevation={0} sx={{ borderRadius: '12px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Your Businesses</Typography>
              <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />} disabled={!isApproved} onClick={() => onNavigate('businesses')}
                sx={{ color: FOREST, textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}>Manage All →</Button>
            </Box>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <StorefrontOutlinedIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 1.25 }}>You haven&apos;t added any businesses yet.</Typography>
              {isApproved
                ? <Button onClick={() => onNavigate('businesses')} sx={{ color: '#2563eb', fontWeight: 800, textTransform: 'none', fontSize: '0.85rem' }}>Register your first business</Button>
                : <Typography sx={{ color: '#cbd5e1', fontSize: '0.76rem' }}>Unlocked after admin approval</Typography>}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          {/* Overview Stats */}
          <Paper elevation={0} sx={{ borderRadius: '12px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
              <ShowChartIcon sx={{ fontSize: 16, color: FOREST }} />
              <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>Overview Stats</Typography>
            </Box>
            {[
              { label: 'Active Listings', value: '0' },
              { label: 'Pending Reviews', value: '0' },
              { label: 'Completion Rate', value: '0%' },
            ].map((s, i, arr) => (
              <Box key={s.label}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.1 }}>
                  <Typography sx={{ color: '#475569', fontSize: '0.82rem' }}>{s.label}</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{s.value}</Typography>
                </Box>
                {i < arr.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>

          {/* Pro Tip */}
          <Paper elevation={0} sx={{ borderRadius: '12px', p: 2.25, border: '1px solid #c8e6c9', bgcolor: '#e8f5e9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: FOREST }} />
              <Typography sx={{ fontWeight: 800, color: FOREST, fontSize: '0.82rem' }}>Pro Tip</Typography>
            </Box>
            <Typography sx={{ color: '#1b4332', fontSize: '0.78rem', lineHeight: 1.7, mb: 1.5 }}>
              Complete your business profile with high-quality images to increase booking rates by up to 40%. Rates up to more.
            </Typography>
            <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />} disabled={!isApproved}
              sx={{ color: FOREST, textTransform: 'none', fontWeight: 800, fontSize: '0.75rem', p: 0, minWidth: 0 }}>
              IMPROVE PROFILE +
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
