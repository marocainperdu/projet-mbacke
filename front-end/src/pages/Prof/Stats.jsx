import React, { useState, useEffect } from "react";
import { Client, Account } from "appwrite";
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  CircularProgress,
  Card,
  CardContent,
  Alert
} from "@mui/material";
import config from '../../config';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const apiUrl = config.apiUrl;

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    submittedAssignments: 0,
    averageScore: 0,
    subjectPerformance: [],
    plagiarismStats: {
      totalCases: 0,
      percentageOfSubmissions: 0
    },
    timelineData: [],
    subjectDistribution: []
  });

  const client = new Client()
    .setEndpoint(config.apiEndpoint)
    .setProject(config.projectId);
  const account = new Account(client);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`);
      if (!response.ok) {
        throw new Error("Serveur non disponible");
      }
      return true;
    } catch (error) {
      console.error("Erreur de connexion au serveur:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier la connexion au serveur
        const isServerConnected = await checkServerConnection();
        if (!isServerConnected) {
          throw new Error("Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est démarré.");
        }

        // Récupérer la session
        const session = await account.get();
        if (!session || !session.name) {
          throw new Error("Session invalide. Veuillez vous reconnecter.");
        }

        // Récupérer l'ID du professeur
        const teacherResponse = await fetch(`${apiUrl}/get-teacher-id?name=${encodeURIComponent(session.name)}`);
        if (!teacherResponse.ok) {
          const errorData = await teacherResponse.json();
          throw new Error(errorData.error || "Erreur lors de la récupération de l'ID du professeur");
        }
        const teacherData = await teacherResponse.json();
        
        // Récupérer les statistiques
        const statsResponse = await fetch(`${apiUrl}/api/professor/statistics?teacher_id=${teacherData.teacher_id}`);
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json();
          throw new Error(errorData.error || "Erreur lors de la récupération des statistiques");
        }
        const statsData = await statsResponse.json();
        
        setStats(statsData);
      } catch (error) {
        console.error("Erreur:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" color="textSecondary">
          Si le problème persiste, veuillez :
          <ul>
            <li>Vérifier que le serveur backend est bien démarré</li>
            <li>Vérifier que vous êtes bien connecté</li>
            <li>Rafraîchir la page</li>
          </ul>
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Tableau de Bord des Statistiques
      </Typography>

      <Grid container spacing={3}>
        {/* Cartes de statistiques générales */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total des Devoirs
              </Typography>
              <Typography variant="h5">
                {stats.totalAssignments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Devoirs Rendus
              </Typography>
              <Typography variant="h5">
                {stats.submittedAssignments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Moyenne Générale
              </Typography>
              <Typography variant="h5">
                {stats.averageScore ? `${stats.averageScore}/20` : '0/20'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cas de Plagiat
              </Typography>
              <Typography variant="h5">
                {stats.plagiarismStats?.totalCases || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique de performance par matière */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance par Matière
            </Typography>
            {stats.subjectPerformance && stats.subjectPerformance.length > 0 ? (
              <BarChart
                width={500}
                height={300}
                data={stats.subjectPerformance}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="moyenne" fill="#8884d8" />
              </BarChart>
            ) : (
              <Typography>Aucune donnée disponible</Typography>
            )}
          </Paper>
        </Grid>

        {/* Évolution dans le temps */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Évolution des Résultats
            </Typography>
            {stats.timelineData && stats.timelineData.length > 0 ? (
              <LineChart
                width={500}
                height={300}
                data={stats.timelineData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="moyenne" stroke="#8884d8" />
              </LineChart>
            ) : (
              <Typography>Aucune donnée disponible</Typography>
            )}
          </Paper>
        </Grid>

        {/* Distribution des matières */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribution des Matières
            </Typography>
            {stats.subjectDistribution && stats.subjectDistribution.length > 0 ? (
              <PieChart width={400} height={300}>
                <Pie
                  data={stats.subjectDistribution}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <Typography>Aucune donnée disponible</Typography>
            )}
          </Paper>
        </Grid>

        {/* Statistiques de plagiat */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques de Plagiat
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Pourcentage de soumissions avec plagiat détecté : {stats.plagiarismStats?.percentageOfSubmissions || 0}%
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Nombre total de cas : {stats.plagiarismStats?.totalCases || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Stats;
