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
  Divider
} from "@mui/material";
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

const apiUrl = "http://localhost:3000";

const Stats = () => {
  const [loading, setLoading] = useState(true);
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
    .setEndpoint("https://41.82.59.121:453/v1")
    .setProject("67cd9f540022aae0f0f5");
  const account = new Account(client);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      // Simuler la récupération des données - À remplacer par de vraies requêtes API
      const response = await fetch(`${apiUrl}/api/professor/statistics`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
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
                {stats.totalAssignments}
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
                {stats.submittedAssignments}
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
                {stats.averageScore}/20
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
                {stats.plagiarismStats.totalCases}
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
          </Paper>
        </Grid>

        {/* Évolution dans le temps */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Évolution des Résultats
            </Typography>
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
          </Paper>
        </Grid>

        {/* Distribution des matières */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribution des Matières
            </Typography>
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
                Pourcentage de soumissions avec plagiat détecté : {stats.plagiarismStats.percentageOfSubmissions}%
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Nombre total de cas : {stats.plagiarismStats.totalCases}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Stats;
