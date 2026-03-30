import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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
    <Layout title="Measurements">
      <TableContainer component={Paper} sx={{ bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Garment Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Chest</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Waist</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Length</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {measurements.map((measurement) => (
              <TableRow key={measurement.measurement_id} hover>
                <TableCell>{measurement.measurement_id}</TableCell>
                <TableCell>{measurement.customer_name}</TableCell>
                <TableCell>{measurement.garment_type}</TableCell>
                <TableCell>{measurement.chest}</TableCell>
                <TableCell>{measurement.waist}</TableCell>
                <TableCell>{measurement.length}</TableCell>
                <TableCell>{new Date(measurement.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default Measurements;
