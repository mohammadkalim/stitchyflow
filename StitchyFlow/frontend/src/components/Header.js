import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, useScrollTrigger, Slide, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';

function HideOnScroll(props) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}

function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#fff',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Typography 
              variant="h5" 
              onClick={() => navigate('/home')}
              sx={{ 
                fontWeight: 700, 
                color: '#29B6F6',
                cursor: 'pointer',
                letterSpacing: '1px',
              }}
            >
              StitchyFlow
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button 
                onClick={() => navigate('/home')}
                sx={{ 
                  color: '#333', 
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'rgba(41, 182, 246, 0.05)' }
                }}
              >
                Home
              </Button>
              <Button 
                sx={{ 
                  color: '#333', 
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'rgba(41, 182, 246, 0.05)' }
                }}
              >
                Services
              </Button>
              <Button 
                sx={{ 
                  color: '#333', 
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'rgba(41, 182, 246, 0.05)' }
                }}
              >
                About
              </Button>
              <Button 
                sx={{ 
                  color: '#333', 
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'rgba(41, 182, 246, 0.05)' }
                }}
              >
                Contact
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button 
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: '#29B6F6',
                  color: '#29B6F6',
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 2.5,
                  '&:hover': { 
                    borderColor: '#4FC3F7',
                    backgroundColor: 'rgba(41, 182, 246, 0.05)'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ 
                  backgroundColor: '#29B6F6',
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 2.5,
                  boxShadow: '0 4px 15px rgba(41, 182, 246, 0.3)',
                  '&:hover': { 
                    backgroundColor: '#4FC3F7',
                    boxShadow: '0 6px 20px rgba(41, 182, 246, 0.4)'
                  }
                }}
              >
                Sign Up
              </Button>
              
              <IconButton
                sx={{ display: { xs: 'block', md: 'none' } }}
                onClick={handleMenu}
              >
                <MenuIcon sx={{ color: '#333' }} />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: { width: 200, mt: 1 }
                }}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/home'); }}>Home</MenuItem>
                <MenuItem onClick={handleClose}>Services</MenuItem>
                <MenuItem onClick={handleClose}>About</MenuItem>
                <MenuItem onClick={handleClose}>Contact</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}

export default Header;
