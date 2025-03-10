import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Client, Account } from 'appwrite';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const BRANDING = {
  logo: <img src="https://mui.com/static/logo.svg" alt="Logo" style={{ height: 24 }} />,
  title: 'Examen Pro',
};

const client = new Client();
client.setEndpoint('https://appwrite.momokabil.duckdns.org/v1').setProject('67cd9f540022aae0f0f5');
const account = new Account(client);

const signIn = async (provider, formData, navigate) => {
  const email = formData?.get('email');
  const password = formData?.get('password');

  try {
    // Vérifier si une session existe déjà
    const currentUser = await account.get(); // Récupérer les informations de l'utilisateur connecté

    if (currentUser) {
      // Si l'utilisateur est déjà connecté, on se contente de se connecter avec la session existante
      console.log('Utilisateur déjà connecté:', currentUser);
      navigate('/dashboard');  // Redirige l'utilisateur vers le tableau de bord
      return { type: 'CredentialsSignin', message: 'Connexion réussie avec la session existante.' };
    } else {
      // Sinon, on crée une nouvelle session avec les identifiants fournis
      const response = await account.createEmailPasswordSession(email, password);
      console.log('Connexion réussie:', response);
      navigate('/dashboard');  // Redirige vers le tableau de bord après la connexion réussie
      return { type: 'CredentialsSignin', message: 'Nouvelle session créée et connexion réussie.' };
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    if (error.code === 401) {
      // Erreur d'authentification (identifiants invalides)
      return { type: 'CredentialsSignin', error: 'Identifiants invalides.' };
    } else {
      // Autres erreurs
      return { type: 'CredentialsSignin', error: 'Une erreur est survenue. Veuillez réessayer.' };
    }
  }
};

export default function BrandingSignInPage() {
  const theme = useTheme();
  const navigate = useNavigate();  // Utiliser useNavigate pour la redirection

  React.useEffect(() => {
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.minHeight = '100vh';
    document.body.style.flexDirection = 'column';
    document.body.style.margin = '0';
  }, []);

  return (
    <AppProvider branding={BRANDING} theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 2,
          flexDirection: 'column',
        }}
      >
        <SignInPage
          signIn={(provider, formData) => signIn(provider, formData, navigate)}  // Passer navigate à signIn
          providers={[{ id: 'credentials', name: 'Email et Mot de Passe' }]}
          slotProps={{
            emailField: { autoFocus: true, variant: 'outlined', color: 'primary' },
            form: { noValidate: true, sx: { display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 } },
          }}
        />
      </Box>
    </AppProvider>
  );
}
