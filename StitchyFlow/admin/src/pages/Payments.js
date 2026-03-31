import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // API call commented out - uncomment when backend is ready
    /*
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/v1/admin/payments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      }
    };
    fetchPayments();
    */
  }, []);

  return (
    <Layout title="Dashboard - Payments">
      <Paper sx={{ 
        bgcolor: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Payments Management</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Payment ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.payment_id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1a1a2e' }}>#{payment.payment_id}</TableCell>
                  <TableCell sx={{ color: '#666' }}>#{payment.order_id}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1a1a2e' }}>{payment.customer_name}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a2e' }}>${payment.amount}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{payment.payment_method}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      size="small"
                      sx={{
                        bgcolor: payment.status === 'completed' ? '#E8F5E9' : '#FFF3E0',
                        color: payment.status === 'completed' ? '#2e7d32' : '#E65100',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#666' }}>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
}

export default Payments;
