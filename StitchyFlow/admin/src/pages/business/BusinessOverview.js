import React, { useEffect, useState } from 'react';
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { api, authHeaders } from '../../utils/api';

const pages = [
  { title: 'Tailer Verifications', route: '/business/tailer-verifications', key: 'verifications' },
  { title: 'Tailors Shops', route: '/business/tailors-shops', key: 'shops' },
  { title: 'Business Settings', route: '/business/business-settings', key: 'settings' },
  { title: 'Business Tailer Orders', route: '/business/business-tailer-orders', key: 'orders' },
  { title: 'Business Tailor Logs', route: '/business/business-tailor-logs', key: 'logs' },
  { title: 'Business Tailors Status', route: '/business/business-tailors-status', key: 'status' },
  { title: 'Business Tailor Information/IP', route: '/business/business-tailor-information-ip', key: 'informationIp' }
];

function BusinessOverview() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/business/dashboard', { headers: authHeaders() });
        setCounts(response.data.data || {});
      } catch (_error) {
        setCounts({});
      }
    };
    load();
  }, []);

  return (
    <Layout title="Business Module">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Business</Typography>
        <Typography color="text.secondary">Open any page below to manage business tailor records.</Typography>
      </Box>
      <Grid container spacing={2}>
        {pages.map((page) => (
          <Grid item xs={12} sm={6} md={4} key={page.key}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <CardActionArea onClick={() => navigate(page.route)}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{page.title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Total Records: {counts[page.key] ?? 0}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export default BusinessOverview;
