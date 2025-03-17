import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import ChatIcon from '@mui/icons-material/Chat';
import PropTypes from 'prop-types';
import Plagiarism from "./Plagiarism";
import Subjects from './Subjects';
import Papers from './Papers';
import Chatbot from './Chatbot';
import InsightsIcon from '@mui/icons-material/Insights';
import Dashboard from './Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from 'react-router-dom';
import { Client, Account } from 'appwrite';

// --- Configuration de la navigation ---
const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Examen' },
  { segment: 'subjects', title: 'Sujets d\'Examen', icon: <LibraryBooksIcon /> },
  { segment: 'papers', title: 'Copies et Corrections', icon: <AssignmentIcon /> },
  { segment: 'plagiarism', title: 'Plagiat', icon: <ReportIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Support' },
  { segment: 'chatbot', title: 'Mbacke-AI', icon: <InsightsIcon /> },
];

// --- Configuration du thème ---
const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536,
    },
  },
});

// --- Hook personnalisé pour récupérer le chemin et la navigation via React Router ---
function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  return router;
}

// --- Hook pour la gestion de la session utilisateur ---
function useSession() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({ name: '', avatar: '' });

  React.useEffect(() => {
    const checkSession = async () => {
      const jwt = sessionStorage.getItem('jwt');
      if (!jwt) {
        console.log('Pas de JWT trouvé, redirection vers la page de connexion');
        navigate('/');
        return;
      }

      const client = new Client();
      client
        .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://appwrite.momokabil.duckdns.org/v1')
        .setProject(process.env.REACT_APP_APPWRITE_PROJECT || '67cd9f540022aae0f0f5');
      const account = new Account(client);

      try {
        const currentUser = await account.get();
        if (!currentUser) {
          navigate('/');
        } else {
          setUser({
            name: currentUser.name || 'Utilisateur',
            avatar: currentUser.avatar || '',
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  return user;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

function DemoPageContent({ router }) {
  const { pathname } = router;

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {pathname.startsWith('/dashboard') ? <Dashboard /> : null}
      {pathname.startsWith('/dashprof') ? <Dashboard /> : null}
      {pathname.startsWith('/tool') ? <Dashboard /> : null}
      {pathname.startsWith('/subjects') ? <Subjects /> : null}
      {pathname.startsWith('/papers') ? <Papers /> : null}
      {pathname.startsWith('/plagiarism') ? <Plagiarism /> : null}
      {pathname.startsWith('/chatbot') ? <Chatbot /> : null}
    </Box>
  );
}


DemoPageContent.propTypes = {
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    searchParams: PropTypes.instanceOf(URLSearchParams).isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

// --- Composant principal ---
export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const navigate = useNavigate();
  const router = useDemoRouter('/dashprof');
  const demoWindow = window ? window() : undefined;

  const [userName, setUserName] = React.useState('');
  const [userAvatar, setUserAvatar] = React.useState('');

  const checkSession = async () => {
    const jwt = sessionStorage.getItem('jwt');
    if (!jwt) {
      console.log('Pas de JWT trouvé, redirection vers la page de connexion');
      navigate('/');
      return;
    }

    const client = new Client();
    client.setEndpoint('https://appwrite.momokabil.duckdns.org/v1').setProject('67cd9f540022aae0f0f5');
    const account = new Account(client);

    try {
      const currentUser = await account.get();
      if (!currentUser) {
        navigate('/');
      } else {
        setUserName(currentUser.name || 'Utilisateur');
        setUserAvatar(currentUser.avatar || ''); 
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      navigate('/');
    }
  };

  React.useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('jwt');
    navigate('/logout');
  };

  return (
    <AppProvider
      navigation={NAVIGATION.map(item => {
        if (item.kind === 'logo') {
          return { ...item, title: userName || 'Utilisateur' };
        }
        return item;
      })}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'MUI',
        homeUrl: '/toolpad/core/introduction',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent router={router} />
      </DashboardLayout>
    </AppProvider>
  );
}
