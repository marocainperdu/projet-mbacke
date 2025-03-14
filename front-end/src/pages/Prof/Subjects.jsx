import React, { useState } from "react";
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewSubject({ ...newSubject, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewSubject({ ...newSubject, file: e.target.files[0] });
  };

  const handleAddSubject = () => {
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

    setSubjects([...subjects, { ...newSubject, id: subjects.length + 1 }]);
    setNewSubject({ title: "", subject: "", professor: "", deadline: "", description: "", file: null });
    setOpen(false);
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  return (
    <Container>
      {/* HEADER */}
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        📚 Sujets d'Examens
      </Typography>

      {/* BOUTON AJOUTER UN SUJET */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2, bgcolor: "#9C27B0", color: "white", "&:hover": { bgcolor: "#7B1FA2" } }}
        onClick={handleOpen}
      >
        Ajouter un Sujet
      </Button>

      {/* TABLE DES SUJETS */}
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

      {/* DIALOG AJOUT SUJET */}
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
