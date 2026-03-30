import React, { useEffect, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Tooltip, Pagination, Avatar, Snackbar, Alert, InputAdornment,
  Grid, Card, CardContent, Divider, useTheme, useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as ViewIcon, Search as SearchIcon,
  FilterList as FilterIcon, People as PeopleIcon,
  Email as EmailIcon, Phone as PhoneIcon, Refresh as RefreshIcon,
  Close as CloseIcon, CheckCircle as ActiveIcon, Cancel as InactiveIcon
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';

/**
 * Users Management Page
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const roleColors = {
  admin: { bg: '#E3F2FD', color: '#1976d2' },
  customer: { bg: '#E8F5E9', color: '#2e7d32' },
  tailor: { bg: '#FFF3E0', color: '#f57c00' },
  business_owner: { bg: '#F3E5F5', color: '#7b1fa2' }
};

const roleLabels = {
  admin: 'Admin',
  customer: 'Customer',
  tailor: 'Tailor',
  business_owner: 'Business Owner'
};

function Users() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Data states
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'customer',
    is_active: true,
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {}
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search or filters change
  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Calculate stats
  useEffect(() => {
    calculateStats();
  }, [users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showNotification('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        (user.full_name?.toLowerCase().includes(query)) ||
        (user.email?.toLowerCase().includes(query)) ||
        (user.phone_number?.toLowerCase().includes(query))
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
    setPage(1);
  };

  const calculateStats = () => {
    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const inactive = users.filter(u => !u.is_active).length;
    const byRole = {};

    users.forEach(user => {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
    });

    setStats({ total, active, inactive, byRole });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  // Add User Handlers
  const handleOpenAddModal = () => {
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      role: 'customer',
      is_active: true,
      password: ''
    });
    setFormErrors({});
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleAddUser = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_URL}/admin/users`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showNotification('User created successfully', 'success');
        handleCloseAddModal();
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      showNotification(error.response?.data?.error?.message || 'Failed to create user', 'error');
    }
  };

  // Edit User Handlers
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      role: user.role || 'customer',
      is_active: user.is_active || false,
      password: ''
    });
    setFormErrors({});
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async () => {
    const errors = validateForm(true);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_URL}/admin/users/${selectedUser.user_id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification('User updated successfully', 'success');
        handleCloseEditModal();
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      showNotification(error.response?.data?.error?.message || 'Failed to update user', 'error');
    }
  };

  // View User Handler
  const handleOpenViewModal = (user) => {
    setSelectedUser(user);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedUser(null);
  };

  // Delete User Handlers
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `${API_URL}/admin/users/${selectedUser.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification('User deleted successfully', 'success');
        handleCloseDeleteDialog();
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      showNotification(error.response?.data?.error?.message || 'Failed to delete user', 'error');
    }
  };

  // Form validation
  const validateForm = (isEdit = false) => {
    const errors = {};

    if (!formData.full_name?.trim()) {
      errors.full_name = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.role) {
      errors.role = 'Role is required';
    }

    if (!isEdit && !formData.password?.trim()) {
      errors.password = 'Password is required for new users';
    } else if (!isEdit && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleFormChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Pagination calculation
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const renderUserForm = (isEdit = false) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.full_name}
          onChange={handleFormChange('full_name')}
          error={!!formErrors.full_name}
          helperText={formErrors.full_name}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleFormChange('email')}
          error={!!formErrors.email}
          helperText={formErrors.email}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Phone Number"
          value={formData.phone_number}
          onChange={handleFormChange('phone_number')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!formErrors.role}>
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            onChange={handleFormChange('role')}
            label="Role"
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="tailor">Tailor</MenuItem>
            <MenuItem value="business_owner">Business Owner</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.is_active}
            onChange={handleFormChange('is_active')}
            label="Status"
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {!isEdit && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleFormChange('password')}
            error={!!formErrors.password}
            helperText={formErrors.password || 'Minimum 6 characters'}
            required={!isEdit}
          />
        </Grid>
      )}
    </Grid>
  );

  return (
    <Layout title="Users Management">
      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Total Users</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#E3F2FD', color: '#1976d2' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Active Users</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    {stats.active}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#E8F5E9', color: '#2e7d32' }}>
                  <ActiveIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Inactive Users</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#c62828' }}>
                    {stats.inactive}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FFEBEE', color: '#c62828' }}>
                  <InactiveIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Customers</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f57c00' }}>
                    {stats.byRole.customer || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FFF3E0', color: '#f57c00' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Paper sx={{
        p: 2,
        mb: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexGrow: 1 }}>
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="tailor">Tailor</MenuItem>
                <MenuItem value="business_owner">Business Owner</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                variant="outlined"
                size="small"
                onClick={clearFilters}
                startIcon={<CloseIcon />}
              >
                Clear
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              size="small"
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
              size="small"
              sx={{
                bgcolor: '#2196F3',
                '&:hover': { bgcolor: '#1976d2' }
              }}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper sx={{
        bgcolor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', py: 2, textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.user_id}
                    hover
                    sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: roleColors[user.role]?.bg || '#E3F2FD', color: roleColors[user.role]?.color || '#1976d2' }}>
                          {(user.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                            {user.full_name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            ID: #{user.user_id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#1a1a2e' }}>
                          {user.email}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {user.phone_number || 'No phone'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={roleLabels[user.role] || user.role}
                        size="small"
                        sx={{
                          bgcolor: roleColors[user.role]?.bg || '#E3F2FD',
                          color: roleColors[user.role]?.color || '#1976d2',
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: user.is_active ? '#E8F5E9' : '#FFEBEE',
                          color: user.is_active ? '#2e7d32' : '#c62828',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenViewModal(user)}
                            sx={{ color: '#2196F3' }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditModal(user)}
                            sx={{ color: '#FF9800' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(user)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">
                      {loading ? 'Loading...' : 'No users found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" color="textSecondary">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </Paper>

      {/* Add User Modal */}
      <Dialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Add New User</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderUserForm(false)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAddModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976d2' } }}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Edit User</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderUserForm(true)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEditModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976d2' } }}
          >
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Modal */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>User Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: roleColors[selectedUser.role]?.bg || '#E3F2FD',
                    color: roleColors[selectedUser.role]?.color || '#1976d2',
                    fontSize: '1.5rem'
                  }}
                >
                  {(selectedUser.full_name?.[0] || selectedUser.email?.[0] || 'U').toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedUser.full_name || 'N/A'}
                  </Typography>
                  <Chip
                    label={roleLabels[selectedUser.role] || selectedUser.role}
                    size="small"
                    sx={{
                      bgcolor: roleColors[selectedUser.role]?.bg || '#E3F2FD',
                      color: roleColors[selectedUser.role]?.color || '#1976d2',
                      fontWeight: 500
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">User ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>#{selectedUser.user_id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedUser.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      bgcolor: selectedUser.is_active ? '#E8F5E9' : '#FFEBEE',
                      color: selectedUser.is_active ? '#2e7d32' : '#c62828',
                      fontWeight: 500
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.phone_number || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Created At</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleString()
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Updated At</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.updated_at
                      ? new Date(selectedUser.updated_at).toLocaleString()
                      : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseViewModal} variant="outlined">
            Close
          </Button>
          <Button
            onClick={() => {
              handleCloseViewModal();
              handleOpenEditModal(selectedUser);
            }}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976d2' } }}
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#c62828' }}>
            Delete User
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete <strong>{selectedUser?.full_name}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This action cannot be undone. The user will be permanently removed from the system.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default Users;
