import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Paper, Avatar, LinearProgress,
  Chip, CircularProgress,
} from '@mui/material';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { apiFetch } from '../../utils/api';

const G = '#1b4332';
const GL = '#2d6a4f';

function Sparkline({ color = GL }) {
  const pts = [20, 35, 28, 45, 38, 55, 48, 62, 50, 70];
  const max = Math.max(...pts); const min = Math.min(...pts);
  const norm = pts.map(p => 40 - ((p - min) / (max - min)) * 36);
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (pts.length - 1)) * 100},${y}`).join(' ');
  return (
    <svg width="100" height="44" viewBox="0 0 100 44" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L100,44 L0,44 Z`} fill={`url(#sg${color.replace('#','')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KpiCard({ label, value, icon, color, trend }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
        </Box>
        <Chip label={trend} size="small" sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: '#0f172a', lineHeight: 1.2, mt: 1 }}>{value}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.4 }}>{label}</Typography>
      <Box sx={{ mt: 1.5 }}><Sparkline color={color} /></Box>
    </Paper>
  );
}

function QuickAction({ icon, label, desc, color, onClick }) {
  return (
    <Paper elevation={0} onClick={onClick} sx={{
      borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff',
      cursor: 'pointer', transition: 'all 0.18s',
      '&:hover': { borderColor: color, boxShadow: `0 4px 20px ${color}22`, transform: 'translateY(-2px)' },
    }}>
      <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{label}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.4 }}>{desc}</Typography>
    </Paper>
  );
}

export default function OverviewSection({ user, isApproved, onNavigate }) {
  const [shops, setShops]   = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/business/shops/enriched').catch(() => ({ data: [] })),
      apiFetch('/orders').catch(() => ({ data: [] })),
    ]).then(([s, o]) => {
      setShops(Array.isArray(s?.data) ? s.data : []);
      setOrders(Array.isArray(o?.data) ? o.data : []);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter(o => o.order_status === 'completed').reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0);

  const kpis = [
    { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, color: G, trend: '+12%' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBagOutlinedIcon />, color: '#2563eb', trend: '+8%' },
    { label: 'My Businesses', value: shops.length, icon: <StorefrontOutlinedIcon />, color: '#7c3aed', trend: `+${shops.length}` },
    { label: 'Completed', value: orders.filter(o => o.order_status === 'completed').length, icon: <StarBorderIcon />, color: '#d97706', trend: 'done' },
  ];

  const quickActions = [
    { icon: <AddBusinessOutlinedIcon />, label: 'Add Business', desc: 'Register a new shop', color: G, key: 'businesses' },
    { icon: <MiscellaneousServicesOutlinedIcon />, label: 'Add Service', desc: 'List a new service', color: '#2563eb', key: 'services' },
    { icon: <LocalOfferOutlinedIcon />, label: 'Create Promo', desc: 'Launch a promotion', color: '#7c3aed', key: 'promotions' },
    { icon: <CalendarTodayOutlinedIcon />, label: 'View Orders', desc: 'Manage your orders', color: '#d97706', key: 'bookings' },
  ];

  return (
    <Box>
      {/* Hero Banner */}
      <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', mb: 3, background: `linear-gradient(135deg, #0d1b2a 0%, #112233 60%, ${G} 100%)`, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
        <Box sx={{ p: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: GL, fontSize: '1.8rem', fontWeight: 800, border: '3px solid rgba(255,255,255,0.2)' }}>
            {user?.firstName?.[0]?.toUpperCase() || 'T'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', mb: 0.3 }}>Welcome back,</Typography>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.6rem' }, lineHeight: 1.2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', mt: 0.5 }}>
              {isApproved ? '✓ Verified Tailor' : '⏳ Pending Approval'} · {shops.length} Business{shops.length !== 1 ? 'es' : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button onClick={() => onNavigate('businesses')} variant="contained" startIcon={<AddBusinessOutlinedIcon />}
              sx={{ bgcolor: GL, color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 2.5, '&:hover': { bgcolor: G } }}>
              Add Business
            </Button>
            <Button onClick={() => onNavigate('bookings')} variant="outlined" startIcon={<CalendarTodayOutlinedIcon />}
              sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 2.5, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}>
              View Orders
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* KPI Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: G }} /></Box>
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {kpis.map(k => (
            <Grid item xs={12} sm={6} lg={3} key={k.label}><KpiCard {...k} /></Grid>
          ))}
        </Grid>
      )}

      {/* Quick Actions */}
      <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', mb: 1.5 }}>Quick Actions</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickActions.map(a => (
          <Grid item xs={6} sm={3} key={a.label}>
            <QuickAction {...a} onClick={() => onNavigate(a.key)} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Recent Orders */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Recent Orders</Typography>
            {orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <InboxOutlinedIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>No orders yet</Typography>
              </Box>
            ) : (
              orders.slice(0, 5).map(o => (
                <Box key={o.order_id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.2, borderBottom: '1px solid #f1f5f9' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: GL }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.83rem', color: '#0f172a' }} noWrap>#{o.order_number}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.73rem' }}>{o.customer_name || 'Customer'}</Typography>
                  </Box>
                  <Chip label={o.order_status || 'pending'} size="small"
                    sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Your Businesses</Typography>
            {shops.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <StorefrontOutlinedIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem' }}>No businesses yet</Typography>
                <Button size="small" onClick={() => onNavigate('businesses')}
                  sx={{ mt: 1, color: GL, fontWeight: 700, textTransform: 'none', fontSize: '0.78rem' }}>+ Add Business</Button>
              </Box>
            ) : (
              shops.slice(0, 3).map(s => (
                <Box key={s.shop_id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: '1px solid #f1f5f9' }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: `${G}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StorefrontOutlinedIcon sx={{ fontSize: 17, color: G }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }} noWrap>{s.shop_name}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.72rem' }}>{s.city || 'N/A'}</Typography>
                  </Box>
                  <Chip label={s.shop_status || 'active'} size="small"
                    sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                </Box>
              ))
            )}
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Business Stats</Typography>
            {[
              { label: 'Profile Completion', value: shops.length > 0 ? 72 : 10, color: G },
              { label: 'Order Fulfillment', value: orders.length > 0 ? Math.round((orders.filter(o => o.order_status === 'completed').length / orders.length) * 100) : 0, color: '#2563eb' },
              { label: 'Active Businesses', value: shops.filter(s => s.shop_status === 'active').length > 0 ? 100 : 0, color: '#d97706' },
            ].map(s => (
              <Box key={s.label} sx={{ mb: 1.8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 700 }}>{s.value}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={s.value}
                  sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: s.color, borderRadius: 3 } }} />
              </Box>
            ))}
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <NotificationsNoneIcon sx={{ fontSize: 20, color: GL }} />
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Notifications</Typography>
            </Box>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', py: 2 }}>No new notifications</Typography>
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: '16px', p: 2.5, background: `linear-gradient(135deg, ${G}, ${GL})` }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <TipsAndUpdatesOutlinedIcon sx={{ color: '#fff', fontSize: 22, mt: 0.2 }} />
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', mb: 0.5 }}>Pro Tip</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  Complete your business profile to attract more customers. Profiles with photos get 3x more inquiries.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
