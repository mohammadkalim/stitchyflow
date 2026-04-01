import React, { useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Info as InfoIcon, Visibility as ViewIcon, Block as BlockIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function BusinessTailorInformation() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - will be replaced with API data
  const tailorInfo = [];

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
          Business Tailor Information/IP
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          View detailed tailor information and IP tracking
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Total Tailors
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Verified IPs
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Suspicious IPs
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Blocked IPs
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
          placeholder="Search by tailor name, email, IP address, or location..."
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

      {/* Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>TAILOR NAME</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>PHONE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>IP ADDRESS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>DEVICE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tailorInfo.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <InfoIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#999' }}>
                      No tailor information found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tailorInfo.map((info) => (
                  <TableRow key={info.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {info.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {info.shopName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{info.email}</TableCell>
                    <TableCell>{info.phone}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {info.ipAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {info.city}, {info.country}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {info.device}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={info.ipStatus} 
                        size="small"
                        sx={{ 
                          bgcolor: info.ipStatus === 'Verified' ? '#E8F5E9' : info.ipStatus === 'Suspicious' ? '#FFF3E0' : '#FFEBEE',
                          color: info.ipStatus === 'Verified' ? '#43A047' : info.ipStatus === 'Suspicious' ? '#FB8C00' : '#E53935',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#1976d2' }}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }}>
                        <BlockIcon fontSize="small" />
                      </IconButton>
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

export default BusinessTailorInformation;
