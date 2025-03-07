import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import axios from 'axios';


const StudentDashboard = () => {
  const student = {
    firstName: 'Étudiant',
    lastName: 'DIALLO',
    email: 'etudiant@example.com',
  };
 
    
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  // const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [stats, setStats] = useState(null);
  const [copies, setCopies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/exams")
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API exams :", err));

    axios.get("http://localhost:5000/api/results")
      .then((res) => setResults(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API results :", err));
  }, []);

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleUpload = () => {
    if (file) {
      // ... (Envoyer le fichier à l'API) ...
      alert(`Fichier "${fileName}" uploadé avec succès!`);
      setFile(null);
      setFileName('');
    } else {
      alert('Veuillez sélectionner un fichier.');
    }
  };

  // const handleUpload = async (event) => {
  //   event.preventDefault();

  //   if (!selectedFile || !selectedExam) {
  //     setUploadMessage("Veuillez sélectionner un fichier et un examen.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", selectedFile);
  //   formData.append("student_id", 2);
  //   formData.append("exam_id", selectedExam);

  //   try {
  //     const response = await axios.post("http://localhost:5000/api/upload", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     setUploadMessage(response.data.message);
  //     setSelectedFile(null);
  //     setSelectedExam("");
  //   } catch (error) {
  //     console.error("Erreur lors de l'upload :", error);
  //     setUploadMessage("Échec de l'envoi du fichier.");
  //   }
  // };

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
          <button onClick={handleLogout} style={styles.logoutButton}>Déconnexion</button>
        </aside>
        <main style={styles.mainContent}>
          <div style={styles.sectionsContainer}>
            <section style={styles.uploadSection}>
              <h2>📤 Soumettre un devoir</h2>
              <input type="file" onChange={handleFileChange} />
              {fileName && <p>Fichier sélectionné: {fileName}</p>}
              <button onClick={handleUpload} style={styles.uploadButton}>Télécharger</button>
              {/* <form onSubmit={handleUpload}>
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
              {uploadMessage && <p style={styles.successMessage}>{uploadMessage}</p>}*/}
             </section> 
             <section style={styles.statsSection}>
              {stats ? (
                <>
                  <h2>Statistiques</h2>
                  <p>Moyenne: {stats.moyenne}</p>
                  <p>Distribution des notes: {stats.distribution}</p>
                  {/* ... autres statistiques ... */}
                </>
              ) : (
                <p style={{ color: '#ff3333', marginTop:'50px' } } >Aucune note n'est encore enregistrée !! </p>
              )}
            </section>
             
          </div> 

          {/* <section style={styles.tableSection}>
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
          </section> */}
         
          {/* <section style={styles.tableSection}>
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
          </section> */}

            <section style={styles.copiesSection}>
              <h2>vos notes</h2>
              <table style={styles.copiesTable}>
                <thead style={styles.copiesTableHead}>
                  <tr style={styles.copiesTableTrHover}>
                    <th style={styles.copiesTableTh}>professeur</th>
                    <th style={styles.copiesTableTh}>Date de soumission</th>
                    <th style={styles.copiesTableTh}>Copie</th>
                    <th style={styles.copiesTableTh}>Note</th>
                    <th style={styles.copiesTableTh}>Commentaire</th>
                    <th style={styles.copiesTableTh}>Action</th>
                  </tr>
                </thead>
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
    width: '100%',
    flexDirection: 'column',
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
  studentInfo: {
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
  mainContent: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%', // Assure que mainContent prend toute la largeur
  },

  sectionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end', // Aligne la section des copies à la fin
    width: '100%',
  },

  uploadSection: {
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginRight: '150px',
    marginLeft: '20px',
    marginTop: '20px',
    width: '45%', // Ajuste la largeur pour laisser de l'espace à l'autre section
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

  logoutButton: { // Style pour le bouton de déconnexion
    marginTop: '225px',
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },


  copiesSection: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: '50px',
    marginLeft: '20px',
  },

  copiesTableTh: {
    padding: '12px 20px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    color: '#333', // Couleur du texte gris foncé
  },

  copiesTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },

  copiesTableHead: {
    backgroundColor: '#f2f2f2',
  },

  copiesTableTrHover: {
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },

  statsSection: {
    border: (stats) => (stats ? '1px solid #ddd' : 'none'), // Bordures conditionnelles
    padding: '20px',
    borderRadius: '8px',
    boxShadow: (stats) => (stats ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'), // Ombre conditionnelle
    marginTop: '20px',
    marginLeft: '250px',
    width: '50%',
  },
};

export default StudentDashboard;
