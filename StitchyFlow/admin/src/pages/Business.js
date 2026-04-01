import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import {
  VerifiedUser as VerificationIcon,
  Store as StoreIcon,
  BusinessCenter as BusinessSettingsIcon,
  Receipt as OrdersBusinessIcon,
  History as LogsIcon,
  CheckCircle as StatusIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

const businessPages = [
  {
    title: 'Tailer Verifications',
    path: '/business/tailer-verifications',
    icon: <VerificationIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    description: 'Total Records: 0'
  },
  {
    title: 'Tailors Shops',
    path: '/business/tailors-shops',
    icon: <StoreIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    description: 'Total Records: 0'
  },
  {
    title: 'Business Settings',
    path: '/business/settings',
    icon: <BusinessSettingsIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    description: 'Total Records: 0'
  },
  {
    title: 'Business Tailer Orders',
    path: '/business/tailer-orders',
    icon: <OrdersBusinessIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    description: 'Total Records: 0'
  },
  {
    title: 'Business Tailor Logs',
    path: '/business/tailor-logs',
    icon: <LogsIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    description: 'Total Records: 0'
  },
  {
    title: 'Business Tailors Status',
    path: '/business/tailors-status',
    icon: <StatusIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    description: 'Total Records: 0'
  },
  {
    title: 'Business Tailor Information/IP',
    path: '/business/tailor-information',
    icon: <InfoIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    description: 'Total Records: 0'
  }
];

function Business() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Header Section */}
      <Box sx={{ 
        bgcolor: '#E3F2FD', 
        borderRadius: '16px', 
        p: 4, 
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{
          width: 80,
          height: 80,
          borderRadius: '16px',
          bgcolor: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <BusinessSettingsIcon sx={{ fontSize: 48, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
            Business
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Open any page below to manage business tailor records.
          </Typography>
        </Box>
      </Box>

      {/* Business Pages Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 3 
      }}>
        {businessPages.map((page) => (
          <Card 
            key={page.path}
            sx={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardActionArea onClick={() => navigate(page.path)}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {page.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e', mb: 1 }}>
                  {page.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  {page.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Layout>
  );
}

export default Business;
