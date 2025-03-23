import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert, Box, ThemeProvider, Grid, Card, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Client, Account } from 'appwrite';
import config from '../config';

const client = new Client()
    .setEndpoint(config.apiEndpoint)
    .setProject(config.projectId);
const account = new Account(client);

function Login()  {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRedirect = async (jwt) => {
        try {
            client.setJWT(jwt);
            const response = await account.get();
            sessionStorage.setItem('email', response.email);

            if (response.labels?.includes('prof')) {
                window.location.href = '/dashprof';
            } else {
                window.location.href = '/dash';
            }
        } catch (err) {
            console.error('Échec de la vérification du JWT', err);
            setError("Erreur lors de la vérification de votre compte.");
        }
    };

    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            try {
                await account.deleteSession('current');
            } catch {
                console.log('Aucune session courante à supprimer');
            }

            await account.createEmailPasswordSession(email, password);
            const jwt = await account.createJWT();
            sessionStorage.setItem('jwt', jwt.jwt);
            handleRedirect(jwt.jwt);
        } catch (err) {
            setError(err?.message || "Une erreur s'est produite.");
        } finally {
            setLoading(false);
        }
    };


  return (

      <Grid container style={styles.container}>
            <Grid item xs={12} md={6} style={styles.leftSide}>

                <div style={styles.examTextContainer}>
                    <span style={styles.examText}>Examen Pro</span>
                    <span style={styles.sticker}>📚</span>
                </div>


                <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" gutterBottom>
                            Connexion
                        </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Mot de passe"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Connexion"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/register")}
                >
                    S'inscrire
                </Button>
                </Box>
                </Card>
            </Grid>
            <Grid item xs={12} md={6} style={styles.rightSide}>
                
            </Grid>
        </Grid>
  

     
      

      
  );

};



const styles = {
    container: {
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    leftSide: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightSide: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url('https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
    },
    examTextContainer: {
        textAlign: 'center',
        
    },
    examText: {
        fontSize: '3em',
        fontWeight: 'bold',
        color: '#000000',
    },
    sticker: {
        fontSize: '4em',
        marginTop: '20px',
    },
};


export default Login;
