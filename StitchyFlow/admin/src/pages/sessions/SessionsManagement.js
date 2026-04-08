/**
 * Sessions Management Overview - Live Database
 * Developer: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, CircularProgress,
  Chip, IconButton, Tooltip, Divider
} from '@mui/material';
import {
  CheckCircle, PauseCircle, DeleteForever, HourglassEmpty,
  History, DevicesOther, Refresh, ArrowForwardIos, TrendingUp
} from '@mui/icons-material';
import Layout from '../../components/Layout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const CARDS = [
  { key:'active',   label:'Active Sessions',   desc:'Currently live',        icon:<CheckCircle  sx={{fontSize:28}}/>, color:'#16a34a', bg:'#dcfce7', border:'#bbf7d0', path:'/sessions/active'   },
  { key:'inactive', label:'Inactive Sessions',  desc:'Expired or idle',       icon:<PauseCircle  sx={{fontSize:28}}/>, color:'#d97706', bg:'#fef9c3', border:'#fde68a', path:'/sessions/inactive' },
  { key:'deleted',  label:'Deleted Sessions',   desc:'Terminated',            icon:<DeleteForever sx={{fontSize:28}}/>, color:'#dc2626', bg:'#fee2e2', border:'#fecaca', path:'/sessions/deleted'  },
  { key:'pending',  label:'Pending Sessions',   desc:'Awaiting verification', icon:<HourglassEmpty sx={{fontSize:28}}/>, color:'#7c3aed', bg:'#ede9fe', border:'#ddd6fe', path:'/sessions/pending'  },
];

const LINKS = [
  { label:'Session Logs',    desc:'Full audit trail',  icon:<History/>,       color:'#2563eb', path:'/sessions/logs'    },
  { label:'Active Sessions', desc:'Live monitoring',   icon:<CheckCircle/>,   color:'#16a34a', path:'/sessions/active'  },
  { label:'Pending Review',  desc:'Needs attention',  icon:<HourglassEmpty/>, color:'#7c3aed', path:'/sessions/pending' },
];

export default function SessionsManagement() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/sessions/stats`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Layout title="Sessions Management">
      <Box sx={{ pb:4 }}>
        {/* Header */}
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:4 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
            <Box sx={{ width:52, height:52, borderRadius:'16px', background:'linear-gradient(135deg,#1976d2,#1565c0)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(25,118,210,0.35)' }}>
              <DevicesOther sx={{ color:'#fff', fontSize:28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight:800, color:'#0f172a' }}>Sessions Management</Typography>
              <Typography variant="body2" sx={{ color:'#64748b' }}>Monitor and control all user sessions — live database</Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={load} sx={{ bgcolor:'#f8fafc', border:'1px solid #e2e8f0', '&:hover':{ bgcolor:'#eff6ff' } }}>
              <Refresh sx={{ color:'#64748b' }} />
            </IconButton>
          </Tooltip>
        </Box>

        {loading ? (
          <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', py:12, gap:2 }}>
            <CircularProgress sx={{ color:'#1976d2' }} />
            <Typography variant="caption" sx={{ color:'#94a3b8' }}>Loading live data from database...</Typography>
          </Box>
        ) : (
          <>
            {/* Stat Cards */}
            <Grid container spacing={2.5} sx={{ mb:3 }}>
              {CARDS.map(c => (
                <Grid item xs={12} sm={6} lg={3} key={c.key}>
                  <Paper elevation={0} onClick={() => navigate(c.path)} sx={{ borderRadius:'18px', border:`1px solid ${c.border}`, cursor:'pointer', overflow:'hidden', transition:'all 0.2s', '&:hover':{ boxShadow:`0 12px 32px ${c.color}22`, transform:'translateY(-3px)', borderColor:c.color } }}>
                    <Box sx={{ height:4, background:c.color }} />
                    <Box sx={{ p:2.5 }}>
                      <Box sx={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', mb:2 }}>
                        <Box sx={{ width:52, height:52, borderRadius:'14px', bgcolor:c.bg, display:'flex', alignItems:'center', justifyContent:'center', color:c.color, border:`1px solid ${c.border}` }}>{c.icon}</Box>
                        <ArrowForwardIos sx={{ fontSize:13, color:'#cbd5e1', mt:1 }} />
                      </Box>
                      <Typography sx={{ fontSize:'2.6rem', fontWeight:900, color:'#0f172a', lineHeight:1, mb:0.5 }}>{stats?.[c.key] ?? 0}</Typography>
                      <Typography sx={{ fontSize:'0.88rem', fontWeight:700, color:'#334155', mb:0.3 }}>{c.label}</Typography>
                      <Typography sx={{ fontSize:'0.75rem', color:'#94a3b8' }}>{c.desc}</Typography>
                      <Box sx={{ mt:2, pt:2, borderTop:`1px solid ${c.border}` }}>
                        <Chip label="View All →" size="small" sx={{ bgcolor:c.bg, color:c.color, fontWeight:700, fontSize:'0.68rem', height:22, border:`1px solid ${c.border}` }} />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Banner + Quick Links */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={7}>
                <Paper elevation={0} sx={{ borderRadius:'18px', background:'linear-gradient(135deg,#1e3a5f,#1976d2 60%,#42a5f5)', border:'1px solid #1565c0', height:'100%' }}>
                  <Box sx={{ p:3.5, position:'relative', overflow:'hidden' }}>
                    <Box sx={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', bgcolor:'rgba(255,255,255,0.06)' }} />
                    <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:2 }}>
                      <TrendingUp sx={{ color:'rgba(255,255,255,0.8)', fontSize:20 }} />
                      <Typography sx={{ color:'rgba(255,255,255,0.8)', fontSize:'0.8rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Live Database Overview</Typography>
                    </Box>
                    <Typography sx={{ fontSize:'3.8rem', fontWeight:900, color:'#fff', lineHeight:1, mb:0.5 }}>{stats?.total ?? 0}</Typography>
                    <Typography sx={{ color:'rgba(255,255,255,0.75)', fontSize:'1rem', fontWeight:500 }}>Total Sessions in Database</Typography>
                    <Box sx={{ display:'flex', gap:2, mt:3, flexWrap:'wrap' }}>
                      {CARDS.map(c => (
                        <Box key={c.key} sx={{ display:'flex', alignItems:'center', gap:0.8 }}>
                          <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:c.color }} />
                          <Typography sx={{ color:'rgba(255,255,255,0.7)', fontSize:'0.75rem' }}>{stats?.[c.key] ?? 0} {c.key}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper elevation={0} sx={{ borderRadius:'18px', border:'1px solid #e2e8f0', height:'100%' }}>
                  <Box sx={{ px:2.5, py:2, borderBottom:'1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight:700, color:'#0f172a', fontSize:'0.9rem' }}>Quick Navigation</Typography>
                    <Typography variant="caption" sx={{ color:'#94a3b8' }}>Jump to any section</Typography>
                  </Box>
                  <Box sx={{ p:1.5 }}>
                    {LINKS.map((link, idx) => (
                      <Box key={idx}>
                        <Box onClick={() => navigate(link.path)} sx={{ display:'flex', alignItems:'center', gap:2, p:1.5, borderRadius:'10px', cursor:'pointer', '&:hover':{ bgcolor:`${link.color}10` } }}>
                          <Box sx={{ width:38, height:38, borderRadius:'10px', bgcolor:`${link.color}15`, display:'flex', alignItems:'center', justifyContent:'center', color:link.color }}>{link.icon}</Box>
                          <Box sx={{ flex:1 }}>
                            <Typography sx={{ fontSize:'0.85rem', fontWeight:600, color:'#0f172a' }}>{link.label}</Typography>
                            <Typography sx={{ fontSize:'0.72rem', color:'#94a3b8' }}>{link.desc}</Typography>
                          </Box>
                          <ArrowForwardIos sx={{ fontSize:12, color:'#cbd5e1' }} />
                        </Box>
                        {idx < LINKS.length - 1 && <Divider sx={{ borderColor:'#f8fafc', mx:1.5 }} />}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Layout>
  );
}
