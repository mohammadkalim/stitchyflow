import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper,
  Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import Layout from '../../components/Layout';
import { api, authHeaders } from '../../utils/api';

function BusinessCrudPage({ title, resource, columns, defaultForm, idKey }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/business/${resource}`, { headers: authHeaders() });
      setRows(response.data.data || []);
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => {
    setEditingRow(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setForm(columns.reduce((acc, col) => ({ ...acc, [col.key]: row[col.key] ?? '' }), {}));
    setOpen(true);
  };

  const submit = async () => {
    try {
      if (editingRow) {
        const editId = editingRow[idKey] || editingRow.id || editingRow.log_id;
        await api.put(`/business/${resource}/${editId}`, form, { headers: authHeaders() });
        showToast('Record updated successfully');
      } else {
        await api.post(`/business/${resource}`, form, { headers: authHeaders() });
        showToast('Record created successfully');
      }
      setOpen(false);
      setForm(defaultForm);
      fetchRows();
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Operation failed', 'error');
    }
  };

  const removeRow = async (row) => {
    try {
      const rowId = row[idKey] || row.id || row.log_id;
      await api.delete(`/business/${resource}/${rowId}`, { headers: authHeaders() });
      showToast('Record deleted successfully');
      fetchRows();
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Delete failed', 'error');
    }
  };

  return (
    <Layout title={title}>
      <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{title}</Typography>
          {resource !== 'logs' && (
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add New
            </Button>
          )}
        </Box>

        <TableContainer sx={{ maxHeight: 540 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => <TableCell key={col.key}>{col.label}</TableCell>)}
                {resource !== 'logs' && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row[idKey] || row.id || row.log_id} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.type === 'datetime' && row[col.key] ? new Date(row[col.key]).toLocaleString() : (row[col.key] ?? '-')}
                    </TableCell>
                  ))}
                  {resource !== 'logs' && (
                    <TableCell>
                      <IconButton size="small" onClick={() => openEdit(row)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => removeRow(row)}><Delete fontSize="small" /></IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {!rows.length && !loading && (
                <TableRow><TableCell colSpan={columns.length + 1}>No records found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRow ? 'Edit Record' : 'Create Record'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            {columns.filter((col) => !col.readOnly).map((col) => (
              col.options ? (
                <Select
                  key={col.key}
                  value={form[col.key] ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, [col.key]: e.target.value }))}
                  displayEmpty
                >
                  <MenuItem value=""><em>{col.label}</em></MenuItem>
                  {col.options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
              ) : (
                <TextField
                  key={col.key}
                  label={col.label}
                  value={form[col.key] ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, [col.key]: e.target.value }))}
                />
              )
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
}

export default BusinessCrudPage;
