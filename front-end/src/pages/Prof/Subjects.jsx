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
import AddIcon from "@mui/icons-material/Add";
import { Client, Account } from "appwrite";


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
const client = new Client().setEndpoint("https://appwrite.momokabil.duckdns.org/v1").setProject("67cd9f540022aae0f0f5");
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewSubject({ ...newSubject, file: e.target.files[0] });
  };

  const handleAddSubject = async () => {
    if (
      !newSubject.title ||
      !newSubject.subject ||
      !newSubject.professor ||
      !newSubject.deadline ||
      !newSubject.description
    ) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Si l'ID du professeur n'est pas défini, ne pas soumettre
    if (!teacherId) {
      alert("Impossible de récupérer l'ID du professeur");
      return;
    }

    // Envoi de la requête POST au backend pour ajouter un sujet
    const formData = new FormData();
    formData.append("title", newSubject.title);
    formData.append("subject", newSubject.subject);
    formData.append("professor", newSubject.professor);
    formData.append("deadline", newSubject.deadline);
    formData.append("description", newSubject.description);
    formData.append("teacher_id", teacherId);  // Ajouter l'ID du professeur
    if (newSubject.file) {
      formData.append("file", newSubject.file);
    }

    try {
      const response = await fetch(`${apiUrl}/api/sujets`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setSubjects([...subjects, data]);
      setNewSubject({
        title: "",
        subject: "",
        professor: "",
        deadline: "",
        description: "",
        file: null,
      });
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du sujet", error);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await fetch(`${apiUrl}/subjects/${id}`, {
        method: "DELETE",
      });
      setSubjects(subjects.filter((subject) => subject.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du sujet", error);
    }
  };

  newSubject.professor = teacherName; // Remplace le champ Professeur par le nom du professeur

  return (
    <Container>
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        📚 Sujets d'Examens
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2, bgcolor: "#9C27B0", color: "white", "&:hover": { bgcolor: "#7B1FA2" } }}
        onClick={handleOpen}
      >
        Ajouter un Sujet
      </Button>

      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "15%" }}>Titre</TableCell>
              <TableCell sx={{ width: "15%" }}>Matière</TableCell>
              <TableCell sx={{ width: "15%" }}>Professeur</TableCell>
              <TableCell sx={{ width: "15%" }}>Date limite</TableCell>
              <TableCell sx={{ width: "25%" }}>Description</TableCell>
              <TableCell sx={{ width: "10%" }}>Fichier</TableCell>
              <TableCell sx={{ width: "5%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.title}</TableCell>
                  <TableCell>{subject.subject}</TableCell>
                  <TableCell>{subject.professor}</TableCell>
                  <TableCell>{subject.deadline}</TableCell>
                  <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                    {subject.description}
                  </TableCell>
                  <TableCell>
                    {subject.file ? (
                      <a href="#" onClick={() => alert("Téléchargement de " + subject.file.name)}>
                        {subject.file.name}
                      </a>
                    ) : (
                      "Aucun fichier"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteSubject(subject.id)}>
                      <DeleteIcon />
                    </IconButton>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un Sujet</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Titre du sujet"
            name="title"
            value={newSubject.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Matière"
            name="subject"
            value={newSubject.subject}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nom du Professeur"
            name="professor"
            value={newSubject.professor}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
              fullWidth
              type="date"
              label="Date limite"
              name="deadline"
              InputLabelProps={{ shrink: true }}
              value={newSubject.deadline}
              onChange={handleChange}
              sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newSubject.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddSubject} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Subjects;
