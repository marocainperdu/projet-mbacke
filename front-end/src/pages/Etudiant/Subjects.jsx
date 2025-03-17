import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Client, Account } from "appwrite";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("fr-FR", options);
};

const apiUrl = "http://localhost:3000"; // Remplace par l'URL de ton backend

const Subjects = () => {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    title: "",
    subject: "",
    professor: "",
    deadline: "",
    description: "",
    file: null,
  });
const [teacherId, setTeacherId] = useState(null);  // Nouveau state pour l'ID du professeur
const client = new Client().setEndpoint("https://41.82.59.121:453/v1").setProject("67cd9f540022aae0f0f5");
const account = new Account(client);
const [teacherName, setTeacherName] = useState(null);
useEffect(() => {
  const today = new Date();
  const nextWeek = new Date(today.setDate(today.getDate() + 7)); // Ajouter 7 jours à la date actuelle
  const formattedDate = nextWeek.toISOString().split("T")[0]; // Formater au format YYYY-MM-DD
  setNewSubject((prev) => ({
    ...prev,
    deadline: formattedDate, // Définir la date par défaut
  }));
}, []);

  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    const formattedDate = nextWeek.toISOString().split("T")[0];
    setNewSubject((prev) => ({
      ...prev,
      deadline: formattedDate,
    }));
  }, []);

useEffect(() => {
    const fetchTeacherName = async () => {
        try {
            const user = await account.get(); // Récupère l'utilisateur connecté
            setTeacherName(user.name); // Stocke le nom de l'utilisateur (supposé être le nom du professeur)
        } catch (error) {
            console.error("Erreur lors de la récupération des infos de l'utilisateur :", error);
        }
    };

    fetchTeacherName();
}, []); // Exécute une fois à l'initialisation

useEffect(() => {
    if (!teacherName) return; // Ne fait rien si teacherName est null

    const fetchTeacherId = async () => {
        try {
            const response = await fetch(`${apiUrl}/get-teacher-id?name=${encodeURIComponent(teacherName)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur inconnue");
            }

            setTeacherId(data.teacher_id); // Met à jour teacherId avec la réponse
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID du professeur :", error);
        }
    };

    fetchTeacherId();
}, [teacherName]); // Exécute la requête chaque fois que teacherName est mis à jour



  // Récupérer les sujets depuis le backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-sujets`);
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sujets", error);
      }
    };
    fetchSubjects();
  }, []);

  newSubject.professor = teacherName; // Remplace le champ Professeur par le nom du professeur

  return (
    <Container>
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        📚 Sujets d'Examens
      </Typography>

      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "15%" }}>Titre</TableCell>
              <TableCell sx={{ width: "15%" }}>Date limite</TableCell>
              <TableCell sx={{ width: "25%" }}>Description</TableCell>
              <TableCell sx={{ width: "10%" }}>Fichier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.title}</TableCell>
                  <TableCell>{formatDate(subject.deadline)}</TableCell>
                  <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                    {subject.description}
                  </TableCell>
                  <TableCell>
                    {subject.file_path ? (
                      <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                        onClick={() => window.open(`${apiUrl}${subject.file_path}`, "_blank")}
                      >
                        Télécharger
                      </Button>
                    ) : (
                      "Aucun fichier"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun sujet disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Subjects;
