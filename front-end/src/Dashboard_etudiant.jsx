import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const student = {
    firstName: 'Étudiant',
    lastName: 'DIALLO',
    email: 'etudiant@example.com',
  };

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/exams")
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API exams :", err));

    axios.get("http://localhost:5000/api/results")
      .then((res) => setResults(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API results :", err));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile || !selectedExam) {
      setUploadMessage("Veuillez sélectionner un fichier et un examen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("student_id", 2);
    formData.append("exam_id", selectedExam);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage(response.data.message);
      setSelectedFile(null);
      setSelectedExam("");
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      setUploadMessage("Échec de l'envoi du fichier.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Bienvenue dans Exam Pro</h1>
      </header>
      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <div style={styles.studentInfo}>
            <img src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_1280.png" alt="Avatar de l'étudiant" style={styles.avatar} />
            <h2 style={{ color: 'black' }}>{student.firstName} {student.lastName}</h2>
            <p style={{ color: 'black' }}>{student.email}</p>
          </div>
          <button style={styles.logoutButton}>Déconnexion</button>
        </aside>
        <main style={styles.mainContent}>
          <div style={styles.sectionsContainer}>
            <section style={styles.uploadSection}>
              <h2>📤 Soumettre un devoir</h2>
              <form onSubmit={handleUpload}>
                <label>Sélectionnez un examen :</label>
                <select value={selectedExam} onChange={handleExamChange} required style={styles.input}>
                  <option value="">-- Choisir un examen --</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>{exam.title}</option>
                  ))}
                </select>
                <input type="file" onChange={handleFileChange} required style={styles.input} />
                <button type="submit" style={styles.uploadButton}>Télécharger</button>
              </form>
              {uploadMessage && <p style={styles.successMessage}>{uploadMessage}</p>}
            </section>
          </div>

          <section style={styles.tableSection}>
            <h2>📚 Examens Disponibles</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Examen</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.length > 0 ? (
                  exams.map((exam) => (
                    <tr key={exam.id}>
                      <td>{exam.title}</td>
                      <td>{exam.date}</td>
                      <td><Link to={`/exam/${exam.id}`} style={styles.link}>Accéder</Link></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">Aucun examen disponible.</td></tr>
                )}
              </tbody>
            </table>
          </section>

          <section style={styles.tableSection}>
            <h2>🏆 Résultats</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Examen</th>
                  <th>Note</th>
                  <th>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.examTitle}</td>
                      <td>{result.grade}/20</td>
                      <td>{result.comments}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">Aucun résultat disponible.</td></tr>
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1e1e1e',
  },
  header: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  logoutButton: {
    marginTop: '225px',
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  uploadButton: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  tableSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
};

export default StudentDashboard;
