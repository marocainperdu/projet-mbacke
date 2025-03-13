import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Grid, Paper, Card, 
  CardContent, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const DashboardProf = () => {
  const [stats, setStats] = useState({
    totalExams: 0,
    copiesCorrigees: 0,
    notifications: 0
  });

  const [exams, setExams] = useState([]);

  // Simuler la récupération des statistiques et examens
  useEffect(() => {
    axios.get("http://localhost:5000/api/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Erreur API stats :", err));

    axios.get("http://localhost:5000/api/exams")
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API exams :", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Container maxWidth="lg">
      {/* En-tête */}
      <AppBar position="static" sx={{ marginBottom: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard Professeur
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Statistiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#3498db", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Examens</Typography>
              <Typography variant="h4">{stats.totalExams}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#2ecc71", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Copies corrigées</Typography>
              <Typography variant="h4">{stats.copiesCorrigees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: "#f39c12", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Notifications</Typography>
              <Typography variant="h4">{stats.notifications}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste des examens */}
      <Paper elevation={3} sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Mes Examens
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Copies reçues</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>{exam.date}</TableCell>
                    <TableCell>{exam.copies}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary">
                        Corriger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucun examen disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bouton pour créer un nouvel examen */}
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        sx={{ marginTop: 3 }}
      >
        Ajouter un examen
      </Button>
    </Container>
  );
};

export default DashboardProf;
