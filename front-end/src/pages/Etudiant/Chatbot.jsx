import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Paper, TextField, Button, 
  List, ListItem, ListItemText, useTheme 
} from '@mui/material';
import config from '../../config';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // Ajout d'un état de chargement

  const theme = useTheme();
  const apiURL = config.apiUrl;
  const isDarkMode = theme.palette.mode === 'dark';

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
  
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      const response = await fetch(`${apiURL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { text: 'Erreur de connexion.', sender: 'bot' }]);
    }
  
    setLoading(false);
  };
  

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Chatbot</Typography>
        </Toolbar>
      </AppBar>

      <Paper 
        elevation={3} 
        sx={{ 
          padding: 2, marginTop: 3, height: 400, overflowY: 'auto',
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
                  padding: 1, borderRadius: 2, display: 'inline-block'
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper 
        elevation={2} 
        sx={{ 
          display: 'flex', alignItems: 'center', padding: 1, marginTop: 2, 
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
          disabled={loading} // Désactivation du bouton pendant le chargement
          sx={{ marginLeft: 1 }}
        >
          {loading ? '...' : 'Envoyer'}
        </Button>
      </Paper>
    </Container>
  );
};

export default Chatbot;
