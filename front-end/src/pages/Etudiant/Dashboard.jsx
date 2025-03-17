import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Grid, Paper, Card, 
  CardContent, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { Client, Account } from "appwrite";

const apiUrl = "http://localhost:3000"; // Remplace par ton API backend

const client = new Client()
  .setEndpoint("https://appwrite.momokabil.duckdns.org/v1")
  .setProject("67cd9f540022aae0f0f5");

const account = new Account(client); 

const DashboardEtudiant = () => {
  const [studentName, setStudentName] = useState(""); // Nom de l'étudiant
  const [studentId, setStudentId] = useState(null); // ID de l'étudiant
  const [stats, setStats] = useState({
    totalExams: 0,
    examsSubmitted: 0
  });
  const [exams, setExams] = useState([]);

  // Récupération du nom de l'étudiant depuis Appwrite
  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const user = await account.get();
        setStudentName(user.name);
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
      }
    };

    fetchStudentName();
  }, []);

  // Récupération de l'ID de l'étudiant
  useEffect(() => {
    if (!studentName) return;

    const fetchStudentId = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-student-id?name=${encodeURIComponent(studentName)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur inconnue");
        }

        setStudentId(data.student_id); // Stocke l'ID de l'étudiant
      } catch (error) {
        console.error("Erreur récupération ID étudiant :", error);
      }
    };

    fetchStudentId();
  }, [studentName]);

  // Récupération des statistiques et des examens une fois l'ID obtenu
  useEffect(() => {
    if (!studentId) return;

    axios.get(`${apiUrl}/student-stats?studentId=${studentId}`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Erreur API stats :", err));

    axios.get(`${apiUrl}/student-exams?studentId=${studentId}`)
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API exams :", err));

  }, [studentId]);

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
            Dashboard Étudiant
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Statistiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#f39c12", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Examens à faire</Typography>
              <Typography variant="h4">{stats.totalExams}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#e74c3c", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Examens soumis</Typography>
              <Typography variant="h4">{stats.examsSubmitted}</Typography>
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
                <TableCell>Deadline</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>{formatDate(exam.deadline)}</TableCell>
                    <TableCell>
                      <span style={{
                        color: exam.status === "Soumis" ? "green" : exam.status === "À faire" ? "red" : "blue"
                      }}>
                        {exam.status}
                      </span>
                    </TableCell>
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

export default DashboardEtudiant;
