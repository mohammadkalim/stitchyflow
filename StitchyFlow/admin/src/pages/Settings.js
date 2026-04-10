import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Chip, Divider, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Button
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  CreditCard as PaymentsIcon,
  People as UsersIcon,
  Business as BusinessIcon,
  Storage as DatabaseIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  TableChart as TableChartIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  VerifiedUser as VerifiedUserIcon,
  Block as BlockIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Store as StoreIcon,
  Percent as PercentIcon,
  Approval as ApprovalIcon,
  Timer as TimerIcon,
  Share as ShareIcon,
  PrivacyTip as PrivacyTipIcon,
} from '@mui/icons-material';
import SocialMediaSettings from './SocialMediaSettings';
import PrivacyEdit from './PrivacyEdit';
import Layout from '../components/Layout';
import axios from 'axios';
import { api } from '../utils/api';

const NAV_ITEMS = [
  { key: 'general',       label: 'General',       icon: <SettingsIcon fontSize="small" /> },
  { key: 'security',      label: 'Security',      icon: <SecurityIcon fontSize="small" /> },
  { key: 'notifications', label: 'Notifications', icon: <NotificationsIcon fontSize="small" /> },
  { key: 'payments',      label: 'Payments',      icon: <PaymentsIcon fontSize="small" /> },
  { key: 'social_media',  label: 'Social Media',  icon: <ShareIcon fontSize="small" /> },
  { key: 'database',      label: 'Database',      icon: <DatabaseIcon fontSize="small" /> },
  { key: 'privacy_edit',  label: 'Privacy & Pages', icon: <PrivacyTipIcon fontSize="small" /> },
];


