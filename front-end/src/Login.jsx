import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';

const client = new Client();
client.setEndpoint('https://appwrite.momokabil.duckdns.org/v1')
      .setProject('67cd9f540022aae0f0f5');

const account = new Account(client);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Vérifier s'il y a une session active et la supprimer
      const currentSession = await account.getSession('current').catch(() => null);
      if (currentSession) {
        await account.deleteSession('current'); // Supprimer la session active
      }

      // Créer une nouvelle session
      const session = await account.createEmailPasswordSession(email, password);
      localStorage.setItem('jwt', session.secret); // Stocker le token JWT
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Connexion
        </Typography>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Se connecter
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Pas de compte ? <Link to="/register">S'inscrire</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
