import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Box, Typography, Button, IconButton, Tooltip, Avatar,
  TextField, InputAdornment, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import {
  Search as SearchIcon, Delete as DeleteIcon, RestoreFromTrash as RestoreIcon,
  Email as EmailIcon, Phone as PhoneIcon, DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';

function DeletedUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchDeletedUsers();
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

  const fetchDeletedUsers = async () => {
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
        // Filter only inactive/deleted users
        const deletedUsers = response.data.data
          .filter(user => user.is_active === 0 || user.is_active === false)
          .map(user => {
            // Format deleted date (using updated_at as proxy for deletion time)
            let deletedText = 'Unknown';
            if (user.updated_at) {
              const deletedDate = new Date(user.updated_at);
              deletedText = deletedDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            }
            
            return {
              id: user.user_id,
              userId: String(user.user_id),
              name: user.full_name,
              email: user.email,
              phone: user.phone_number || 'N/A',
              role: user.role === 'admin' ? 'Admin' : user.role === 'tailor' ? 'Tailor Shop' : 'User',
              type: user.role === 'tailor' ? 'tailor' : 'customer',
              deletedAt: deletedText,
              avatar: user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
            };
          });
        setUsers(deletedUsers);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleRestoreUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `http://localhost:5000/api/v1/admin/users/${selectedUser.id}`,
        {
          is_active: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setOpenRestoreDialog(false);
        setSelectedUser(null);
        setSnackbar({ open: true, message: 'User restored successfully', severity: 'success' });
        fetchDeletedUsers();
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error?.message || 'Failed to restore user', 
        severity: 'error' 
      });
    }
  };

  return (
    <Layout title="Deleted Users">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <DeleteIcon sx={{ fontSize: 32, color: '#EF4444' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Deleted Users
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#64748B' }}>
          View and restore deleted users from the StitchyFlow platform
        </Typography>
      </Box>

      {/* Stats Card */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DeleteIcon sx={{ fontSize: 28, color: '#EF4444' }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>Total Deleted Users</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E293B' }}>{users.length}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <TextField
          placeholder="Search deleted users by name, email, or phone..."
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>Deleted Users List</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>CONTACT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>DELETED AT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography sx={{ color: '#64748B' }}>Loading deleted users...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: '#FEF2F2' } }}>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#FEE2E2', color: '#EF4444', fontWeight: 600, width: 40, height: 40 }}>
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
                      <Chip label={user.role} size="small" sx={{ bgcolor: '#FEE2E2', color: '#EF4444', fontWeight: 600, fontSize: '0.75rem', borderRadius: '8px' }} />
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>{user.deletedAt}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Tooltip title="Restore User">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedUser(user); setOpenRestoreDialog(true); }}
                          sx={{ color: '#10B981' }}
                        >
                          <RestoreIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography sx={{ color: '#64748B' }}>No deleted users found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Restore Dialog */}
      <Dialog open={openRestoreDialog} onClose={() => setOpenRestoreDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#ECFDF5', color: '#10B981', width: 56, height: 56, mb: 2 }}>
              <RestoreIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#10B981' }}>Restore User</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#1E293B', mb: 1 }}>
            Are you sure you want to restore <strong>{selectedUser?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            This user will be reactivated and can access the platform again.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setOpenRestoreDialog(false)} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', px: 3 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleRestoreUser} 
            variant="contained" 
            startIcon={<RestoreIcon />}
            sx={{ bgcolor: '#10B981', borderRadius: '10px', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#059669' } }}
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>

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

export default DeletedUsers;
