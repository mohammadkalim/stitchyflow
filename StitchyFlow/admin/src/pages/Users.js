import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Box, Typography, Button, IconButton, Tooltip, Avatar,
  TextField, FormControl, Select, MenuItem, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as ViewIcon, Search as SearchIcon,
  People as PeopleIcon, CheckCircle as CheckCircleIcon,
  ContentCut as TailorIcon, Email as EmailIcon,
  FilterList as FilterIcon, Close as CloseIcon,
  Phone as PhoneIcon, Cancel as CancelIcon,
  Lock as LockIcon, Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon, Block as BlockIcon
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';
import { api } from '../utils/api';

function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      userId: '1',
      email: 'admin@stitchyflow.com',
      phone: '+92 300 1234567',
      status: 'active',
      role: 'User',
      type: 'customer',
      lastLogin: 'Never',
      avatar: 'AU'
    }
  ]);
  
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Modal states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'User',
    type: 'customer',
    status: 'active',
    address: '',
    city: '',
    homeApartment: '',
    country: ''
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  // Suspend state
  const [openSuspendDialog, setOpenSuspendDialog] = useState(false);
  const [suspendUser, setSuspendUser] = useState(null);
  const [suspending, setSuspending] = useState(false);

  // Fetch users from database on component mount
  useEffect(() => {
    fetchUsers();
    
    // Auto-refresh users every 30 seconds to keep data in sync with database
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 30000); // 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return; // Silently return if no token
      }

      const response = await api.get('/admin/users');

      if (response.data.success) {
        // Map database users to frontend format - ONLY ACTIVE USERS
        const mappedUsers = response.data.data
          .filter(user => user.is_active === 1 || user.is_active === true) // Filter only active users
          .map(user => {
            // Format last login date
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
              status: user.is_active ? 'active' : 'inactive',
              role: user.role === 'admin' ? 'Admin' : user.role === 'tailor' ? 'Tailor Shop' : 'User',
              type: user.role === 'tailor' ? 'tailor' : 'customer',
              lastLogin: lastLoginText,
              lastLoginRaw: user.last_login,
              avatar: user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
            };
          });
        setUsers(mappedUsers);
      }
      setLoading(false);
    } catch (error) {
      // Silently fail - don't show any errors or console logs
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    tailors: users.filter(u => u.type === 'tailor').length,
    socialLogins: 0
  };

  // Filter users
  useEffect(() => {
    let filtered = [...users];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role.toLowerCase() === roleFilter.toLowerCase());
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(u => u.type === typeFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, statusFilter, roleFilter, typeFilter]);

  // CRUD Operations
  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setSnackbar({ open: true, message: 'Name, Email and Password are required', severity: 'error' });
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Map frontend roles to database ENUM values
      const roleMapping = {
        'Admin': 'admin',
        'User': 'customer',
        'Tailor Shop': 'tailor'
      };
      
      const dbRole = roleMapping[formData.role] || 'customer';
      
      const response = await api.post('/admin/users', {
          full_name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          role: dbRole,
          is_active: formData.status === 'active',
          password: formData.password
        });
      
      if (response.data.success) {
        setOpenAddDialog(false);
        resetForm();
        setSnackbar({ open: true, message: 'User added successfully to database', severity: 'success' });
        // Refresh user list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error?.message || 'Failed to add user to database', 
        severity: 'error' 
      });
    }
  };

  const handleEditUser = async () => {
    if (!formData.name || !formData.email) {
      setSnackbar({ open: true, message: 'Name and Email are required', severity: 'error' });
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Map frontend roles to database ENUM values
      const roleMapping = {
        'Admin': 'admin',
        'User': 'customer',
        'Tailor Shop': 'tailor'
      };
      
      const dbRole = roleMapping[formData.role] || 'customer';
      
      const response = await api.put(`/admin/users/${selectedUser.id}`, {
          full_name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          role: dbRole,
          is_active: formData.status === 'active'
        });
      
      if (response.data.success) {
        setOpenEditDialog(false);
        setSelectedUser(null);
        resetForm();
        setSnackbar({ open: true, message: 'User updated successfully in database', severity: 'success' });
        // Refresh user list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error?.message || 'Failed to update user in database', 
        severity: 'error' 
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.delete(`/admin/users/${selectedUser.id}`);
      
      if (response.data.success) {
        setOpenDeleteDialog(false);
        setSelectedUser(null);
        setSnackbar({ open: true, message: 'User deleted successfully from database', severity: 'success' });
        // Refresh user list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error?.message || 'Failed to delete user from database', 
        severity: 'error' 
      });
    }
  };

  // ── SUSPEND USER ──────────────────────────────────────────────────────────
  const handleSuspendUser = async () => {
    if (!suspendUser) return;
    setSuspending(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.patch(
        `http://localhost:5000/api/v1/admin/users/${suspendUser.id}/suspend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setOpenSuspendDialog(false);
        setSuspendUser(null);
        setSnackbar({ open: true, message: 'User suspended and all sessions terminated', severity: 'success' });
        fetchUsers();
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.error?.message || 'Failed to suspend user', severity: 'error' });
    } finally { setSuspending(false); }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.put(
        `http://localhost:5000/api/v1/admin/users/${userId}`,
        {
          is_active: newStatus === 'active'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSnackbar({ open: true, message: 'Status updated successfully in database', severity: 'success' });
        // Refresh user list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error?.message || 'Failed to update status in database', 
        severity: 'error' 
      });
    }
  };

  // Dialog handlers
  const openAdd = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      type: user.type,
      status: user.status,
      address: user.address || '',
      city: user.city || '',
      homeApartment: user.homeApartment || '',
      country: user.country || ''
    });
    setOpenEditDialog(true);
  };

  const openView = (user) => {
    setSelectedUser(user);
    setOpenViewDialog(true);
  };

  const openDelete = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'User',
      type: 'customer',
      status: 'active',
      address: '',
      city: '',
      homeApartment: '',
      country: ''
    });
    setShowPassword(false);
  };


  return (
    <Layout title="User Management">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PeopleIcon sx={{ fontSize: 32, color: '#2563EB' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
            User Management
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#64748B' }}>
          Manage users, vendors, and their verification status for StitchyFlow platform
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3, mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PeopleIcon sx={{ fontSize: 28, color: '#2563EB' }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>Total</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>{stats.total}</Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 28, color: '#10B981' }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>Active Users</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>{stats.active}</Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TailorIcon sx={{ fontSize: 28, color: '#F59E0B' }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>Shop Tailor</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>{stats.tailors}</Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmailIcon sx={{ fontSize: 28, color: '#3B82F6' }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>Social Logins</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>{stats.socialLogins}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>


      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94A3B8' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px', bgcolor: '#F8FAFC', '& fieldset': { border: 'none' } }
            }}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <FilterIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '12px', bgcolor: '#FFFFFF', border: '2px solid #2563EB', fontWeight: 500,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 1.5, fontSize: '0.95rem', color: '#1E293B', display: 'flex', alignItems: 'center' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '12px', mt: 1, boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    '& .MuiMenuItem-root': {
                      fontSize: '0.95rem', py: 1.5, px: 2.5,
                      '&:hover': { bgcolor: '#F8FAFC' },
                      '&.Mui-selected': { bgcolor: '#E0F2FE', fontWeight: 600, '&:hover': { bgcolor: '#BAE6FD' } }
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <PeopleIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '12px', bgcolor: '#FFFFFF', border: '2px solid #2563EB', fontWeight: 500,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 1.5, fontSize: '0.95rem', color: '#1E293B', display: 'flex', alignItems: 'center' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '12px', mt: 1, boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    '& .MuiMenuItem-root': {
                      fontSize: '0.95rem', py: 1.5, px: 2.5,
                      '&:hover': { bgcolor: '#F8FAFC' },
                      '&.Mui-selected': { bgcolor: '#E0F2FE', fontWeight: 600, '&:hover': { bgcolor: '#BAE6FD' } }
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <TailorIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '12px', bgcolor: '#FFFFFF', border: '2px solid #2563EB', fontWeight: 500,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 1.5, fontSize: '0.95rem', color: '#1E293B', display: 'flex', alignItems: 'center' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '12px', mt: 1, boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    '& .MuiMenuItem-root': {
                      fontSize: '0.95rem', py: 1.5, px: 2.5,
                      '&:hover': { bgcolor: '#F8FAFC' },
                      '&.Mui-selected': { bgcolor: '#E0F2FE', fontWeight: 600, '&:hover': { bgcolor: '#BAE6FD' } }
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="tailor">Tailor</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>


      {/* Users Table */}
      <Paper sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>Users</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ bgcolor: '#2563EB', borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#1D4ED8' } }}
          >
            Add
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>CONTACT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>LAST LOGIN</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, width: 40, height: 40 }}>
                          {user.avatar}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{user.name}</Typography>
                          <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>ID: {user.userId}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography sx={{ color: '#1E293B', fontSize: '0.875rem', mb: 0.5 }}>{user.email}</Typography>
                      <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>{user.phone}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user.status === 'active' ? (
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />
                        ) : (
                          <CancelIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                        )}
                        <Select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          size="small"
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: user.status === 'active' ? '#10B981' : '#EF4444',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-select': { py: 0.5, pr: 3 }
                          }}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip label={user.role} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '0.75rem', borderRadius: '8px' }} />
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>{user.lastLogin}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View">
                          <IconButton size="small" onClick={() => openView(user)} sx={{ color: '#2563EB' }}>
                            <ViewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(user)} sx={{ color: '#2563EB' }}>
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Suspend User">
                          <IconButton size="small" onClick={() => { setSuspendUser(user); setOpenSuspendDialog(true); }} sx={{ color: '#d97706', '&:hover': { bgcolor: '#fef3c7' } }}>
                            <BlockIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => openDelete(user)} sx={{ color: '#EF4444' }}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography sx={{ color: '#64748B' }}>No users found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


      {/* Add User Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          } 
        }}
      >
        <DialogTitle sx={{ pb: 0, pt: 4, px: 4, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>
              Add New User
            </Typography>
            <IconButton 
              onClick={() => setOpenAddDialog(false)} 
              size="small"
              sx={{
                color: '#64748B',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 1, mb: 3 }}>
            Fill in the information below to create a new user account
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 2, pb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {/* Full Name */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                placeholder="Enter full name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                    fontSize: '0.95rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E2E8F0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#CBD5E1'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563EB',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                placeholder="Enter email address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                    fontSize: '0.95rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E2E8F0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#CBD5E1'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563EB',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
                placeholder="Enter password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: showPassword ? '#94A3B8' : '#3B82F6', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ 
                          color: showPassword ? '#94A3B8' : '#3B82F6',
                          '&:hover': {
                            bgcolor: showPassword ? '#F1F5F9' : '#EFF6FF'
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: showPassword ? '#F8FAFC' : '#EFF6FF',
                    fontSize: '0.95rem',
                    fontFamily: showPassword ? 'inherit' : 'monospace',
                    letterSpacing: showPassword ? 'normal' : '0.15em',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: showPassword ? '#E2E8F0' : '#BFDBFE',
                      borderWidth: showPassword ? '1px' : '2px'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: showPassword ? '#CBD5E1' : '#93C5FD'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563EB',
                      borderWidth: '2px'
                    },
                    '& input': {
                      fontFamily: showPassword ? 'inherit' : 'monospace',
                      fontSize: showPassword ? '0.95rem' : '1.1rem',
                      letterSpacing: showPassword ? 'normal' : '0.2em'
                    }
                  }
                }}
              />
            </Box>

            {/* Phone */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Phone Number
              </Typography>
              <TextField
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                placeholder="Enter phone number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                    fontSize: '0.95rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E2E8F0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#CBD5E1'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563EB',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Box>

            {/* Role */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Role
              </Typography>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                fullWidth
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#F8FAFC',
                  fontSize: '0.95rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB',
                    borderWidth: '2px'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '12px',
                      mt: 1,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      '& .MuiMenuItem-root': {
                        fontSize: '0.95rem',
                        py: 1.5,
                        '&:hover': { bgcolor: '#F8FAFC' },
                        '&.Mui-selected': { bgcolor: '#EFF6FF', fontWeight: 600, '&:hover': { bgcolor: '#DBEAFE' } }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Tailor Shop">Tailor Shop</MenuItem>
              </Select>
            </Box>

            {/* Type */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Type
              </Typography>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                fullWidth
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#F8FAFC',
                  fontSize: '0.95rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB',
                    borderWidth: '2px'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '12px',
                      mt: 1,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      '& .MuiMenuItem-root': {
                        fontSize: '0.95rem',
                        py: 1.5,
                        '&:hover': { bgcolor: '#F8FAFC' },
                        '&.Mui-selected': { bgcolor: '#EFF6FF', fontWeight: 600, '&:hover': { bgcolor: '#DBEAFE' } }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="tailor">Tailor</MenuItem>
              </Select>
            </Box>

            {/* Status */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Status
              </Typography>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                fullWidth
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#F8FAFC',
                  fontSize: '0.95rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB',
                    borderWidth: '2px'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '12px',
                      mt: 1,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      '& .MuiMenuItem-root': {
                        fontSize: '0.95rem',
                        py: 1.5,
                        '&:hover': { bgcolor: '#F8FAFC' },
                        '&.Mui-selected': { bgcolor: '#EFF6FF', fontWeight: 600, '&:hover': { bgcolor: '#DBEAFE' } }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </Box>

            {/* Address */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Address
              </Typography>
              <TextField
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                fullWidth
                placeholder="Enter street address"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                    fontSize: '0.95rem',
                    '& fieldset': {
                      borderColor: '#E2E8F0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#CBD5E1'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Box>

            {/* City */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                City
              </Typography>
              <Autocomplete
                value={formData.city || null}
                onChange={(event, newValue) => setFormData({ ...formData, city: newValue || '' })}
                freeSolo
                options={[
                  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta',
                  'Sialkot', 'Gujranwala', 'Hyderabad (Pakistan)', 'Sukkur', 'Bahawalpur', 'Sargodha', 'Abbottabad',
                  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
                  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
                  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Newcastle (UK)', 'Sheffield',
                  'Bristol', 'Edinburgh', 'Leicester', 'Coventry', 'Bradford', 'Cardiff', 'Belfast',
                  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain',
                  'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Buraidah',
                  'Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Kobe', 'Kyoto', 'Fukuoka',
                  'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xian',
                  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad (India)', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
                  'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
                  'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dortmund',
                  'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence',
                  'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Malaga', 'Murcia', 'Bilbao',
                  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City',
                  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle (Australia)',
                  'Singapore', 'Hong Kong', 'Seoul', 'Bangkok', 'Kuala Lumpur', 'Jakarta', 'Manila', 'Hanoi',
                  'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya',
                  'Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Port Said', 'Suez', 'Mansoura',
                  'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod',
                  'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Leon', 'Juarez',
                  'Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza', 'Belo Horizonte',
                  'Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucuman',
                  'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'
                ]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search or enter city"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#F8FAFC',
                        fontSize: '0.95rem',
                        '& fieldset': {
                          borderColor: '#E2E8F0'
                        },
                        '&:hover fieldset': {
                          borderColor: '#CBD5E1'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563EB',
                          borderWidth: '2px'
                        }
                      }
                    }}
                  />
                )}
                ListboxProps={{
                  sx: {
                    maxHeight: 300,
                    '& .MuiAutocomplete-option': {
                      fontSize: '0.95rem',
                      py: 1.5,
                      '&:hover': { bgcolor: '#F8FAFC' },
                      '&[aria-selected="true"]': { 
                        bgcolor: '#EFF6FF !important', 
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#DBEAFE !important' }
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': { color: '#94A3B8' },
                  '& .MuiAutocomplete-clearIndicator': { color: '#94A3B8' }
                }}
              />
            </Box>

            {/* Home/Apartment */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Home/Apartment
              </Typography>
              <TextField
                value={formData.homeApartment}
                onChange={(e) => setFormData({ ...formData, homeApartment: e.target.value })}
                fullWidth
                placeholder="Enter home or apartment"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                    fontSize: '0.95rem',
                    '& fieldset': {
                      borderColor: '#E2E8F0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#CBD5E1'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Box>

            {/* Country */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                Country
              </Typography>
              <Autocomplete
                value={formData.country || null}
                onChange={(event, newValue) => setFormData({ ...formData, country: newValue || '' })}
                options={[
                  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
                  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
                  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
                  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
                  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
                  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
                  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji',
                  'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
                  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
                  'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
                  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
                  'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
                  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
                  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
                  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
                  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea',
                  'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
                  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
                  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
                  'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
                  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
                  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
                  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
                  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
                  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
                ]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search and select country"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#F8FAFC',
                        fontSize: '0.95rem',
                        '& fieldset': {
                          borderColor: '#E2E8F0'
                        },
                        '&:hover fieldset': {
                          borderColor: '#CBD5E1'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563EB',
                          borderWidth: '2px'
                        }
                      }
                    }}
                  />
                )}
                ListboxProps={{
                  sx: {
                    maxHeight: 300,
                    '& .MuiAutocomplete-option': {
                      fontSize: '0.95rem',
                      py: 1.5,
                      '&:hover': { bgcolor: '#F8FAFC' },
                      '&[aria-selected="true"]': { 
                        bgcolor: '#EFF6FF !important', 
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#DBEAFE !important' }
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': { color: '#94A3B8' },
                  '& .MuiAutocomplete-clearIndicator': { color: '#94A3B8' }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, pt: 3, gap: 2, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
          <Button 
            onClick={() => setOpenAddDialog(false)} 
            variant="outlined" 
            sx={{ 
              borderRadius: '12px', 
              textTransform: 'none', 
              px: 4,
              py: 1.25,
              fontSize: '1rem',
              fontWeight: 600,
              borderColor: '#CBD5E1',
              color: '#64748B',
              '&:hover': {
                borderColor: '#94A3B8',
                bgcolor: '#FFFFFF'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained" 
            sx={{ 
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              borderRadius: '12px', 
              textTransform: 'none', 
              px: 4,
              py: 1.25,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
              }
            }}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>


      {/* Edit User Dialog — Professional Large */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.22)'
          }
        }}
      >
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          px: 4, py: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: '14px',
              background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37,99,235,0.45)'
            }}>
              <EditIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1.2rem', lineHeight: 1.2 }}>
                Edit User
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.3 }}>
                Update user information and permissions
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setOpenEditDialog(false)}
            sx={{ color: '#94A3B8', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0, bgcolor: '#F8FAFC' }}>
          {/* User Avatar Strip */}
          {selectedUser && (
            <Box sx={{
              px: 4, py: 2.5,
              bgcolor: '#fff',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', gap: 2
            }}>
              <Avatar sx={{
                width: 52, height: 52,
                bgcolor: '#EFF6FF', color: '#2563EB',
                fontWeight: 800, fontSize: '1.2rem',
                border: '2px solid #BFDBFE'
              }}>
                {selectedUser.avatar}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>
                  {selectedUser.name}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                  ID: #{selectedUser.userId} · {selectedUser.email}
                </Typography>
              </Box>
            </Box>
          )}

          <Box sx={{ p: 4 }}>
            {/* Section: Personal Info */}
            <Typography sx={{
              fontSize: '0.7rem', fontWeight: 800, color: '#6366F1',
              textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2,
              display: 'flex', alignItems: 'center', gap: 0.5
            }}>
              <PeopleIcon sx={{ fontSize: 14 }} /> Personal Information
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 3.5 }}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', fontSize: '0.95rem' } }}
              />
              <TextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', fontSize: '0.95rem' } }}
              />
              <TextField
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', fontSize: '0.95rem' } }}
              />
            </Box>

            {/* Divider */}
            <Box sx={{ borderTop: '1px dashed #E2E8F0', mb: 3.5 }} />

            {/* Section: Account Settings */}
            <Typography sx={{
              fontSize: '0.7rem', fontWeight: 800, color: '#6366F1',
              textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2,
              display: 'flex', alignItems: 'center', gap: 0.5
            }}>
              <LockIcon sx={{ fontSize: 14 }} /> Account Settings
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2.5 }}>
              {/* Role */}
              <Box>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', mb: 1 }}>Role</Typography>
                <Select
                  fullWidth
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  sx={{
                    borderRadius: '12px', bgcolor: '#fff', fontSize: '0.9rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' }
                  }}
                >
                  <MenuItem value="Admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EF4444' }} />Admin
                    </Box>
                  </MenuItem>
                  <MenuItem value="User">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2563EB' }} />User
                    </Box>
                  </MenuItem>
                  <MenuItem value="Tailor Shop">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B' }} />Tailor Shop
                    </Box>
                  </MenuItem>
                </Select>
              </Box>

              {/* Type */}
              <Box>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', mb: 1 }}>Type</Typography>
                <Select
                  fullWidth
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  sx={{
                    borderRadius: '12px', bgcolor: '#fff', fontSize: '0.9rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' }
                  }}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="tailor">Tailor</MenuItem>
                </Select>
              </Box>

              {/* Status */}
              <Box>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', mb: 1 }}>Status</Typography>
                <Select
                  fullWidth
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  sx={{
                    borderRadius: '12px', bgcolor: '#fff', fontSize: '0.9rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' }
                  }}
                >
                  <MenuItem value="active">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22C55E' }} />Active
                    </Box>
                  </MenuItem>
                  <MenuItem value="inactive">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8' }} />Inactive
                    </Box>
                  </MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* Footer */}
        <Box sx={{
          px: 4, py: 2.5,
          bgcolor: '#fff',
          borderTop: '1px solid #E2E8F0',
          display: 'flex', justifyContent: 'flex-end', gap: 1.5
        }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{
              textTransform: 'none', fontWeight: 700, color: '#64748B',
              bgcolor: '#F1F5F9', borderRadius: '12px', px: 4, py: 1.25,
              fontSize: '0.95rem',
              '&:hover': { bgcolor: '#E2E8F0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditUser}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              textTransform: 'none', fontWeight: 700, borderRadius: '12px',
              px: 4, py: 1.25, fontSize: '0.95rem',
              background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              '&:hover': { background: 'linear-gradient(135deg,#1D4ED8,#1E40AF)' }
            }}
          >
            Update User
          </Button>
        </Box>
      </Dialog>

      {/* View User Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          } 
        }}
      >
        <DialogTitle sx={{ pb: 0, pt: 3, px: 4, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>
              User Details
            </Typography>
            <IconButton 
              onClick={() => setOpenViewDialog(false)} 
              size="small"
              sx={{
                color: '#64748B',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3, pb: 2 }}>
          {selectedUser && (
            <Box>
              {/* User Profile Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 3, 
                mb: 4, 
                p: 3, 
                bgcolor: '#F8FAFC', 
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: '#EFF6FF', 
                  color: '#2563EB', 
                  fontSize: '2rem', 
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                }}>
                  {selectedUser.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
                    {selectedUser.name}
                  </Typography>
                  <Chip 
                    label={selectedUser.role} 
                    size="medium" 
                    sx={{ 
                      bgcolor: '#EFF6FF', 
                      color: '#2563EB', 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      height: 32,
                      borderRadius: '8px'
                    }} 
                  />
                </Box>
              </Box>

              {/* User Information Grid */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    User ID
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '1.125rem' }}>
                    #{selectedUser.userId}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Email
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '1.125rem' }}>
                    {selectedUser.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Phone
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '1.125rem' }}>
                    {selectedUser.phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Type
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '1.125rem', textTransform: 'capitalize' }}>
                    {selectedUser.type}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Status
                  </Typography>
                  <Chip 
                    label={selectedUser.status === 'active' ? 'Active' : 'Inactive'} 
                    size="medium" 
                    sx={{ 
                      bgcolor: selectedUser.status === 'active' ? '#ECFDF5' : '#FEE2E2', 
                      color: selectedUser.status === 'active' ? '#10B981' : '#EF4444', 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      height: 32,
                      borderRadius: '8px'
                    }} 
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Last Login
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '1.125rem' }}>
                    {selectedUser.lastLogin}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, pt: 3, gap: 2, bgcolor: '#FFFFFF' }}>
          <Button 
            onClick={() => setOpenViewDialog(false)} 
            variant="outlined" 
            sx={{ 
              borderRadius: '12px', 
              textTransform: 'none', 
              px: 4,
              py: 1.25,
              fontSize: '1rem',
              fontWeight: 600,
              borderColor: '#E2E8F0',
              color: '#64748B',
              '&:hover': {
                borderColor: '#CBD5E1',
                bgcolor: '#F8FAFC'
              }
            }}
          >
            Close
          </Button>
          <Button 
            onClick={() => { setOpenViewDialog(false); openEdit(selectedUser); }} 
            variant="contained" 
            startIcon={<EditIcon />}
            sx={{ 
              bgcolor: '#2563EB', 
              borderRadius: '12px', 
              textTransform: 'none', 
              px: 4,
              py: 1.25,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              '&:hover': { 
                bgcolor: '#1D4ED8',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)'
              }
            }}
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#FEE2E2', color: '#EF4444', width: 56, height: 56, mb: 2 }}>
              <DeleteIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#EF4444' }}>Delete User</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#1E293B', mb: 1 }}>
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', px: 3 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: '10px', textTransform: 'none', px: 3 }}
          >
            Delete
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

      {/* ── Suspend User Dialog ── */}
      <Dialog open={openSuspendDialog} onClose={() => setOpenSuspendDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <BlockIcon sx={{ fontSize: 32, color: '#d97706' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Suspend User?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, textAlign: 'center' }}>
          <Typography sx={{ color: '#475569', lineHeight: 1.7 }}>
            Are you sure you want to suspend <strong>{suspendUser?.name}</strong>?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#fef3c7', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 500 }}>
              ⚠️ This will immediately log out the user and terminate all their active sessions.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'center', gap: 1.5 }}>
          <Button onClick={() => setOpenSuspendDialog(false)} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 600, borderColor: '#e2e8f0', color: '#64748b' }}>
            Cancel
          </Button>
          <Button onClick={handleSuspendUser} disabled={suspending} variant="contained"
            sx={{ borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 700, bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, boxShadow: 'none' }}>
            {suspending ? 'Suspending...' : 'Yes, Suspend'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Users;
