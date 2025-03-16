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
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const Papers = () => {
  const [copies, setCopies] = useState([
    {
      id: 1,
      student: "Ali Sow",
      dateSubmitted: "2025-03-10",
      file: "devoir_math.pdf",
      autoGrade: 15,
      finalGrade: 15,
      comment: "",
    },
    {
      id: 2,
      student: "Sophie Ndiaye",
      dateSubmitted: "2025-03-12",
      file: "devoir_physique.pdf",
      autoGrade: 12,
      finalGrade: 12,
      comment: "",
    },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [newGrade, setNewGrade] = useState("");
  const [newComment, setNewComment] = useState("");

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewGrade(copies[index].finalGrade);
    setNewComment(copies[index].comment);
  };

  const handleSave = (index) => {
    let updatedCopies = [...copies];
    updatedCopies[index].finalGrade = newGrade;
    updatedCopies[index].comment = newComment;
    setCopies(updatedCopies);
    setEditIndex(null);
  };

  return (
    <Container>
      {/* HEADER */}
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        📄 Copies et Corrections
      </Typography>

      {/* TABLE DES COPIES */}
      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Étudiant</TableCell>
              <TableCell sx={{ width: "15%" }}>Date de soumission</TableCell>
              <TableCell sx={{ width: "20%" }}>Fichier</TableCell>
              <TableCell sx={{ width: "10%" }}>Note (IA)</TableCell>
              <TableCell sx={{ width: "10%" }}>Note finale</TableCell>
              <TableCell sx={{ width: "20%" }}>Commentaire</TableCell>
              <TableCell sx={{ width: "5%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {copies.length > 0 ? (
              copies.map((copy, index) => (
                <TableRow key={copy.id}>
                  <TableCell>{copy.student}</TableCell>
                  <TableCell>{copy.dateSubmitted}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => alert("Téléchargement de " + copy.file)}
                    >
                      {copy.file}
                    </Button>
                  </TableCell>
                  <TableCell>{copy.autoGrade}/20</TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        type="number"
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        sx={{ width: "50px" }}
                      />
                    ) : (
                      `${copy.finalGrade}/20`
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        fullWidth
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    ) : (
                      copy.comment || "Aucun commentaire"
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <IconButton color="success" onClick={() => handleSave(index)}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton color="primary" onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucune copie disponible
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
