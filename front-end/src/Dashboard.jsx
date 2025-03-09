import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import NotificationsIcon from '@mui/icons-material/Notifications'; // Ajout de l'icône pour les notifications
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; // Icône pour les Sujets
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icône pour les Copies
import ReportIcon from '@mui/icons-material/Report'; // Icône pour Plagiat
import ChatIcon from '@mui/icons-material/Chat'; // Icône pour Chatbot
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Icône pour Déconnexion
import Stack from '@mui/material/Stack';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';  // Import pour la redirection
import { Client, Account } from 'appwrite';

// Données de navigation
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Examen',
  },
  {
    segment: 'subjects',
    title: 'Sujets d\'Examen',
    icon: <LibraryBooksIcon />,
  },
  {
    segment: 'papers',
    title: 'Copies et Corrections',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'plagiarism',
    title: 'Plagiat',
    icon: <ReportIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Support',
  },
  {
    segment: 'chatbot',
    title: 'Chatbot d\'Assistance',
    icon: <ChatIcon />,
  },
  {
    segment: 'notifications',
    title: 'Notifications',
    icon: <NotificationsIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Statistiques',
  },
  {
    segment: 'reports',
    title: 'Rapport',
    icon: <BarChartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'logo', // Section pour le logo utilisateur
    segment: 'user',
    title: 'User',
    icon: <AccountCircleIcon />,  // Icône de l'utilisateur
  },  
  {
    segment: 'logout',
    title: 'Déconnexion',
    icon: <ExitToAppIcon />,
  }
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

// Skeleton pour l'affichage en cours de chargement
const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const navigate = useNavigate();  // Hook pour la redirection

  const router = useDemoRouter('/dashboard');
  const demoWindow = window ? window() : undefined;

  const [userName, setUserName] = React.useState('');  // État pour le nom de l'utilisateur

  const checkSession = async () => {
    const client = new Client();
    client.setEndpoint('https://appwrite.momokabil.duckdns.org/v1').setProject('67cd9f540022aae0f0f5');
    const account = new Account(client);
    
    try {
      const currentUser = await account.get();  // Vérifier si un utilisateur est connecté
      if (!currentUser) {
        // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
        navigate('/login');
      } else {
        // Si l'utilisateur est connecté, récupérer son nom
        setUserName(currentUser.name || 'Utilisateur');  // Si le nom est inexistant, on affiche "Utilisateur"
      }
    } catch (error) {
      console.error('Erreur de vérification de la session:', error);
      navigate('/login');  // Redirige vers la page de connexion en cas d'erreur
    }
  };

  React.useEffect(() => {
    // Vérifie si une session est active dès que le composant est monté
    checkSession();
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION.map(item => {
        if (item.kind === 'logo') {
          // Remplacer "User" par le nom de l'utilisateur
          return { ...item, title: userName || 'Utilisateur' };
        }
        return item;
      })}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer sx={{ position: 'relative', minHeight: '100vh' }}> {/* Ajout de position relative et minHeight */}
          <Grid container spacing={1}>
            <Grid item xs={5} />
            <Grid item xs={12}>
              <Skeleton height={14} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton height={14} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={8}>
              <Skeleton height={100} />
            </Grid>

            <Grid item xs={12}>
              <Skeleton height={150} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton height={14} />
            </Grid>

            <Grid item xs={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton height={100} />
            </Grid>
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
