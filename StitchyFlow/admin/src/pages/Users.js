import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/v1/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Layout title="Dashboard - Users">
      <Paper sx={{ 
        bgcolor: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>Users Management</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                  <TableCell sx={{ color: '#666' }}>{user.user_id}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1a1a2e' }}>{user.full_name}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{user.email}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{user.phone_number}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1976d2', fontWeight: 500 }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{ bgcolor: user.is_active ? '#E8F5E9' : '#FFEBEE', color: user.is_active ? '#2e7d32' : '#c62828', fontWeight: 500 }}
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

export default Users;
