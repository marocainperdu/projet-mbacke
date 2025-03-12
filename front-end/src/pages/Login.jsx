import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert, Box, ThemeProvider } from '@mui/material';
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Client, Account } from 'appwrite';
import { createTheme } from '@mui/material/styles';


const theme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#1976d2" },
      background: { default: "#121212", paper: "#1e1e1e" },
      text: { primary: "#ffffff" },
    },
  });

const client = new Client()
  .setEndpoint("https://appwrite.momokabil.duckdns.org/v1")
  .setProject("67cd9f540022aae0f0f5");

const account = new Account(client);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook pour naviguer vers la page d'inscription

    const handleRedirect = async (jwt) => {
        try {
            // Utilise directement le JWT pour vérifier l'utilisateur
            client.setJWT(jwt);
            const response = await account.get();  // Vérifie les infos de l'utilisateur connecté
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
                // Supprime la session si elle existe déjà
                await account.deleteSession('current');
            } catch {
                console.log('Aucune session courante à supprimer');
            }
    
            // Crée une session avec l'email et le mot de passe
            await account.createEmailPasswordSession(email, password);
    
            // Crée un JWT
            const jwt = await account.createJWT();
            sessionStorage.setItem('jwt', jwt.jwt);  // Stocke le JWT dans sessionStorage
    
            // Redirige selon le rôle de l'utilisateur
            handleRedirect(jwt.jwt);
        } catch (err) {
            setError(err?.message || "Une erreur s'est produite.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="xs">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh", // Centrage vertical
                    }}
                >
                    <Box
                        sx={{
                            boxShadow: 3,
                            borderRadius: 2,
                            px: 4,
                            py: 6,
                            bgcolor: "background.paper",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Connexion
                        </Typography>
                        {error && <Alert severity="error">{error}</Alert>}
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
                            {loading ? "Connexion..." : "Connexion"}
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
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
