// OrderButtons.js
import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Paper, List, ListItem, 
  ListItemText, IconButton, Badge, Button, useTheme, useMediaQuery 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    axios.get("http://localhost:5000/api/notifications")
      .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API notifications :", err));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fonction pour marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Container maxWidth="md">
      {/* En-tête */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Notifications
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Liste des notifications */}
      <Paper 
        elevation={3} 
        sx={{ 
          marginTop: 3, 
          padding: 2, 
          backgroundColor: isDarkMode ? "#333" : "#fff", 
          color: isDarkMode ? "#fff" : "#000"
        }}
      >
        <List>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem 
                key={notification.id} 
                onClick={() => markAsRead(notification.id)}
                sx={{
                  backgroundColor: notification.read ? (isDarkMode ? "#444" : "white") : (isDarkMode ? "#555" : "#f0f8ff"),
                  color: isDarkMode ? "#fff" : "#000",
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd'
                }}
              >
                <ListItemText primary={notification.text} />
              </ListItem>
            ))
          ) : (
            <Typography textAlign="center" sx={{ color: isDarkMode ? "#fff" : "#000" }}>
              Aucune notification
            </Typography>
          )}
        </List>
      </Paper>

      {/* Bouton pour tout marquer comme lu */}
      {unreadCount > 0 && (
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ marginTop: 2 }} 
          onClick={markAllAsRead}
        >
          Marquer tout comme lu
        </Button>
      )}
    </Container>
  );
};

export default Notifications;
