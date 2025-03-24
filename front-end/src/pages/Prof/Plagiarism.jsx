import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { Client, Account } from "appwrite"; // Assure-toi d'importer correctement Appwrite
import config from '../../config';

const API_URL = config.apiUrl; // Remplace par l'URL de ton API

const Plagiarism = () => {
  // États pour les examens
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [loadingExams, setLoadingExams] = useState(false);
  const [errorExams, setErrorExams] = useState("");

  // États pour les élèves
  const [students, setStudents] = useState([]); // Liste unique des élèves
  const [selectedStudent1, setSelectedStudent1] = useState("");
  const [selectedStudent2, setSelectedStudent2] = useState("");

  // États pour les copies
  const [copies, setCopies] = useState([]);
  const [loadingCopies, setLoadingCopies] = useState(false);
  const [errorCopies, setErrorCopies] = useState("");

  // États pour le professeur
  const [teacherName, setTeacherName] = useState(""); // Nom du professeur
  const [teacherId, setTeacherId] = useState(null); // ID du professeur

  // États pour les textes des copies
  const [text1, setText1] = useState(""); // Texte de la première copie
  const [text2, setText2] = useState(""); // Texte de la deuxième copie
  const [similarityScore, setSimilarityScore] = useState(null); // Score de similarité
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); // Chargement de l'analyse
  const [errorAnalysis, setErrorAnalysis] = useState(""); // Erreur lors de l'analyse

  // Initialisation du client Appwrite
  const client = new Client()
    .setEndpoint(config.apiEndpoint)
    .setProject(config.projectId);
  const account = new Account(client);

  // Récupérer le nom du professeur via Appwrite
  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
        const user = await account.get();
        setTeacherName(user.name); // Stocke le nom du professeur
      } catch (error) {
        console.error("Erreur lors de la récupération des infos de l'utilisateur :", error);
      }
    };

    fetchTeacherName();
  }, []);

  // Récupérer l'ID du professeur via l'API
  useEffect(() => {
    if (!teacherName) return; // Ne rien faire si le nom du professeur n'est pas encore disponible

    const fetchTeacherId = async () => {
      try {
        const response = await fetch(
          `${API_URL}/get-teacher-id?name=${encodeURIComponent(teacherName)}`
        );
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
  }, [teacherName]); // S'exécute uniquement si teacherName change

  // Fonction pour déterminer la couleur en fonction du score
  const getColor = (score) => {
    if (score >= 80) return "green";  // Très bon score
    if (score >= 50) return "orange"; // Moyen
    return "red";                     // Mauvais score
  };

  // Fonction pour extraire le texte d'une copie
  const extractText = async (submissionFile) => {
    try {
      const response = await fetch(`${API_URL}/extract-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_file: submissionFile }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.extractedText;
      } else {
        throw new Error(data.error || "Erreur lors de l'extraction du texte");
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction du texte :", error);
      throw error;
    }
  };

  // Fonction pour analyser le plagiat
  const analyzePlagiarism = async () => {
    if (!selectedStudent1 || !selectedStudent2) {
      setErrorAnalysis("Veuillez sélectionner deux élèves.");
      return;
    }

    setLoadingAnalysis(true);
    setErrorAnalysis("");
    setSimilarityScore(null);

    try {
      // Récupérer les fichiers des deux copies
      const copy1 = copies.find((copy) => copy.student_name === selectedStudent1);
      const copy2 = copies.find((copy) => copy.student_name === selectedStudent2);

      if (!copy1 || !copy2) {
        throw new Error("Copies non trouvées pour les élèves sélectionnés");
      }

      // Extraire le texte des deux copies
      const text1 = await extractText(copy1.submission_file);
      const text2 = await extractText(copy2.submission_file);

      setText1(text1);
      setText2(text2);

      // Comparer les textes pour obtenir un score de similarité
      const response = await fetch(`${API_URL}/compare-texts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text1, text2 }),
      });
      const data = await response.json();

      if (response.ok) {
        setSimilarityScore(data.similarityScore);
      } else {
        throw new Error(data.error || "Erreur lors de la comparaison des textes");
      }
    } catch (error) {
      setErrorAnalysis(error.message);
      console.error("Erreur lors de l'analyse du plagiat :", error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Récupérer les examens du professeur
  useEffect(() => {
    if (!teacherId) return; // Ne rien faire si l'ID du professeur n'est pas encore disponible

    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const response = await fetch(`${API_URL}/get-mes-sujets?id=${teacherId}`);
        const data = await response.json();
        if (response.ok) {
          setExams(data);
        } else {
          setErrorExams(data.message || "Erreur lors de la récupération des examens");
        }
      } catch (error) {
        setErrorExams("Erreur lors de la récupération des examens");
        console.error(error);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [teacherId]); // S'exécute uniquement si teacherId change

  // Récupérer les copies lorsque l'examen est sélectionné
  useEffect(() => {
    if (!selectedExam) return; // Ne rien faire si aucun examen n'est sélectionné

    const fetchCopies = async () => {
      setLoadingCopies(true);
      try {
        const response = await fetch(`${API_URL}/get-copies?exam_id=${selectedExam}`);
        const data = await response.json();
        if (response.ok) {
          setCopies(data);

          // Extraire les noms des élèves et les mettre dans la liste
          const studentNames = data.map((copy) => copy.student_name);
          setStudents(studentNames); // Une seule liste pour tous les élèves
        } else {
          setErrorCopies(data.message || "Erreur lors de la récupération des copies");
        }
      } catch (error) {
        setErrorCopies("Erreur lors de la récupération des copies");
        console.error(error);
      } finally {
        setLoadingCopies(false);
      }
    };

    fetchCopies();
  }, [selectedExam]); // S'exécute uniquement si selectedExam change

  return (
    <Container>
      {/* HEADER */}
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        🔍 Détection de Plagiat
      </Typography>

      {/* SELECTION D'UN EXAMEN */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Sélectionner un examen</InputLabel>
        <Select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          label="Sélectionner un examen"
          disabled={loadingExams || !teacherId} // Désactiver si les examens ne sont pas encore chargés ou si teacherId n'est pas disponible
        >
          {loadingExams ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : exams.length > 0 ? (
            exams.map((exam) => (
              <MenuItem key={exam.id} value={exam.id}>
                {exam.title}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Aucun examen disponible</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Afficher les erreurs de récupération des examens */}
      {errorExams && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorExams}
        </Alert>
      )}

      {/* DEUX FORMCONTROL POUR LES LISTES D'ÉLÈVES */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Liste 1 */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="list1-label">Élève 1</InputLabel>
            <Select
              labelId="list1-label"
              value={selectedStudent1}
              label="Élève 1"
              onChange={(e) => setSelectedStudent1(e.target.value)}
            >
              {students.map((eleve, index) => (
                <MenuItem key={index} value={eleve}>
                  {eleve}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Liste 2 */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="list2-label">Élève 2</InputLabel>
            <Select
              labelId="list2-label"
              value={selectedStudent2}
              label="Élève 2"
              onChange={(e) => setSelectedStudent2(e.target.value)}
            >
              {students.map((eleve, index) => (
                <MenuItem key={index} value={eleve}>
                  {eleve}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* BOUTON ANALYSER LE PLAGIAT */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 5 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={analyzePlagiarism}
          disabled={loadingAnalysis || !selectedStudent1 || !selectedStudent2}
        >
          {loadingAnalysis ? <CircularProgress size={24} /> : "Analyser le plagiat"}
        </Button>
      </Box>

      {/* Afficher les erreurs de récupération des copies */}
      {errorCopies && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorCopies}
        </Alert>
      )}

      {/* Afficher le chargement des copies */}
      {loadingCopies && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Afficher les résultats de l'analyse */}
      {similarityScore !== null && (
        <Paper elevation={3} sx={{ mt: 3, p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Résultats de l'analyse
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: getColor(similarityScore) }}>
            Score de similarité : {similarityScore}%
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Plagiarism;