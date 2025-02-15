import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Phone, Mail, LocationOn, Instagram, Facebook, YouTube, Twitter, LinkedIn } from '@mui/icons-material';
import Logo from '../assets/medcap_logo.png';
import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('loggedIn') === null) {
      localStorage.setItem('loggedIn', false);
    }

    let loggedInStatus = localStorage.getItem('loggedIn');
    const storedUser = localStorage.getItem('user');

    if (loggedInStatus === 'true' && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser)); // Parse the user data from localStorage
    }
  }, []);

  return (
    <Box sx={{ backgroundColor: '#673ab7', color: 'white', padding: '40px 0' }}>
      <Container>
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <img 
                src={Logo} 
                alt="MedCap Logo" 
                style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 16 }} // Smaller and circular logo
              />
              <Typography variant="h6" component="span">MedCap</Typography>
            </Box>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Your partner in healthcare solutions.
            </Typography>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Services</Typography>
            {isLoggedIn ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <Link to={`/Home`}><li>Home</li></Link>
                <Link to={`/medicalreport`}><li>Report</li></Link>
                <Link to={`/healthcareplan`}><li>Healthcare-Plans</li></Link>
                <Link to={`/dashboard`}><li>DashBoard</li></Link>
              </ul>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <Link to={`/Home`}><li>Home</li></Link>
                <Link to={`/medicalreport`}><li>Report</li></Link>
                <Link to={`/healthcareplan`}><li>Healthcare-Plans</li></Link>
                <Link to={`/Signup`}><li>SignUp</li></Link>
              </ul>
            )}
          </Grid>

          {/* Contact */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>Contact</Typography>
          <Typography variant="body2" display="flex" alignItems="center">
            <Phone sx={{ marginRight: 1 }} /> +12 3456 7890
          </Typography>
          <Typography variant="body2" display="flex" alignItems="center">
            <Mail sx={{ marginRight: 1 }} /> dummy@domain.com
          </Typography>
          <Typography variant="body2" display="flex" alignItems="center">
            <LocationOn sx={{ marginRight: 1 }} /> 308 Negra Arroyo Lane
          </Typography>
        </Grid>


          {/* Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Links</Typography>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li>Privacy Policy</li>
              <li>Term Of Use</li>
            </ul>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid white', marginY: 4 }} />

        {/* Social Media and Copyright */}
        <Box textAlign="center">
          <div>
            <IconButton sx={{ color: 'white', margin: '0 5px' }}><Instagram fontSize="small" /></IconButton>
            <IconButton sx={{ color: 'white', margin: '0 5px' }}><Facebook fontSize="small" /></IconButton>
            <IconButton sx={{ color: 'white', margin: '0 5px' }}><YouTube fontSize="small" /></IconButton>
            <IconButton sx={{ color: 'white', margin: '0 5px' }}><Twitter fontSize="small" /></IconButton>
            <IconButton sx={{ color: 'white', margin: '0 5px' }}><LinkedIn fontSize="small" /></IconButton>
          </div>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            © 2025 MedCap. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
