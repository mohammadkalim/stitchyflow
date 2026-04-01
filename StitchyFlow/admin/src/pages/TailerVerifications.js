import React, { useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon, Visibility as ViewIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function TailerVerifications() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - will be replaced with API data
  const verifications = [];

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
          Tailer Verifications
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Review and approve tailor registration requests
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Pending
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Approved
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Rejected
          </Typography>
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
          placeholder="Search by tailor name, email, or phone..."
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
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>SHOP NAME</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>SUBMITTED</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {verifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ color: '#999' }}>
                      No verification requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                verifications.map((verification) => (
                  <TableRow key={verification.id} hover>
                    <TableCell>{verification.name}</TableCell>
                    <TableCell>{verification.email}</TableCell>
                    <TableCell>{verification.phone}</TableCell>
                    <TableCell>{verification.shopName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={verification.status} 
                        size="small"
                        sx={{ 
                          bgcolor: verification.status === 'Pending' ? '#FFF3E0' : verification.status === 'Approved' ? '#E8F5E9' : '#FFEBEE',
                          color: verification.status === 'Pending' ? '#E65100' : verification.status === 'Approved' ? '#2E7D32' : '#C62828',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>{verification.submitted}</TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#1976d2' }}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#2E7D32' }}>
                        <ApproveIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#C62828' }}>
                        <RejectIcon fontSize="small" />
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

export default TailerVerifications;
