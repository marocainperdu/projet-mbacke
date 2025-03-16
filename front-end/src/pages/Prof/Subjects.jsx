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
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Client, Account } from "appwrite";

const apiUrl = "http://localhost:3000"; // Remplace par l'URL de ton backend


const Subjects = () => {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    title: "",
    professor: "",
    deadline: "",
    description: "",
    file: null,
  });
  const [teacherId, setTeacherId] = useState(null);
  const client = new Client().setEndpoint("https://appwrite.momokabil.duckdns.org/v1").setProject("67cd9f540022aae0f0f5");
  const account = new Account(client);
  const [teacherName, setTeacherName] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  };

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
        const user = await account.get();
        setTeacherName(user.name);
      } catch (error) {
        console.error("Erreur lors de la récupération des infos de l'utilisateur :", error);
      }
    };

    fetchTeacherName();
  }, []);

  useEffect(() => {
    if (!teacherName) return;
  
    const fetchTeacherId = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-teacher-id?name=${encodeURIComponent(teacherName)}`);
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Erreur inconnue");
        }
  
        setTeacherId(data.teacher_id);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID du professeur :", error);
      }
    };
  
    fetchTeacherId();
  }, [teacherName]); // Ne s'exécute que si teacherName change
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-sujets`);
        const data = await response.json();
    
        if (response.ok) {
          setSubjects(data); // Mettre à jour l'état avec la liste des sujets
        } else {
          console.error("Erreur lors de la récupération des sujets :", data.error);
        }
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
    if (!newSubject.title || !newSubject.description || !teacherId || !newSubject.file) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", newSubject.title);
    formData.append("description", newSubject.description);
    formData.append("teacher_id", teacherId); // Ajouter l'ID du professeur
    formData.append("deadline", newSubject.deadline); // Ajouter la date limite
    formData.append("file", newSubject.file); // Ajouter le fichier
  
    try {
      const response = await fetch(`${apiUrl}/add-exam`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Examen ajouté avec succès :", data);
        setSubjects((prevSubjects) => [
          ...prevSubjects,
          {
            ...newSubject, // ajouter les données du nouveau sujet
            id: data.id, // Assure-toi que l'ID est renvoyé depuis le serveur
            file_path: data.file_path, // Assure-toi que le chemin du fichier est renvoyé
          }
        ]);
        handleClose();
      } else {
        console.error("Erreur lors de l'ajout :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'examen", error);
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

  useEffect(() => {
    setNewSubject((prev) => ({
      ...prev,
      professor: teacherName || "",
    }));
  }, [teacherName]);
  
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
                  <TableCell>{formatDate(subject.deadline)}</TableCell> {/* Formatage de la date */}
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
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteSubject(subject.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
            label="Nom du Professeur"
            name="professor"
            value={newSubject.professor}
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
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            name="deadline"
            value={newSubject.deadline}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddSubject} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Subjects;
