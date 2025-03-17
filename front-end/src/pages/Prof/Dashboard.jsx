import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Grid, Paper, Card, 
  CardContent, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { Client, Account } from "appwrite"; // Import correct pour Appwrite

const apiUrl = "http://localhost:3000"; // Remplace par ton API backend

const client = new Client()
  .setEndpoint("https://41.82.59.121:453/v1")
  .setProject("67cd9f540022aae0f0f5");

const account = new Account(client);

const DashboardProf = () => {
  const [teacherName, setTeacherName] = useState(""); // Nom du professeur
  const [teacherId, setTeacherId] = useState(null); // ID du professeur
  const [stats, setStats] = useState({
    totalExams: 0,
    copiesCorrigees: 0
  });
  const [exams, setExams] = useState([]);

  // Récupération du nom du professeur depuis Appwrite
  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
        const user = await account.get();
        setTeacherName(user.name);
      } catch (error) {
        console.error("Erreur lors de la récupération des infos de l'utilisateur :", error);
      }
    };

    fetchTeacherName();
  }, []);

  // Récupération de l'ID du professeur
  useEffect(() => {
    if (!teacherName) return;

    const fetchTeacherId = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-teacher-id?name=${encodeURIComponent(teacherName)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur inconnue");
        }

        setTeacherId(data.teacher_id); // Stocke l'ID du professeur
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID du professeur :", error);
      }
    };

    fetchTeacherId();
  }, [teacherName]);

  // Récupération des statistiques et des examens une fois que l'ID du professeur est récupéré
  useEffect(() => {
    if (!teacherId) return;

    axios.get(`${apiUrl}/stats?teacherId=${teacherId}`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Erreur API stats :", err));

    axios.get(`${apiUrl}/exams?teacherId=${teacherId}`)
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API exams :", err));

  }, [teacherId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Fonction pour formater les dates
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
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
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#3498db", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Mes Examens</Typography>
              <Typography variant="h4">{stats.totalExams}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#2ecc71", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Copies Reçus</Typography>
              <Typography variant="h4">{stats.copiesCorrigees}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste des examens */}
      <Paper elevation={3} sx={{ marginTop: 4, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Examens de la classe
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Copies reçues</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>{formatDate(exam.deadline)}</TableCell>
                    <TableCell>{exam.copies}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Aucun examen disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DashboardProf;
