import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <Layout title="Payments">
      <TableContainer component={Paper} sx={{ bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Payment ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.payment_id} hover>
                <TableCell>{payment.payment_id}</TableCell>
                <TableCell>{payment.order_id}</TableCell>
                <TableCell>{payment.customer_name}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.payment_method}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    size="small"
                    sx={{
                      bgcolor: payment.status === 'completed' ? '#4caf50' : '#ff9800',
                      color: '#fff'
                    }}
                  />
                </TableCell>
                <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default Payments;
