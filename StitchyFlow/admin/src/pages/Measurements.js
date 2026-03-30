import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

function Measurements() {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/v1/admin/measurements', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMeasurements(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch measurements:', error);
      }
    };
    fetchMeasurements();
  }, []);

  return (
    <Layout title="Dashboard - Measurements">
      <Paper sx={{ 
        bgcolor: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Measurements Management</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Garment Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Chest</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Waist</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Length</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {measurements.map((measurement) => (
                <TableRow key={measurement.measurement_id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                  <TableCell sx={{ color: '#666' }}>{measurement.measurement_id}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1a1a2e' }}>{measurement.customer_name}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{measurement.garment_type}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{measurement.chest}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{measurement.waist}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{measurement.length}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{new Date(measurement.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
}

export default Measurements;
