import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Paper, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      
      // Simuler une réponse du chatbot après un court délai
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
      <Paper elevation={3} sx={{ padding: 2, marginTop: 3, height: 400, overflowY: 'auto' }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <ListItemText 
                primary={msg.text} 
                sx={{ 
                  backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#E0E0E0', 
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
      <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', padding: 1, marginTop: 2 }}>
        <TextField 
          fullWidth 
          label="Écrire un message..." 
          variant="outlined" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
