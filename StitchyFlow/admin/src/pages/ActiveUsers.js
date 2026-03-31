import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Box, Typography, Button, IconButton, Tooltip, Avatar,
  TextField, InputAdornment, Snackbar, Alert
} from '@mui/material';
import {
  Search as SearchIcon, People as PeopleIcon, CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon, Edit as EditIcon, Email as EmailIcon, Phone as PhoneIcon
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';

function ActiveUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery]);

  const fetchActiveUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/api/v1/admin/users',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Filter only active users
        const activeUsers = response.data.data
          .filter(user => user.is_active === 1 || user.is_active === true)
          .map(user => {
            // Format last login
            let lastLoginText = 'Never';
            if (user.last_login) {
              const lastLoginDate = new Date(user.last_login);
              const now = new Date();
              const diffMs = now - lastLoginDate;
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);
              
              if (diffMins < 1) {
                lastLoginText = 'Just now';
              } else if (diffMins < 60) {
                lastLoginText = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
              } else if (diffHours < 24) {
                lastLoginText = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
              } else if (diffDays < 7) {
                lastLoginText = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
              } else {
                lastLoginText = lastLoginDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                });
              }
            }
            
            return {
              id: user.user_id,
              userId: String(user.user_id),
              name: user.full_name,
              email: user.email,
              phone: user.phone_number || 'N/A',
              role: user.role === 'admin' ? 'Admin' : user.role === 'tailor' ? 'Tailor Shop' : 'User',
              type: user.role === 'tailor' ? 'tailor' : 'customer',
              lastLogin: lastLoginText,
              avatar: user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
            };
          });
        setUsers(activeUsers);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Layout title="Active Users">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 32, color: '#10B981' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Active Users
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#64748B' }}>
          View and manage all active users in the StitchyFlow platform
        </Typography>
      </Box>

      {/* Stats Card */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 28, color: '#10B981' }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>Total Active Users</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E293B' }}>{users.length}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <TextField
          placeholder="Search active users by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94A3B8' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', bgcolor: '#F8FAFC', '& fieldset': { border: 'none' } }
          }}
        />
      </Paper>

      {/* Users Table */}
      <Paper sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>Active Users List</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>CONTACT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>LAST LOGIN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography sx={{ color: '#64748B' }}>Loading active users...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#ECFDF5', color: '#10B981', fontWeight: 600, width: 40, height: 40 }}>
                          {user.avatar}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{user.name}</Typography>
                          <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>ID: {user.userId}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                        <Typography sx={{ color: '#1E293B', fontSize: '0.875rem' }}>{user.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                        <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>{user.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip label={user.role} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '0.75rem', borderRadius: '8px' }} />
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>{user.lastLogin}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography sx={{ color: '#64748B' }}>No active users found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default ActiveUsers;
