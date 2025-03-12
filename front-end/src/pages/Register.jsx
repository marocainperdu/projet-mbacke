import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  CircularProgress,
} from "@mui/material";
import { Client, Account, ID } from "appwrite";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const client = new Client()
  .setEndpoint("https://appwrite.momokabil.duckdns.org/v1")
  .setProject("67cd9f540022aae0f0f5");

const account = new Account(client);

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff" },
  },
});

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    
    const data = new FormData(event.currentTarget);
    const name = data.get("name")?.trim();
    const email = data.get("email")?.trim();
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const role = data.get("role");
    
    if (!name || !email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
    
    try {
      // Vérifier si l'utilisateur existe déjà
      await account.get();
      setError("Un compte avec cet e-mail existe déjà. Veuillez vous connecter.");
      setLoading(false);
      return;
    } catch {
      try {
        const user = await account.create(ID.unique(), email, password, name);
        
        // Si le rôle est "prof", on crée l'utilisateur avec un statut "en attente"
        let userRole = role === "prof" ? "prof_en_attente" : role;
        
        // Envoi du rôle au backend via une API sécurisée
        await fetch("/api/set-user-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.$id, role: userRole }),
        });
    
        // Affichage du message si c'est un prof
        if (role === "prof") {
          setError("Vous avez été inscrit, mais vous devez contacter un administrateur pour recevoir votre rôle.");
        } else {
          // Rediriger uniquement si l'utilisateur est un étudiant
          navigate("/");
        }
      } catch (err) {
        if (err.code === 409) {
          setError("Un utilisateur avec cet e-mail existe déjà. Veuillez vous connecter.");
        } else {
          setError(err?.message || "Erreur lors de l'inscription !");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            height: "100vh",
            justifyContent: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Inscription
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nom"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
            />
            <TextField
              select
              margin="normal"
              required
              fullWidth
              name="role"
              label="Vous êtes"
              id="role"
              SelectProps={{
                native: true,
              }}
            >
              <option value="etudiant">Étudiant</option>
              <option value="prof">Enseignant</option>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  onClick={() => navigate("/")}
                  variant="body2"
                  sx={{ cursor: "pointer" }}
                >
                  Déjà un compte ? Se connecter
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}