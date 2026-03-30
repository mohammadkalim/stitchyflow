import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
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
    <Layout title="Tailors">
      <TableContainer component={Paper} sx={{ bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tailors.map((tailor) => (
              <TableRow key={tailor.tailor_id} hover>
                <TableCell>{tailor.tailor_id}</TableCell>
                <TableCell>{tailor.full_name}</TableCell>
                <TableCell>{tailor.email}</TableCell>
                <TableCell>{tailor.phone_number}</TableCell>
                <TableCell>{tailor.specialization || 'General'}</TableCell>
                <TableCell>
                  <Chip
                    label={tailor.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{ bgcolor: tailor.is_active ? '#4caf50' : '#f44336', color: '#fff' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default Tailors;
