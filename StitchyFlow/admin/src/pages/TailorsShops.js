import React, { useState } from 'react';
import { Box, Typography, Card, Grid, Avatar, Chip, IconButton, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Switch } from '@mui/material';
import { Search as SearchIcon, Store as StoreIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Close as CloseIcon, Business as BusinessIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

function TailorsShops() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newShop, setNewShop] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    website: '',
    description: '',
    specialization: '',
    yearsInBusiness: '',
    numberOfEmployees: '',
    workingHours: '',
    isActive: true,
    acceptsOnlineOrders: true
  });

  // Sample data - will be replaced with API data
  const shops = [];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewShop({
      name: '',
      owner: '',
      email: '',
      phone: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      businessType: '',
      registrationNumber: '',
      taxId: '',
      website: '',
      description: '',
      specialization: '',
      yearsInBusiness: '',
      numberOfEmployees: '',
      workingHours: '',
      isActive: true,
      acceptsOnlineOrders: true
    });
  };

  const handleInputChange = (field, value) => {
    setNewShop({ ...newShop, [field]: value });
  };

  const handleAddShop = () => {
    // TODO: Add API call to save shop
    console.log('Adding shop:', newShop);
    handleCloseDialog();
  };

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
            Tailors Shops
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Manage all registered tailor shops
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            bgcolor: '#1976d2',
            borderRadius: '10px',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          Add New Shop
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Total Shops
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Active Shops
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Inactive Shops
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
            Total Records
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
            0
          </Typography>
        </Card>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by shop name, owner, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fff',
              '& fieldset': { borderColor: '#2563EB', borderWidth: '2px' }
            }
          }}
        />
      </Box>

      {/* Shops Grid */}
      <Grid container spacing={3}>
        {shops.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 8, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <StoreIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="body1" sx={{ color: '#999' }}>
                No tailor shops found
              </Typography>
            </Card>
          </Grid>
        ) : (
          shops.map((shop) => (
            <Grid item xs={12} sm={6} md={4} key={shop.id}>
              <Card sx={{ p: 3, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: '#1976d2', mr: 2 }}>
                    <StoreIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                      {shop.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {shop.owner}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  📍 {shop.location}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  📞 {shop.phone}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={shop.status} 
                    size="small"
                    sx={{ 
                      bgcolor: shop.status === 'Active' ? '#E8F5E9' : '#FFF3E0',
                      color: shop.status === 'Active' ? '#388E3C' : '#F57C00',
                      fontWeight: 600
                    }}
                  />
                  <Box>
                    <IconButton size="small" sx={{ color: '#1976d2' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#f44336' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add Shop Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '2px solid #e8eaed',
          pb: 2.5,
          pt: 3,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#f8f9fa'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BusinessIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
                Add New Tailor Shop
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Fill in the details to register a new tailor shop
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: '#666' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, px: 4, pb: 2 }}>
          {/* Basic Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#1976d2', borderRadius: 1 }} />
              Basic Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shop Name *"
                  placeholder="Enter shop name"
                  value={newShop.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Owner Name *"
                  placeholder="Enter owner name"
                  value={newShop.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  placeholder="shop@example.com"
                  value={newShop.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  placeholder="+1 (555) 000-0000"
                  value={newShop.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone"
                  placeholder="+1 (555) 000-0000"
                  value={newShop.alternatePhone}
                  onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  placeholder="https://www.example.com"
                  value={newShop.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Address Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#1976d2', borderRadius: 1 }} />
              Address Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address *"
                  placeholder="Enter complete address"
                  value={newShop.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City *"
                  placeholder="Enter city"
                  value={newShop.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  placeholder="Enter state"
                  value={newShop.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country *"
                  placeholder="Enter country"
                  value={newShop.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP/Postal Code"
                  placeholder="Enter ZIP code"
                  value={newShop.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Business Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#1976d2', borderRadius: 1 }} />
              Business Details
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={newShop.businessType}
                    label="Business Type"
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="partnership">Partnership</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="corporation">Corporation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={newShop.specialization}
                    label="Specialization"
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="mens">Men's Tailoring</MenuItem>
                    <MenuItem value="womens">Women's Tailoring</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                    <MenuItem value="alterations">Alterations Only</MenuItem>
                    <MenuItem value="custom">Custom Design</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  placeholder="Business registration number"
                  value={newShop.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax ID / GST Number"
                  placeholder="Tax identification number"
                  value={newShop.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Years in Business"
                  type="number"
                  placeholder="0"
                  value={newShop.yearsInBusiness}
                  onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Number of Employees"
                  type="number"
                  placeholder="0"
                  value={newShop.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Working Hours"
                  placeholder="9 AM - 6 PM"
                  value={newShop.workingHours}
                  onChange={(e) => handleInputChange('workingHours', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  placeholder="Brief description about the shop and services"
                  value={newShop.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Settings Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#1976d2', borderRadius: 1 }} />
              Shop Settings
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: '10px' }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={newShop.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' } }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                          Active Status
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Shop is active and visible to customers
                        </Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: '10px' }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={newShop.acceptsOnlineOrders}
                        onChange={(e) => handleInputChange('acceptsOnlineOrders', e.target.checked)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' } }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                          Accept Online Orders
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Shop can receive orders online
                        </Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          borderTop: '2px solid #e8eaed',
          p: 3,
          px: 4,
          gap: 2,
          bgcolor: '#f8f9fa'
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#ddd',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.2,
              borderRadius: '10px',
              '&:hover': { 
                bgcolor: '#f5f5f5',
                borderColor: '#999'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddShop}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#1976d2',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.2,
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': { 
                bgcolor: '#1565c0',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
              }
            }}
          >
            Add Shop
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default TailorsShops;
