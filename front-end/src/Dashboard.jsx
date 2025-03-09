import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import { Container, Box, Grid, Typography, Paper, Avatar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; // Icône de déconnexion
import MenuIcon from '@mui/icons-material/Menu'; // Icône du menu

const client = new Client();
client.setEndpoint('https://appwrite.momokabil.duckdns.org/v1')
      .setProject('67cd9f540022aae0f0f5');

const account = new Account(client);

const Dashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setTeacher(user);
      } catch (error) {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await account.deleteSession('current');
    navigate('/');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Paper elevation={3} sx={{ padding: 2, height: '100vh' }}>
            <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{ height: '100%' }}>
              <IconButton onClick={toggleDrawer} sx={{ alignSelf: 'flex-start' }}>
                <MenuIcon />
              </IconButton>
              {teacher && (
                <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
                  <Avatar src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_1280.png" sx={{ width: 80, height: 80 }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>{teacher.name}</Typography>
                </Box>
              )}
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
              >
                <List>
                  <ListItem button onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                  </ListItem>
                </List>
              </Drawer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={10}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Bienvenue dans Exam Pro
            </Typography>
            <Typography variant="body1">
              Ici vous pouvez gérer les examens, les soumissions et les résultats des étudiants.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
