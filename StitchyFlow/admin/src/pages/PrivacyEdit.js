/**
 * Privacy Pages Editor — About, Privacy, Terms, Sitemap
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, TextField, Switch,
  FormControlLabel, CircularProgress, Snackbar, Alert,
  Chip, Divider, Tooltip, IconButton,
} from '@mui/material';
import {
  Info as InfoIcon,
  PrivacyTip as PrivacyIcon,
  Gavel as TermsIcon,
  AccountTree as SitemapIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import { api } from '../utils/api';

// ── Page definitions ──────────────────────────────────────────────────────────
const PAGES = [
  {
    key: 'about',
    label: 'About StitchyFlow',
    icon: <InfoIcon />,
    color: '#1565C0',
    bg: '#E3F2FD',
    desc: 'Company overview, mission, and vision shown on the About page.',
  },
  {
    key: 'privacy',
    label: 'Privacy Policy',
    icon: <PrivacyIcon />,
    color: '#0277BD',
    bg: '#E1F5FE',
    desc: 'Data collection, usage, and security policy for users.',
  },
  {
    key: 'terms',
    label: 'Terms & Conditions',
    icon: <TermsIcon />,
    color: '#01579B',
    bg: '#E8EAF6',
    desc: 'Legal terms governing the use of the StitchyFlow platform.',
  },
  {
    key: 'sitemap',
    label: 'Sitemap',
    icon: <SitemapIcon />,
    color: '#1976D2',
    bg: '#E3F2FD',
    desc: 'All pages and navigation links for the main website.',
  },
];

// ── Minimal rich-text toolbar (bold, italic, headings via execCommand) ────────
function SimpleToolbar({ targetId }) {
  const exec = (cmd, val = null) => {
    document.getElementById(targetId)?.focus();
    document.execCommand(cmd, false, val);
  };
  const btnStyle = {
    border: '1px solid #BBDEFB',
    borderRadius: 4,
    background: '#fff',
    cursor: 'pointer',
    padding: '3px 8px',
    fontSize: 13,
    color: '#1565C0',
    fontWeight: 600,
    transition: 'background 0.15s',
  };
  return (
    <Box sx={{
      display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1,
      bgcolor: '#F0F7FF', borderBottom: '1px solid #BBDEFB',
      borderRadius: '8px 8px 0 0',
    }}>
      {[
        { label: 'B',  title: 'Bold',          cmd: 'bold' },
        { label: 'I',  title: 'Italic',         cmd: 'italic' },
        { label: 'U',  title: 'Underline',      cmd: 'underline' },
        { label: 'H2', title: 'Heading 2',      cmd: 'formatBlock', val: 'h2' },
        { label: 'H3', title: 'Heading 3',      cmd: 'formatBlock', val: 'h3' },
        { label: 'P',  title: 'Paragraph',      cmd: 'formatBlock', val: 'p' },
        { label: 'UL', title: 'Bullet List',    cmd: 'insertUnorderedList' },
        { label: 'OL', title: 'Numbered List',  cmd: 'insertOrderedList' },
        { label: '🔗', title: 'Insert Link',    cmd: 'createLink', val: prompt },
      ].map(({ label, title, cmd, val }) => (
        <Tooltip key={label} title={title} arrow>
          <button
            style={btnStyle}
            onMouseDown={(e) => {
              e.preventDefault();
              if (cmd === 'createLink') {
                const url = window.prompt('Enter URL:');
                if (url) exec(cmd, url);
              } else {
                exec(cmd, val || null);
              }
            }}
          >
            {label}
          </button>
        </Tooltip>
      ))}
    </Box>
  );
}

// ── Single page editor panel ──────────────────────────────────────────────────
function PageEditor({ pageKey, pageMeta }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [preview, setPreview] = useState(false);
  const [snack, setSnack]     = useState({ open: false, msg: '', sev: 'success' });

  const editorId = `editor-${pageKey}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/privacy-pages/${pageKey}`);
      setData(res.data.data);
    } catch {
      setSnack({ open: true, msg: 'Failed to load page data', sev: 'error' });
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => { load(); }, [load]);

  // Sync contenteditable → data.content
  const handleContentBlur = () => {
    const el = document.getElementById(editorId);
    if (el) setData(prev => ({ ...prev, content: el.innerHTML }));
  };

  const handleSave = async () => {
    // Grab latest content from editor
    const el = document.getElementById(editorId);
    const latestContent = el ? el.innerHTML : data.content;
    const payload = { ...data, content: latestContent };

    setSaving(true);
    try {
      await api.put(`/privacy-pages/${pageKey}`, payload);
      setData(prev => ({ ...prev, content: latestContent }));
      setSnack({ open: true, msg: 'Page saved successfully!', sev: 'success' });
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.error?.message || 'Save failed', sev: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: pageMeta.color }} />
      </Box>
    );
  }

  if (!data) return null;

  return (
    <Box>
      {/* Page header card */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 2, mb: 3,
        p: 2.5, borderRadius: '12px',
        background: `linear-gradient(135deg, ${pageMeta.bg} 0%, #fff 100%)`,
        border: `1px solid ${pageMeta.color}30`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '10px',
            bgcolor: pageMeta.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${pageMeta.color}40`,
          }}>
            {pageMeta.icon}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>
              {pageMeta.label}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              {pageMeta.desc}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            label={data.is_active ? 'Active' : 'Inactive'}
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
            sx={{
              bgcolor: data.is_active ? '#DCFCE7' : '#FEE2E2',
              color: data.is_active ? '#166534' : '#991B1B',
              fontWeight: 600, fontSize: 12,
            }}
          />
          <Tooltip title="Reload from database">
            <IconButton size="small" onClick={load} sx={{ color: pageMeta.color }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={preview ? 'Switch to Edit' : 'Preview'}>
            <IconButton
              size="small"
              onClick={() => setPreview(p => !p)}
              sx={{ color: pageMeta.color }}
            >
              {preview ? <EditIcon fontSize="small" /> : <PreviewIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Form fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Title */}
        <TextField
          label="Page Title"
          value={data.title || ''}
          onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&.Mui-focused fieldset': { borderColor: pageMeta.color },
            },
            '& label.Mui-focused': { color: pageMeta.color },
          }}
        />

        {/* Content editor */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 0.5 }}>
            Page Content
          </Typography>
          {!preview ? (
            <Box sx={{ border: `1px solid #BBDEFB`, borderRadius: '8px', overflow: 'hidden' }}>
              <SimpleToolbar targetId={editorId} />
              <Box
                id={editorId}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleContentBlur}
                dangerouslySetInnerHTML={{ __html: data.content }}
                sx={{
                  minHeight: 280,
                  p: 2,
                  outline: 'none',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#1a1a2e',
                  bgcolor: '#fff',
                  '& h2': { color: pageMeta.color, mt: 1, mb: 0.5 },
                  '& h3': { color: '#1976D2', mt: 1, mb: 0.5 },
                  '& p':  { mb: 1 },
                  '& ul, & ol': { pl: 3, mb: 1 },
                  '& a':  { color: pageMeta.color },
                }}
              />
            </Box>
          ) : (
            <Box sx={{
              minHeight: 280, p: 2.5,
              border: `1px solid #BBDEFB`, borderRadius: '8px',
              bgcolor: '#FAFCFF',
              fontSize: 14, lineHeight: 1.7, color: '#1a1a2e',
              '& h2': { color: pageMeta.color, mt: 1, mb: 0.5 },
              '& h3': { color: '#1976D2', mt: 1, mb: 0.5 },
              '& p':  { mb: 1 },
              '& ul, & ol': { pl: 3, mb: 1 },
              '& a':  { color: pageMeta.color },
            }}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          )}
        </Box>

        <Divider sx={{ borderColor: '#E3F2FD' }} />

        {/* SEO fields */}
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
          SEO / Meta Information
        </Typography>
        <TextField
          label="Meta Title"
          value={data.meta_title || ''}
          onChange={e => setData(prev => ({ ...prev, meta_title: e.target.value }))}
          fullWidth
          variant="outlined"
          size="small"
          placeholder="SEO page title (shown in browser tab)"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&.Mui-focused fieldset': { borderColor: pageMeta.color },
            },
            '& label.Mui-focused': { color: pageMeta.color },
          }}
        />
        <TextField
          label="Meta Description"
          value={data.meta_desc || ''}
          onChange={e => setData(prev => ({ ...prev, meta_desc: e.target.value }))}
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          size="small"
          placeholder="Short description for search engines (150–160 chars)"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&.Mui-focused fieldset': { borderColor: pageMeta.color },
            },
            '& label.Mui-focused': { color: pageMeta.color },
          }}
        />

        {/* Active toggle + Save */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={!!data.is_active}
                onChange={e => setData(prev => ({ ...prev, is_active: e.target.checked }))}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: pageMeta.color },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: pageMeta.color },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                Page Active (visible on website)
              </Typography>
            }
          />
          <Box
            component="button"
            onClick={handleSave}
            disabled={saving}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              bgcolor: saving ? '#90CAF9' : pageMeta.color,
              color: '#fff', border: 'none', borderRadius: '10px',
              px: 3, py: 1.2, fontWeight: 700, fontSize: '0.875rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: `0 4px 14px ${pageMeta.color}40`,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: saving ? '#90CAF9' : '#0D47A1', transform: saving ? 'none' : 'translateY(-1px)' },
            }}
          >
            {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon sx={{ fontSize: 18 }} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ── Main PrivacyEdit component ────────────────────────────────────────────────
export default function PrivacyEdit() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      {/* Section header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, mb: 3,
        p: 2.5, borderRadius: '12px',
        background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
        boxShadow: '0 4px 20px rgba(21,101,192,0.3)',
      }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: '12px',
          bgcolor: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PrivacyIcon sx={{ color: '#fff', fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            Privacy & Pages Editor
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Edit About, Privacy Policy, Terms & Conditions, and Sitemap pages
          </Typography>
        </Box>
      </Box>

      {/* Tab navigation */}
      <Paper sx={{
        borderRadius: '12px', border: '1px solid #BBDEFB',
        boxShadow: '0 2px 12px rgba(21,101,192,0.08)',
        overflow: 'hidden',
      }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: '#F0F7FF',
            borderBottom: '1px solid #BBDEFB',
            '& .MuiTab-root': {
              fontWeight: 600, fontSize: '0.8rem', textTransform: 'none',
              minHeight: 52, color: '#546E7A',
              transition: 'all 0.2s',
            },
            '& .Mui-selected': { color: '#1565C0' },
            '& .MuiTabs-indicator': { bgcolor: '#1565C0', height: 3, borderRadius: '3px 3px 0 0' },
          }}
        >
          {PAGES.map((p, i) => (
            <Tab
              key={p.key}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ color: tab === i ? p.color : '#90A4AE', display: 'flex', fontSize: 18 }}>
                    {p.icon}
                  </Box>
                  {p.label}
                </Box>
              }
            />
          ))}
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {PAGES.map((p, i) => (
            tab === i && (
              <PageEditor key={p.key} pageKey={p.key} pageMeta={p} />
            )
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
