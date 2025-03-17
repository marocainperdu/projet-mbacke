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
  .setEndpoint("https://41.82.59.121:453/v1")
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
  
    if (password.length < 8) {  // Mot de passe minimum de 8 caractères
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
  
    const roleMapping = {
      prof: 'teacher',  // Mapping "prof" en "teacher"
      etudiant: 'student',  // Mapping "etudiant" en "student"
    };
    
    const mappedRole = roleMapping[role] || role;  // Si le rôle n'est pas trouvé, utilise le rôle fourni tel quel
  
    try {
      const response = await account.create(ID.unique(), email, password, name);
      
      if (response) {
        const apiResponse = await fetch("http://localhost:3000/api/new-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            role: mappedRole,
          }),
        });
  
        if (apiResponse.ok) {
          if (role === "prof") {
            setError("Vous avez été inscrit, mais vous devez contacter un administrateur pour recevoir votre rôle.");
          } else {
            navigate("/");
          }
        } else {
          const result = await apiResponse.json();
          setError(result.message || "Erreur lors de l'insertion dans la base de données.");
        }
      }
    } catch (err) {
      setError(err?.message || "Erreur lors de l'inscription !");
    } finally {
      setLoading(false);
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