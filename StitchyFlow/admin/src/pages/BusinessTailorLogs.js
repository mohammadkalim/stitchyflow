import React, { useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment, MenuItem, Select } from '@mui/material';
import { Search as SearchIcon, History as HistoryIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function BusinessTailorLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  // Sample data - will be replaced with API data
  const logs = [];

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
          Business Tailor Logs
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Track all tailor activities and system events
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Total Logs
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Login Events
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Order Actions
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Profile Updates
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by tailor name, action, or IP address..."
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
        <Select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          sx={{
            minWidth: 200,
            borderRadius: '12px',
            '& fieldset': { borderColor: '#2563EB', borderWidth: '2px' }
          }}
        >
          <MenuItem value="all">All Actions</MenuItem>
          <MenuItem value="login">Login</MenuItem>
          <MenuItem value="logout">Logout</MenuItem>
          <MenuItem value="order_created">Order Created</MenuItem>
          <MenuItem value="order_updated">Order Updated</MenuItem>
          <MenuItem value="profile_updated">Profile Updated</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>TIMESTAMP</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>TAILOR</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>ACTION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>DESCRIPTION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>IP ADDRESS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <HistoryIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#999' }}>
                      No logs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.tailor}</TableCell>
                    <TableCell>
                      <Chip 
                        label={log.action} 
                        size="small"
                        sx={{ 
                          bgcolor: '#E3F2FD',
                          color: '#1976d2',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>
                      <Chip 
                        label={log.status} 
                        size="small"
                        sx={{ 
                          bgcolor: log.status === 'Success' ? '#E8F5E9' : '#FFEBEE',
                          color: log.status === 'Success' ? '#388E3C' : '#D32F2F',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Layout>
  );
}

export default BusinessTailorLogs;
