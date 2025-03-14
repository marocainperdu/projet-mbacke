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
  LinearProgress,
  TextField,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Plagiarism = () => {
  const [copies, setCopies] = useState([
    {
      id: 1,
      student: "Ali Sow",
      file: "devoir_math.pdf",
      similarity: 85,
      comment: "",
      status: "suspect",
    },
    {
      id: 2,
      student: "Sophie Ndiaye",
      file: "devoir_physique.pdf",
      similarity: 20,
      comment: "",
      status: "valide",
    },
  ]);

  const handleValidate = (index) => {
    let updatedCopies = [...copies];
    updatedCopies[index].status = "valide";
    setCopies(updatedCopies);
  };

  const handleCommentChange = (index, value) => {
    let updatedCopies = [...copies];
    updatedCopies[index].comment = value;
    setCopies(updatedCopies);
  };

  return (
    <Container>
      {/* HEADER */}
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        🔍 Détection de Plagiat
      </Typography>

      {/* TABLE DES COPIES */}
      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Étudiant</TableCell>
              <TableCell sx={{ width: "20%" }}>Fichier</TableCell>
              <TableCell sx={{ width: "20%" }}>Taux de similitude</TableCell>
              <TableCell sx={{ width: "25%" }}>Commentaire</TableCell>
              <TableCell sx={{ width: "15%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {copies.length > 0 ? (
              copies.map((copy, index) => (
                <TableRow key={copy.id}>
                  <TableCell>{copy.student}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => alert("Téléchargement de " + copy.file)}
                    >
                      {copy.file}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={copy.similarity}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#ddd",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: copy.similarity > 50 ? "#e74c3c" : "#2ecc71",
                        },
                      }}
                    />
                    <Typography align="center" sx={{ mt: 1 }}>
                      {copy.similarity}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={copy.comment}
                      placeholder="Ajouter un commentaire..."
                      onChange={(e) => handleCommentChange(index, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    {copy.status === "suspect" ? (
                      <IconButton color="warning" onClick={() => handleValidate(index)}>
                        <WarningAmberIcon />
                      </IconButton>
                    ) : (
                      <IconButton color="success">
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucune copie analysée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Plagiarism;
