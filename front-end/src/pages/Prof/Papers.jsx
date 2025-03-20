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
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Client, Account } from "appwrite";

const INVALID_DATE_MESSAGE = "Date invalide";
const apiUrl = "http://localhost:3000"; // Remplace par ton backend réel

const Papers = () => {
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [newGrade, setNewGrade] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [teacherName, setTeacherName] = useState(""); // Nom du professeur
  const [teacherId, setTeacherId] = useState(null); // ID du professeur
  const client = new Client().setEndpoint("https://41.82.59.121:453/v1").setProject("67cd9f540022aae0f0f5");
  const account = new Account(client);


  const API_URL = "http://localhost:3000";

  const formatDate = (dateString) => {
    if (!dateString) {
      return INVALID_DATE_MESSAGE;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }
    const options = { 
      year: "numeric", 
      month: "long", 
      day: "numeric", 
      hour: "numeric", 
      minute: "numeric", 
      second: "numeric", 
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  useEffect(() => {
    const fetchExams = async () => {
      if (!teacherId) return; // Vérifie si teacherId est défini

      try {
        const response = await fetch(`${API_URL}/get-mes-sujets?id=${teacherId}`);
        const data = await response.json();
        
        if (response.ok) {
          setExams(data);
        } else {
          setError("Erreur lors de la récupération des examens");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des examens");
        console.error(error);
      }
    };

    fetchExams();
  }, [teacherId]); // Déclenche l'effet lorsque teacherId change


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
        const response = await fetch(`${API_URL}/get-teacher-id?name=${encodeURIComponent(teacherName)}`);
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
  }, [teacherName]); // Ne s'exécute que si teacherName change

  useEffect(() => {
    const fetchCopies = async () => {
      if (!selectedExam) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/get-copies?exam_id=${selectedExam}`);
        const data = await response.json();
        if (response.ok) {
          setCopies(data);
        } else {
          setError("Erreur lors de la récupération des copies");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des copies");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCopies();
  }, [selectedExam]);

  const handleSave = async (index) => {
    const updatedCopy = {
      ...copies[index],
      finalGrade: Number(newGrade), // Convertir la nouvelle note en nombre
      corrected_by: teacherId, // Utilise l'ID du professeur
    };

    const submissionId = updatedCopy.submission_id;
    if (!submissionId) {
      console.error("ID de la soumission manquant");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/copies/${submissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCopy),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      let updatedCopies = [...copies];
      updatedCopies[index] = updatedCopy;
      setCopies(updatedCopies);
      setEditIndex(null); // Ferme le mode d'édition
    } catch (err) {
      alert("Erreur lors de la mise à jour de la note : " + err.message);
    }
  };

  const handleAutoCorrection = (copy, index) => {
    setLoading(true); // Afficher un indicateur de chargement
  
    fetch(`${API_URL}/extract-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_file: copy.submission_file }),
    })
      .then((extractResponse) => {
        if (!extractResponse.ok) throw new Error("Erreur d'extraction du texte");
        return extractResponse.json();
      })
      .then(({ extractedText }) => {
        return fetch(`${API_URL}/grade-copy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            text: extractedText,
            submission_id: copy.submission_id, // Ajout de l'ID de la soumission
            teacher_id: teacherId // Ajout de l'ID du professeur
          }),
        });
      })
      .then((aiResponse) => {
        if (!aiResponse.ok) throw new Error("Erreur de notation par l'IA");
        return aiResponse.json();
      })
      .then(({ finalGrade }) => {
        let updatedCopies = [...copies];
        updatedCopies[index].finalGrade = finalGrade;
        setCopies(updatedCopies);
      })
      .catch((error) => {
        alert("Erreur : " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
};

  
  

  return (
    <Container>
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        📄 Copies et Corrections
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Selectioner un examen</InputLabel>
        <Select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          label="Selectioner un examen"
        >
          {exams.map((exam) => (
            <MenuItem key={exam.id} value={exam.id}>
              {exam.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Étudiant</TableCell>
                <TableCell>Date de soumission</TableCell>
                <TableCell>Fichier</TableCell>
                <TableCell>Correction (IA)</TableCell>
                <TableCell>Note finale</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {copies.length > 0 ? (
                copies.map((copy, index) => (
                  <TableRow key={copy.id}>
                    <TableCell>{copy.student_name}</TableCell>
                    <TableCell>{formatDate(copy.submission_date)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => window.open(`${apiUrl}${copy.submission_file}`, "_blank")}
                      >
                        Télécharger
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button startIcon={<AutoAwesomeIcon />} variant="outlined" color="secondary" onClick={() => handleAutoCorrection(copy, index)}>
                        <Typography variant="button">Correction Magique</Typography>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {editIndex === index ? (
                        <TextField
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                          type="number"
                          inputProps={{ min: 0, max: 20 }}
                          label="Note"
                          variant="outlined"
                          size="small"
                          sx={{ width: "100px" }}
                        />
                      ) : copy.finalGrade !== null ? (
                        `${copy.finalGrade}/20`
                      ) : (
                        "Pas de note"
                      )}
                    </TableCell>
                    <TableCell>
                      {editIndex === index ? (
                        <IconButton color="success" onClick={() => handleSave(index)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton color="primary" onClick={() => setEditIndex(index)}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucune copie disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Papers;
