import React, { useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, MenuItem, Select } from '@mui/material';
import { Search as SearchIcon, Visibility as ViewIcon, LocalShipping as ShippingIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function BusinessTailerOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data - will be replaced with API data
  const orders = [];

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
          Business Tailer Orders
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Track and manage all tailor orders
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Total Orders
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
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
            In Progress
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Completed
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Cancelled
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
          placeholder="Search by order ID, customer, or tailor..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            minWidth: 200,
            borderRadius: '12px',
            '& fieldset': { borderColor: '#2563EB', borderWidth: '2px' }
          }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>ORDER ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>CUSTOMER</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>TAILOR SHOP</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>AMOUNT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>ORDER DATE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <ShippingIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#999' }}>
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.tailorShop}</TableCell>
                    <TableCell>₹{order.amount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        size="small"
                        sx={{ 
                          bgcolor: order.status === 'Pending' ? '#FFF3E0' : order.status === 'In Progress' ? '#E1F5FE' : order.status === 'Completed' ? '#E8F5E9' : '#FFEBEE',
                          color: order.status === 'Pending' ? '#FF6F00' : order.status === 'In Progress' ? '#0277BD' : order.status === 'Completed' ? '#388E3C' : '#D32F2F',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#1976d2' }}>
                        <ViewIcon fontSize="small" />
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

export default BusinessTailerOrders;
