import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Paper, TextField, Button, 
  List, ListItem, ListItemText, useTheme 
} from '@mui/material';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // Détecter le mode sombre
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      // Simuler une réponse du chatbot après 1s
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Je suis un chatbot !", sender: 'bot' }]);
      }, 1000);
    }
  };

  return (
    <Container maxWidth="md">
      {/* En-tête */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Chatbot</Typography>
        </Toolbar>
      </AppBar>

      {/* Conteneur du chat */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 2, 
          marginTop: 3, 
          height: 400, 
          overflowY: 'auto',
          backgroundColor: isDarkMode ? "#222" : "#fff", 
          color: isDarkMode ? "#fff" : "#000" 
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <ListItemText 
                primary={msg.text} 
                sx={{ 
                  backgroundColor: msg.sender === 'user' ? (isDarkMode ? "#444" : "#DCF8C6") : (isDarkMode ? "#555" : "#E0E0E0"), 
                  color: isDarkMode ? "#fff" : "#000",
                  padding: 1, 
                  borderRadius: 2, 
                  display: 'inline-block'
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Champ de saisie */}
      <Paper 
        elevation={2} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: 1, 
          marginTop: 2, 
          backgroundColor: isDarkMode ? "#333" : "#fff" 
        }}
      >
        <TextField 
          fullWidth 
          label="Écrire un message..." 
          variant="outlined" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          sx={{ 
            input: { color: isDarkMode ? "#fff" : "#000" }, 
            label: { color: isDarkMode ? "#bbb" : "#000" }
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSendMessage}
          sx={{ marginLeft: 1 }}
        >
          Envoyer
        </Button>
      </Paper>
    </Container>
  );
};

export default Chatbot;
