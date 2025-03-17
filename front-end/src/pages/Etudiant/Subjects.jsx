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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// URL de l'API
const apiUrl = "http://localhost:3000"; // Remplace avec ton backend réel

const Subject = () => {
  const [exams, setExams] = useState([]); // Liste des examens disponibles
  const [selectedExam, setSelectedExam] = useState(""); // Examen sélectionné
  const [file, setFile] = useState(null); // Fichier sélectionné
  const [submissions, setSubmissions] = useState([]); // Copies soumises
  const studentId = 1; // Remplace par l'ID réel de l'étudiant connecté (à récupérer dynamiquement)

  // Récupérer la liste des examens disponibles
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-exams`);
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des examens", error);
      }
    };
    fetchExams();
  }, []);

  // Récupérer les copies déjà soumises par l'étudiant
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-submissions?student_id=${studentId}`);
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des copies soumises", error);
      }
    };
    fetchSubmissions();
  }, []);

  // Gestion du fichier sélectionné
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Soumission de la copie
  const handleSubmit = async () => {
    if (!selectedExam || !file) {
      alert("Veuillez sélectionner un devoir et un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("exam_id", selectedExam);
    formData.append("student_id", studentId);
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/submit-copy`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Copie soumise avec succès !");
        setFile(null);
        setSelectedExam("");
      } else {
        alert("Erreur lors de la soumission.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        📝 Soumission de Copies
      </Typography>

      {/* Sélection du devoir */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Choisir un devoir</InputLabel>
        <Select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
          {exams.map((exam) => (
            <MenuItem key={exam.id} value={exam.id}>
              {exam.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Upload du fichier */}
      <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ mb: 2 }}>
        Télécharger votre copie
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {/* Bouton de soumission */}
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
        Envoyer la copie
      </Button>

      {/* Tableau des copies soumises */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        📄 Vos copies soumises
      </Typography>

      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Examen</TableCell>
              <TableCell>Date de soumission</TableCell>
              <TableCell>Fichier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.exam_title}</TableCell>
                  <TableCell>{new Date(submission.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(`${apiUrl}${submission.file_path}`, "_blank")}
                    >
                      Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Aucune copie soumise.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Subject;
