import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider, CircularProgress,
  Snackbar, Alert, Avatar, Tooltip, Chip
} from '@mui/material';
import { Delete as DeleteIcon, Chat as ChatIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import axios from 'axios';

function ChatManagement() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/v1/chat/conversations', { headers: getHeaders() });
      setConversations(response.data.data || []);
    } catch (error) {
      setToast({ open: true, message: error?.response?.data?.error?.message || 'Failed to load conversations', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversation) => {
    if (!conversation) return;
    setSelectedLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/chat/conversations/${conversation.conversation_id}/messages`,
        { headers: getHeaders() }
      );
      setMessages(response.data.data.messages || []);
      setSelectedConversation(response.data.data.conversation || conversation);
    } catch (error) {
      setToast({ open: true, message: error?.response?.data?.error?.message || 'Unable to load messages', severity: 'error' });
    } finally {
      setSelectedLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    fetchMessages(conversation);
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/chat/conversations/${conversationId}`, { headers: getHeaders() });
      setConversations((prev) => prev.filter((c) => c.conversation_id !== conversationId));
      if (selectedConversation?.conversation_id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      setToast({ open: true, message: 'Conversation deleted successfully', severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: error?.response?.data?.error?.message || 'Unable to delete conversation', severity: 'error' });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/chat/messages/${messageId}`, { headers: getHeaders() });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setToast({ open: true, message: 'Message deleted successfully', severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: error?.response?.data?.error?.message || 'Unable to delete message', severity: 'error' });
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <Layout>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Chat Management</Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
            View, inspect, and manage all customer-tailor conversations from one admin screen.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'flex-start' }}>
        <Paper sx={{ p: 2, minHeight: 560, borderRadius: 3, bgcolor: '#fff' }} elevation={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ChatIcon sx={{ mr: 1, color: '#3f51b5' }} />
            <Typography variant="h6">Conversations</Typography>
          </Box>

          {loading ? (
            <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : conversations.length === 0 ? (
            <Typography sx={{ color: '#6b7280' }}>No conversations found yet.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 1 }}>
              {conversations.map((conversation) => (
                <Paper
                  key={conversation.conversation_id}
                  onClick={() => handleSelectConversation(conversation)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: selectedConversation?.conversation_id === conversation.conversation_id ? '1px solid #3f51b5' : '1px solid #e5e7eb',
                    bgcolor: selectedConversation?.conversation_id === conversation.conversation_id ? '#eef2ff' : '#fff'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {conversation.customer_name} ↔ {conversation.tailor_name}
                    </Typography>
                    <Chip label={conversation.unread_count || 0} size="small" sx={{ bgcolor: '#dbeafe', color: '#1d4ed8' }} />
                  </Box>
                  <Typography sx={{ color: '#4b5563', fontSize: '0.85rem' }} noWrap>{conversation.last_message || 'No messages yet'}</Typography>
                  <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', mt: 1 }}>
                    Updated {new Date(conversation.updated_at).toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, minHeight: 560, borderRadius: 3, bgcolor: '#fff' }} elevation={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6">Conversation Details</Typography>
              <Typography sx={{ color: '#6b7280' }}>
                {selectedConversation ? `Customer: ${selectedConversation.customer_name} · Tailor: ${selectedConversation.tailor_name}` : 'Select a conversation to view its messages.'}
              </Typography>
            </Box>
            {selectedConversation && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteConversation(selectedConversation.conversation_id)}
              >
                Delete
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {selectedLoading ? (
            <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : selectedConversation ? (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {messages.length === 0 ? (
                <Typography sx={{ color: '#6b7280' }}>This conversation has no messages yet.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sender</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, bgcolor: '#3f51b5', fontSize: '0.75rem' }}>
                                {message.sender_name?.split(' ').map((s) => s[0]).join('').toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{message.sender_name}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{message.sender_role}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{message.message_type}</TableCell>
                          <TableCell sx={{ maxWidth: 360, overflowWrap: 'anywhere' }}>
                            {message.file_url ? (
                              <a href={message.file_url} target="_blank" rel="noreferrer">Open attachment</a>
                            ) : (
                              message.body
                            )}
                          </TableCell>
                          <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete message">
                              <IconButton size="small" color="error" onClick={() => handleDeleteMessage(message.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          ) : (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography sx={{ color: '#9ca3af' }}>Choose a conversation from the left to inspect its messages.</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert onClose={() => setToast((prev) => ({ ...prev, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default ChatManagement;
