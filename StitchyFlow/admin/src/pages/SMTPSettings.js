import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, TextField, Button, Switch, FormControlLabel,
  Grid, Alert, CircularProgress, Divider, Paper
} from '@mui/material';
import {
  Email as EmailIcon, Save as SaveIcon, Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

function SMTPSettings() {
  const [formData, setFormData] = useState({
    server_address: 'smtp.gmail.com',
    username: 'mkbytecoder14@gmail.com',
    password: 'rmxd crjy kiqj ulfs',
    port: 465,
    encryption: 'SSL',
    authentication_required: true
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    fetchSMTPSettings();
  }, []);

  const fetchSMTPSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/smtp/full`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setFormData({
            server_address: result.data.server_address || '',
            username: result.data.username || '',
            password: result.data.password || '',
            port: result.data.port || 465,
            encryption: result.data.encryption || 'SSL',
            authentication_required: result.data.authentication_required !== false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching SMTP settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/smtp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(result.message || 'SMTP settings saved successfully');
        setMessageType('success');
        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage(result.error?.message || 'Failed to save SMTP settings');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      setMessage('Network error: Unable to save settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/smtp/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(result.message || 'SMTP connection test successful');
        setMessageType('success');
        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage(result.error?.message || 'SMTP connection test failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error testing SMTP connection:', error);
      setMessage('Network error: Unable to test connection');
      setMessageType('error');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Administration - SMTP Settings">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={50} sx={{ color: '#2196F3' }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Administration - SMTP Settings">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <EmailIcon sx={{ fontSize: 32, color: '#fff' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 700 }}>
                    SMTP Settings
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Configure email server settings for notifications
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {message && (
                <Alert 
                  severity={messageType} 
                  sx={{ mb: 3, borderRadius: '12px' }}
                  onClose={() => setMessage(null)}
                >
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="SMTP Server Address"
                      name="server_address"
                      value={formData.server_address}
                      onChange={handleChange}
                      required
                      placeholder="smtp.gmail.com"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username / Email"
                      name="username"
                      type="email"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="your-email@gmail.com"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Password / App Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password or app password"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Port"
                      name="port"
                      type="number"
                      value={formData.port}
                      onChange={handleChange}
                      required
                      placeholder="465"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Encryption Method"
                      name="encryption"
                      value={formData.encryption}
                      onChange={handleChange}
                      required
                      select
                      SelectProps={{ native: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      <option value="SSL">SSL</option>
                      <option value="TLS">TLS</option>
                      <option value="None">None</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.authentication_required}
                          onChange={handleChange}
                          name="authentication_required"
                          color="primary"
                        />
                      }
                      label="Authentication Required"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 500,
                          color: '#1a1a2e'
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTestConnection}
                    disabled={testing || saving}
                    startIcon={testing ? <CircularProgress size={20} /> : <RefreshIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#2196F3',
                      color: '#2196F3'
                    }}
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a1a2e' }}>
              Configuration Guide
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#2196F3' }}>
                Gmail SMTP Settings
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Server: smtp.gmail.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Port (SSL): 465
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Port (TLS): 587
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#2196F3' }}>
                Important Notes
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                • Use App Password for Gmail accounts with 2FA enabled
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                • Enable "Less secure apps" for accounts without 2FA
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                • Test connection before saving to verify settings
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ 
            p: 3, 
            mt: 2,
            borderRadius: '16px', 
            background: '#e8f5e9',
            border: '1px solid rgba(76, 175, 80, 0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckCircleIcon sx={{ color: '#4CAF50' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                Current Status
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              SMTP settings are configured and ready to use for sending email notifications.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default SMTPSettings;
