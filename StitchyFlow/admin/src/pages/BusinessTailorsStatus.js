import React, { useState } from 'react';
import { Box, Typography, Card, Grid, Avatar, Chip, IconButton, TextField, InputAdornment, LinearProgress } from '@mui/material';
import { Search as SearchIcon, CheckCircle as OnlineIcon, Cancel as OfflineIcon, Schedule as IdleIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function BusinessTailorsStatus() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - will be replaced with API data
  const tailors = [];

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
            Business Tailors Status
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Monitor real-time tailor availability and status
          </Typography>
        </Box>
        <IconButton 
          sx={{ 
            bgcolor: '#1976d2', 
            color: '#fff',
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <OnlineIcon sx={{ color: '#4CAF50', mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
              Online
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IdleIcon sx={{ color: '#FF9800', mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
              Idle
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <OfflineIcon sx={{ color: '#F44336', mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
              Offline
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Total Records
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by tailor name or shop..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fff',
              '& fieldset': { borderColor: '#2563EB', borderWidth: '2px' }
            }
          }}
        />
      </Box>

      {/* Tailors Grid */}
      <Grid container spacing={3}>
        {tailors.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 8, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <OnlineIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="body1" sx={{ color: '#999' }}>
                No tailors found
              </Typography>
            </Card>
          </Grid>
        ) : (
          tailors.map((tailor) => (
            <Grid item xs={12} sm={6} md={4} key={tailor.id}>
              <Card sx={{ p: 3, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#1976d2', mr: 2 }}>
                      {tailor.name.charAt(0)}
                    </Avatar>
                    <Box sx={{
                      position: 'absolute',
                      bottom: 2,
                      right: 10,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: tailor.status === 'Online' ? '#4CAF50' : tailor.status === 'Idle' ? '#FF9800' : '#F44336',
                      border: '2px solid #fff'
                    }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                      {tailor.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {tailor.shop}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={tailor.status} 
                    size="small"
                    icon={tailor.status === 'Online' ? <OnlineIcon /> : tailor.status === 'Idle' ? <IdleIcon /> : <OfflineIcon />}
                    sx={{ 
                      bgcolor: tailor.status === 'Online' ? '#E8F5E9' : tailor.status === 'Idle' ? '#FFF3E0' : '#FFEBEE',
                      color: tailor.status === 'Online' ? '#4CAF50' : tailor.status === 'Idle' ? '#FF9800' : '#F44336',
                      fontWeight: 600,
                      mb: 1
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Last Active: {tailor.lastActive}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Active Orders: {tailor.activeOrders}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Workload
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {tailor.workload}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={tailor.workload} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#f5f5f5',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: tailor.workload > 80 ? '#F44336' : tailor.workload > 50 ? '#FF9800' : '#4CAF50',
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Layout>
  );
}

export default BusinessTailorsStatus;
