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
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from '@mui/icons-material/Send';
import { Client, Account } from "appwrite";

// URL de l'API
const apiUrl = "http://localhost:3000"; // Remplace par ton backend réel

const Papers = () => {
  const [exams, setExams] = useState([]); // Liste des examens disponibles
  const [selectedExam, setSelectedExam] = useState(""); // Examen sélectionné
  const [file, setFile] = useState(null); // Fichier sélectionné
  const [submissions, setSubmissions] = useState([]); // Copies soumises
  const [studentName, setStudentName] = useState(null); // Nom de l'étudiant
  const [studentId, setStudentId] = useState(null); // ID de l'étudiant
  const [alreadySubmitted, setAlreadySubmitted] = useState(false); // Statut de la soumission

  // Configuration Appwrite
  const client = new Client()
    .setEndpoint("https://41.82.59.121:453/v1")
    .setProject("67cd9f540022aae0f0f5");
  const account = new Account(client);

  // Récupérer le nom de l'utilisateur depuis Appwrite
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await account.get();
        setStudentName(user.name); // Récupérer le nom de l'utilisateur
      } catch (error) {
        console.error("Erreur lors de la récupération du nom d'utilisateur :", error);
      }
    };

    fetchUserData();
  }, []);

  // Récupérer l'ID de l'étudiant depuis la base de données
  useEffect(() => {
    if (!studentName) return;

    const fetchStudentId = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-student-id?name=${encodeURIComponent(studentName)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur inconnue");
        }

        setStudentId(data.student_id);
      } catch (error) {
        console.error("Erreur récupération ID étudiant :", error);
      }
    };

    fetchStudentId();
  }, [studentName]);

  // Récupérer la liste des examens disponibles
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-sujets`);
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
    if (!studentId) return;

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-submissions?student_id=${studentId}`);
        const data = await response.json();
        setSubmissions(data);

        // Vérifier si une copie a déjà été soumise
        const submissionForExam = data.find(sub => sub.exam_id === selectedExam);
        if (submissionForExam) {
          setAlreadySubmitted(true); // L'étudiant a déjà soumis une copie pour cet examen
        } else {
          setAlreadySubmitted(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des copies soumises", error);
      }
    };

    fetchSubmissions();
  }, [studentId, selectedExam]);

  // Gestion du fichier sélectionné
  // Gestion du fichier sélectionné
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  
  if (selectedFile) {
    const fileType = selectedFile.type;

    // Vérifier si le fichier est un PDF
    if (fileType !== "application/pdf") {
      alert("Veuillez télécharger un fichier PDF.");
      setFile(null); // Réinitialiser le fichier si ce n'est pas un PDF
    } else {
      setFile(selectedFile); // Si c'est un PDF, on le garde
    }
  }
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
        <Select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          disabled={alreadySubmitted}
          label="Choisir un devoir"
        >
          {exams.map((exam) => (
            <MenuItem key={exam.id} value={exam.id}>
              {exam.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Upload du fichier */}
      <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ mb: 2 }} disabled={alreadySubmitted}>
        Télécharger votre copie
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {/* Bouton de soumission */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        startIcon={<SendIcon />}
        sx={{ mb: 2, ml: 2 }}
        disabled={alreadySubmitted || !selectedExam || !file} // Désactive le bouton de soumission si une copie est déjà soumise
      >
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
                      startIcon={<DownloadIcon />}
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

export default Papers;
