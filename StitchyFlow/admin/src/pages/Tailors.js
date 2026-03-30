import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

function Tailors() {
  const [tailors, setTailors] = useState([]);

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/v1/admin/tailors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTailors(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch tailors:', error);
      }
    };
    fetchTailors();
  }, []);

  return (
    <Layout title="Dashboard - Tailors">
      <Paper sx={{ 
        bgcolor: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Tailors Management</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Specialization</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tailors.map((tailor) => (
                <TableRow key={tailor.tailor_id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                  <TableCell sx={{ color: '#666' }}>{tailor.tailor_id}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1a1a2e' }}>{tailor.full_name}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{tailor.email}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{tailor.phone_number}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{tailor.specialization || 'General'}</TableCell>
                  <TableCell>
                    <Chip
                      label={tailor.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{ bgcolor: tailor.is_active ? '#E8F5E9' : '#FFEBEE', color: tailor.is_active ? '#2e7d32' : '#c62828', fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
}

export default Tailors;
