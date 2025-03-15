import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Paper, List, ListItem, 
  ListItemText, IconButton, Badge, Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const apiUrl = "http://localhost:3000"; // Remplace par l'URL de ton backend

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Récupérer les notifications depuis l'API
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/notifications`);
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur API notifications :", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la notification :", err);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await axios.put(`${apiUrl}/api/notifications/read-all`);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Erreur lors de la mise à jour des notifications :", err);
    }
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
      <Paper elevation={3} sx={{ marginTop: 3, padding: 2 }}>
        <List>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem 
                key={notification.id} 
                onClick={() => markAsRead(notification.id)}
                sx={{
                  backgroundColor: notification.read ? "#e0e0e0" : "#f0f8ff",
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd'
                }}
              >
                <ListItemText primary={notification.text} />
              </ListItem>
            ))
          ) : (
            <Typography textAlign="center">
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