function GeneralPanel({ settings, onChange }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1a1a2e' }}>
        General Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Site Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={settings.site_name}
            onChange={(e) => onChange('site_name', e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Admin Email
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="email"
            value={settings.admin_email}
            onChange={(e) => onChange('admin_email', e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Site Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={settings.site_description}
            onChange={(e) => onChange('site_description', e.target.value)}
            sx={inputSx}
          />
        </Grid>

      </Grid>

    </Box>
  );
}

function SecurityPanel() {
  const [sec, setSec] = useState({
    two_factor_auth: false,
    force_https: true,
    password_expiry: false,
    login_alerts: true,
    ip_whitelist: false,
    brute_force_protection: true,
    session_invalidate_on_logout: true,
    audit_logging: true,
    min_password_length: '8',
    password_expiry_days: '90',
    allowed_ips: '',
  });

  const toggle = (key) => setSec(prev => ({ ...prev, [key]: !prev[key] }));
  const set = (key, val) => setSec(prev => ({ ...prev, [key]: val }));

  const toggleRows = [
    {
      icon: <LockIcon sx={{ color: '#2196F3', fontSize: 20 }} />,
      label: 'Two-Factor Authentication',
      sub: 'Require 2FA for all admin accounts',
      key: 'two_factor_auth',
    },
    {
      icon: <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />,
      label: 'Force HTTPS',
      sub: 'Redirect all HTTP traffic to HTTPS',
      key: 'force_https',
    },
    {
      icon: <LockIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,
      label: 'Password Expiry',
      sub: 'Force users to reset password periodically',
      key: 'password_expiry',
    },
    {
      icon: <NotificationsIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />,
      label: 'Login Alerts',
      sub: 'Email users on new login from unknown device',
      key: 'login_alerts',
    },
    {
      icon: <BlockIcon sx={{ color: '#ef4444', fontSize: 20 }} />,
      label: 'Brute Force Protection',
      sub: 'Lock account after repeated failed login attempts',
      key: 'brute_force_protection',
    },
    {
      icon: <VerifiedUserIcon sx={{ color: '#2196F3', fontSize: 20 }} />,
      label: 'Invalidate Sessions on Logout',
      sub: 'Destroy all active sessions when user logs out',
      key: 'session_invalidate_on_logout',
    },
    {
      icon: <TableChartIcon sx={{ color: '#6b7280', fontSize: 20 }} />,
      label: 'Audit Logging',
      sub: 'Log all admin actions for security review',
      key: 'audit_logging',
    },
    {
      icon: <AdminPanelSettingsIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,
      label: 'IP Whitelist',
      sub: 'Restrict admin panel access to specific IPs',
      key: 'ip_whitelist',
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a1a2e' }}>
        Security Settings
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
        Manage authentication, access control and security policies
      </Typography>

      {/* Toggle Rows */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', mb: 4 }}>
        {toggleRows.map((row, idx) => (
          <Box key={row.key} sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 2.5, py: 1.8,
            borderBottom: idx < toggleRows.length - 1 ? '1px solid #f3f4f6' : 'none',
            '&:hover': { bgcolor: '#fafafa' },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {row.icon}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>{row.label}</Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>{row.sub}</Typography>
              </Box>
            </Box>
            <Switch
              checked={sec[row.key]}
              onChange={() => toggle(row.key)}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196F3' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2196F3' },
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Password & IP Settings */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>
        Password Policy
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Minimum Password Length
          </Typography>
          <TextField fullWidth size="small" type="number"
            value={sec.min_password_length}
            onChange={(e) => set('min_password_length', e.target.value)}
            sx={inputSx} inputProps={{ min: 6, max: 32 }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Password Expiry (days)
          </Typography>
          <TextField fullWidth size="small" type="number"
            value={sec.password_expiry_days}
            onChange={(e) => set('password_expiry_days', e.target.value)}
            disabled={!sec.password_expiry}
            sx={inputSx} inputProps={{ min: 1, max: 365 }} />
        </Grid>
        {sec.ip_whitelist && (
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
              Allowed IP Addresses (comma separated)
            </Typography>
            <TextField fullWidth size="small" multiline rows={2}
              placeholder="e.g. 192.168.1.1, 10.0.0.1"
              value={sec.allowed_ips}
              onChange={(e) => set('allowed_ips', e.target.value)}
              sx={inputSx} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
const DB_TABLES = [
  { name: 'users',                rows: '—', engine: 'InnoDB', description: 'Platform users (admin, tailor, customer, business_owner)' },
  { name: 'businesses',           rows: '—', engine: 'InnoDB', description: 'Registered business profiles' },
  { name: 'tailors',              rows: '—', engine: 'InnoDB', description: 'Tailor profiles linked to users' },
  { name: 'customers',            rows: '—', engine: 'InnoDB', description: 'Customer profiles linked to users' },
  { name: 'orders',               rows: '—', engine: 'InnoDB', description: 'Tailoring orders with status tracking' },
  { name: 'measurements',         rows: '—', engine: 'InnoDB', description: 'Customer body measurements per order' },
  { name: 'payments',             rows: '—', engine: 'InnoDB', description: 'Payment records for orders' },
  { name: 'reviews',              rows: '—', engine: 'InnoDB', description: 'Customer reviews for tailors' },
  { name: 'notifications',        rows: '—', engine: 'InnoDB', description: 'In-app notifications for users' },
  { name: 'order_status_history', rows: '—', engine: 'InnoDB', description: 'Audit trail of order status changes' },
  { name: 'audit_logs',           rows: '—', engine: 'InnoDB', description: 'System-wide audit log' },
  { name: 'refresh_tokens',       rows: '—', engine: 'InnoDB', description: 'JWT refresh token store' },
  { name: 'email_verification_codes', rows: '—', engine: 'InnoDB', description: 'Email verification codes for registration' },
  { name: 'password_reset_tokens',    rows: '—', engine: 'InnoDB', description: 'Password reset tokens' },
  { name: 'system_settings',          rows: '—', engine: 'InnoDB', description: 'System configuration settings' },
  { name: 'smtp_settings',            rows: '—', engine: 'InnoDB', description: 'SMTP configuration settings' },
];

function DatabasePanel() {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a1a2e' }}>
        Database Settings
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
        Database connection details and table overview
      </Typography>

      {/* Connection Info Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { icon: <LinkIcon sx={{ color: '#2196F3', fontSize: 20 }} />,   label: 'Host',     value: 'localhost:3306' },
          { icon: <DatabaseIcon sx={{ color: '#10b981', fontSize: 20 }} />, label: 'Database', value: 'stitchyflow' },
          { icon: <PersonIcon sx={{ color: '#f59e0b', fontSize: 20 }} />,  label: 'Username', value: 'root' },
          { icon: <LockIcon sx={{ color: '#ef4444', fontSize: 20 }} />,    label: 'Password', value: '••••••••••' },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Box sx={{
              p: 2, border: '1px solid #e5e7eb', borderRadius: '10px',
              bgcolor: '#fafafa', display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              {item.icon}
              <Box>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e', fontFamily: 'monospace' }}>
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Status Row */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        p: 2, mb: 4, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: '10px',
      }}>
        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: '#065f46', fontWeight: 500 }}>
          Database connection active — MySQL 8.0 · Charset: utf8mb4 · Collation: utf8mb4_unicode_ci
        </Typography>
      </Box>

      {/* phpMyAdmin Link */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        p: 2, mb: 4, bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
        borderRadius: '10px',
      }}>
        <LinkIcon sx={{ color: '#2196F3', fontSize: 18 }} />
        <Typography variant="body2" sx={{ color: '#1e40af', fontWeight: 500 }}>
          phpMyAdmin:&nbsp;
          <Box component="a" href="http://localhost:8080/phpmyadmin" target="_blank" rel="noreferrer"
            sx={{ color: '#2196F3', textDecoration: 'underline', fontFamily: 'monospace' }}>
            http://localhost:8080/phpmyadmin
          </Box>
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Tables Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TableChartIcon sx={{ color: '#2196F3', fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
          Database Tables
        </Typography>
        <Chip label={`${DB_TABLES.length} tables`} size="small"
          sx={{ bgcolor: '#eff6ff', color: '#2196F3', fontWeight: 600, fontSize: '0.7rem' }} />
      </Box>

      {/* Table List */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
        {/* Table Header */}
        <Box sx={{
          display: 'grid', gridTemplateColumns: '2fr 3fr 1fr',
          px: 2, py: 1.2, bgcolor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {['Table Name', 'Description', 'Engine'].map((h) => (
            <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Table Rows */}
        {DB_TABLES.map((table, idx) => (
          <Box key={table.name} sx={{
            display: 'grid', gridTemplateColumns: '2fr 3fr 1fr',
            px: 2, py: 1.4,
            borderBottom: idx < DB_TABLES.length - 1 ? '1px solid #f3f4f6' : 'none',
            '&:hover': { bgcolor: '#f9fafb' },
            transition: 'background 0.1s',
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {table.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
              {table.description}
            </Typography>
            <Chip label={table.engine} size="small"
              sx={{ bgcolor: '#eff6ff', color: '#2196F3', fontWeight: 500, fontSize: '0.68rem', height: 20, width: 'fit-content' }} />
          </Box>
        ))}
      </Box>

      {/* Summary Footer */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[
          { label: 'Tables',            count: DB_TABLES.length },
          { label: 'Stored Procedures', count: 8 },
          { label: 'Functions',         count: 4 },
          { label: 'Views',             count: 4 },
          { label: 'Triggers',          count: 4 },
        ].map((item) => (
          <Box key={item.label} sx={{
            px: 2, py: 1, border: '1px solid #e5e7eb', borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: 1,
          }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>{item.label}:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#2196F3' }}>{item.count}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function UsersPanel() {
  const [userSettings, setUserSettings] = useState({
    allow_registration: true,
    email_verification: true,
    auto_approve_customers: true,
    auto_approve_tailors: false,
    max_login_attempts: '5',
    session_timeout: '8',
    default_role: 'customer',
    allow_social_login: false,
    require_phone: false,
    verification_code_expire_minutes: '10',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current setting from backend
    const fetchSetting = async () => {
      try {
        const response = await api.get('/admin/settings/verification-expire');
        if (response.data.success) {
          setUserSettings(prev => ({
            ...prev,
            verification_code_expire_minutes: response.data.data.expireMinutes.toString()
          }));
        }
      } catch (error) {
        console.error('Failed to fetch verification expire setting:', error);
      }
    };
    fetchSetting();
  }, []);

  const toggle = (key) => setUserSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const set = (key, val) => setUserSettings(prev => ({ ...prev, [key]: val }));

  const handleSaveVerificationExpire = async () => {
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('adminToken');
      await api.put('/admin/settings/verification-expire', {
        expireMinutes: parseInt(userSettings.verification_code_expire_minutes)
      });
      setMessage('Verification code expire time saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save: ' + (error.response?.data?.error?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    { icon: <VerifiedUserIcon sx={{ color: '#10b981', fontSize: 20 }} />, label: 'Allow User Registration',      sub: 'Let new users sign up on the platform',          key: 'allow_registration' },
    { icon: <CheckCircleIcon  sx={{ color: '#2196F3', fontSize: 20 }} />, label: 'Email Verification Required',  sub: 'Users must verify email before accessing account', key: 'email_verification' },
    { icon: <AdminPanelSettingsIcon sx={{ color: '#f59e0b', fontSize: 20 }} />, label: 'Auto-Approve Customers', sub: 'Automatically approve new customer accounts',      key: 'auto_approve_customers' },
    { icon: <AdminPanelSettingsIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />, label: 'Auto-Approve Tailors',   sub: 'Automatically approve new tailor accounts',        key: 'auto_approve_tailors' },
    { icon: <BlockIcon        sx={{ color: '#ef4444', fontSize: 20 }} />, label: 'Allow Social Login',           sub: 'Enable Google / Facebook login options',           key: 'allow_social_login' },
    { icon: <PersonIcon       sx={{ color: '#6b7280', fontSize: 20 }} />, label: 'Require Phone Number',         sub: 'Make phone number mandatory during registration',  key: 'require_phone' },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a1a2e' }}>
        User Settings
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
        Configure user registration, verification and access controls
      </Typography>

      {/* Toggle Rows */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', mb: 4 }}>
        {rows.map((row, idx) => (
          <Box key={row.key} sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 2.5, py: 1.8,
            borderBottom: idx < rows.length - 1 ? '1px solid #f3f4f6' : 'none',
            '&:hover': { bgcolor: '#fafafa' },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {row.icon}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>{row.label}</Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>{row.sub}</Typography>
              </Box>
            </Box>
            <Switch
              checked={userSettings[row.key]}
              onChange={() => toggle(row.key)}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196F3' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2196F3' },
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Verification Code Expire Setting */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>
        Verification Code Settings
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Verification Code Expire Time (minutes)
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
            When this time expires, the verification code will be invalid and users must request a new code
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField 
              fullWidth 
              size="small" 
              type="number" 
              value={userSettings.verification_code_expire_minutes}
              onChange={(e) => set('verification_code_expire_minutes', e.target.value)}
              sx={inputSx}
              inputProps={{ min: 1, max: 60 }}
              InputProps={{ 
                startAdornment: <TimerIcon sx={{ fontSize: 16, color: '#9ca3af', mr: 0.5 }} /> 
              }}
            />
            <Button
              variant="contained"
              onClick={handleSaveVerificationExpire}
              disabled={saving}
              sx={{
                bgcolor: '#2196F3',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                minWidth: 100,
                '&:hover': { bgcolor: '#1976d2' }
              }}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
            </Button>
          </Box>
          {message && (
            <Typography variant="caption" sx={{ 
              color: message.includes('Failed') ? '#dc2626' : '#16a34a',
              display: 'block', 
              mt: 1 
            }}>
              {message}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Numeric / Select Settings */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>
        Access & Session
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Max Login Attempts
          </Typography>
          <TextField fullWidth size="small" type="number" value={userSettings.max_login_attempts}
            onChange={(e) => set('max_login_attempts', e.target.value)} sx={inputSx}
            inputProps={{ min: 1, max: 20 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Session Timeout (hours)
          </Typography>
          <TextField fullWidth size="small" type="number" value={userSettings.session_timeout}
            onChange={(e) => set('session_timeout', e.target.value)} sx={inputSx}
            inputProps={{ min: 1, max: 72 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Default Role
          </Typography>
          <FormControl fullWidth size="small">
            <Select value={userSettings.default_role} onChange={(e) => set('default_role', e.target.value)} sx={{ borderRadius: '8px' }}>
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="tailor">Tailor</MenuItem>
              <MenuItem value="business_owner">Business Owner</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

function BusinessesPanel() {
  const [bizSettings, setBizSettings] = useState({
    auto_approve_business: false,
    require_documents: true,
    allow_multiple_shops: true,
    commission_rate: '10',
    min_commission: '2',
    max_commission: '30',
    approval_mode: 'manual',
    allow_business_suspension: true,
    notify_on_new_business: true,
  });

  const toggle = (key) => setBizSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const set = (key, val) => setBizSettings(prev => ({ ...prev, [key]: val }));

  const rows = [
    { icon: <ApprovalIcon  sx={{ color: '#10b981', fontSize: 20 }} />, label: 'Auto-Approve Businesses',      sub: 'Automatically approve new business registrations',    key: 'auto_approve_business' },
    { icon: <VerifiedUserIcon sx={{ color: '#2196F3', fontSize: 20 }} />, label: 'Require Verification Documents', sub: 'Businesses must upload documents for verification', key: 'require_documents' },
    { icon: <StoreIcon     sx={{ color: '#f59e0b', fontSize: 20 }} />, label: 'Allow Multiple Shops',          sub: 'One business owner can manage multiple shops',        key: 'allow_multiple_shops' },
    { icon: <BlockIcon     sx={{ color: '#ef4444', fontSize: 20 }} />, label: 'Allow Business Suspension',     sub: 'Admins can suspend businesses from the panel',        key: 'allow_business_suspension' },
    { icon: <NotificationsIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />, label: 'Notify on New Business',   sub: 'Send admin notification when a new business registers', key: 'notify_on_new_business' },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a1a2e' }}>
        Business Settings
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
        Configure business registration, approval and commission settings
      </Typography>

      {/* Toggle Rows */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', mb: 4 }}>
        {rows.map((row, idx) => (
          <Box key={row.key} sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 2.5, py: 1.8,
            borderBottom: idx < rows.length - 1 ? '1px solid #f3f4f6' : 'none',
            '&:hover': { bgcolor: '#fafafa' },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {row.icon}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a2e' }}>{row.label}</Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>{row.sub}</Typography>
              </Box>
            </Box>
            <Switch
              checked={bizSettings[row.key]}
              onChange={() => toggle(row.key)}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196F3' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2196F3' },
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Commission & Approval Settings */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>
        Commission & Approval
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Default Commission Rate (%)
          </Typography>
          <TextField fullWidth size="small" type="number" value={bizSettings.commission_rate}
            onChange={(e) => set('commission_rate', e.target.value)} sx={inputSx}
            inputProps={{ min: 0, max: 100 }}
            InputProps={{ startAdornment: <PercentIcon sx={{ fontSize: 16, color: '#9ca3af', mr: 0.5 }} /> }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Min Commission (%)
          </Typography>
          <TextField fullWidth size="small" type="number" value={bizSettings.min_commission}
            onChange={(e) => set('min_commission', e.target.value)} sx={inputSx}
            inputProps={{ min: 0, max: 100 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Max Commission (%)
          </Typography>
          <TextField fullWidth size="small" type="number" value={bizSettings.max_commission}
            onChange={(e) => set('max_commission', e.target.value)} sx={inputSx}
            inputProps={{ min: 0, max: 100 }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
            Approval Mode
          </Typography>
          <FormControl fullWidth size="small">
            <Select value={bizSettings.approval_mode} onChange={(e) => set('approval_mode', e.target.value)} sx={{ borderRadius: '8px' }}>
              <MenuItem value="manual">Manual Review</MenuItem>
              <MenuItem value="auto">Automatic</MenuItem>
              <MenuItem value="document">Document Verified</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

function PlaceholderPanel({ label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
      <Typography variant="body1" sx={{ color: '#9ca3af' }}>
        {label} settings coming soon.
      </Typography>
    </Box>
  );
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#fff',
    '&.Mui-focused fieldset': { borderColor: '#2196F3' },
  },
};



function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    site_name: 'StitchyFlow',
    admin_email: 'admin@stitchyflow.com',
    site_description: 'Professional Tailoring Marketplace',
  });

  const handleChange = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => alert('Settings saved successfully!');

  return (
    <Layout title="Settings">
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
            Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            Configure system settings and preferences
          </Typography>
        </Box>
        <Box
          component="button"
          onClick={handleSave}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: '#2196F3', color: '#fff',
            border: 'none', borderRadius: '8px',
            px: 2.5, py: 1.2,
            fontWeight: 600, fontSize: '0.875rem',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#1976d2' },
          }}
        >
          <SaveIcon sx={{ fontSize: 18 }} />
          Save Changes
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Sidebar Nav */}
        <Paper sx={{
          width: { xs: '100%', md: 220 }, flexShrink: 0,
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          overflow: 'hidden',
          p: 1,
        }}>
          <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' }, flexDirection: { xs: 'row', md: 'column' } }}>
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.key;
            return (
              <Box
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  px: 2, py: 1.2,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  mb: { xs: 0, md: 0.5 },
                  mr: { xs: 0.5, md: 0 },
                  bgcolor: active ? '#eff6ff' : 'transparent',
                  color: active ? '#2196F3' : '#374151',
                  borderLeft: { xs: 'none', md: active ? '3px solid #2196F3' : '3px solid transparent' },
                  borderBottom: { xs: active ? '2px solid #2196F3' : '2px solid transparent', md: 'none' },
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: active ? '#eff6ff' : '#f9fafb' },
                  minWidth: { xs: 'auto', md: 'unset' },
                  flex: { xs: '0 0 auto', md: 'unset' },
                }}
              >
                <Box sx={{ color: active ? '#2196F3' : '#9ca3af', display: 'flex' }}>
                  {item.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: active ? 600 : 400, color: 'inherit', whiteSpace: 'nowrap' }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
          </Box>
        </Paper>

        {/* Right Content Panel */}
        <Paper sx={{
          flex: 1,
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          p: 4,
        }}>
          {activeTab === 'general'  && <GeneralPanel settings={settings} onChange={handleChange} />}
          {activeTab === 'security' && <SecurityPanel />}
          {activeTab === 'social_media' && <SocialMediaSettings />}
          {activeTab === 'database' && <DatabasePanel />}
          {activeTab === 'privacy_edit' && <PrivacyEdit />}
          {!['general','security','social_media','database','privacy_edit'].includes(activeTab) && (
            <PlaceholderPanel label={NAV_ITEMS.find(n => n.key === activeTab)?.label} />
          )}
        </Paper>
      </Box>
    </Layout>
  );
}

export default Settings;
