import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // API call commented out - uncomment when backend is ready
    /*
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/v1/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
    */
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#FFF3E0', color: '#E65100' },
      in_progress: { bg: '#E3F2FD', color: '#1565C0' },
      completed: { bg: '#E8F5E9', color: '#2E7D32' },
      cancelled: { bg: '#FFEBEE', color: '#C62828' }
    };
    return colors[status] || { bg: '#f5f5f5', color: '#666' };
  };

  return (
    <Layout title="Dashboard - Orders">
      <Paper sx={{ 
        bgcolor: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Orders Management</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Tailor</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                return (
                  <TableRow key={order.order_id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                    <TableCell sx={{ fontWeight: 500, color: '#1a1a2e' }}>#{order.order_id}</TableCell>
                    <TableCell sx={{ color: '#666' }}>{order.customer_name}</TableCell>
                    <TableCell sx={{ color: '#666' }}>{order.tailor_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.replace('_', ' ').toUpperCase()}
                        size="small"
                        sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a2e' }}>${order.total_amount}</TableCell>
                    <TableCell sx={{ color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
}

export default Orders;
