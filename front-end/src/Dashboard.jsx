import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const teacher = {
    firstName: 'Abdoul Aziz',
    lastName: 'KANE',
    email: 'kaneaboul551@gmail.com',
  };

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [copies, setCopies] = useState([]);
  const [stats, setStats] = useState(null); // Pour les statistiques

  useEffect(() => {
    // Fonction pour récupérer les copies et les statistiques
    const fetchData = async () => {
      // ... (Récupérer les copies et les statistiques depuis l'API) ...
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
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

  const handleValidateNote = (copyId, newNote) => {
    // ... (Envoyer la note validée à l'API) ...
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Bienvenue dans Exam Pro</h1>
      </header>
      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <div style={styles.teacherInfo}>
            <img src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_1280.png" alt="Avatar de l'enseignant" style={styles.avatar} />
            <h2 style={{ color: 'black' }}>{teacher.firstName} {teacher.lastName}</h2>
            <p style={{ color: 'black' }}>{teacher.email}</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>Déconnexion</button>
        </aside>
        <main style={styles.mainContent}>
          <div style={styles.sectionsContainer}>
            <section style={styles.uploadSection}>
              <h2>Déposer un sujet d'examen</h2>
              <input type="file" onChange={handleFileChange} />
              {fileName && <p>Fichier sélectionné: {fileName}</p>}
              <button onClick={handleUpload} style={styles.uploadButton}>Télécharger</button>
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

          <section style={styles.copiesSection}>
              <h2>Copies soumises</h2>
              <table style={styles.copiesTable}>
                <thead style={styles.copiesTableHead}>
                  <tr style={styles.copiesTableTrHover}>
                    <th style={styles.copiesTableTh}>Étudiant</th>
                    <th style={styles.copiesTableTh}>Date de soumission</th>
                    <th style={styles.copiesTableTh}>Copie</th>
                    <th style={styles.copiesTableTh}>Note (IA)</th>
                    <th style={styles.copiesTableTh}>Note validée</th>
                    <th style={styles.copiesTableTh}>Action</th>
                  </tr>
                </thead>
               {/* <tbody>
                  {copies.map((copie) => (
                    <tr key={copie.id}>
                      <td style={styles.copiesTableTd}>{copie.etudiant}</td>
                      <td style={styles.copiesTableTd}>{copie.dateSoumission}</td>
                      <td style={styles.copiesTableTd}>
                        <a style={styles.copiesLink} href={copie.lienFichier} target="_blank" rel="noopener noreferrer">Télécharger</a>
                      </td>
                      <td style={styles.copiesTableTd}>{copie.noteIA}</td>
                      <td style={styles.copiesTableTd}>
                        <input type="number" defaultValue={copie.noteValidee} onChange={(e) => handleValidateNote(copie.id, e.target.value)} />
                      </td>
                      <td style={styles.copiesTableTd}>
                        <button onClick={() => handleValidateNote(copie.id, copie.noteValidee)}>Valider</button>
                      </td>
                    </tr>
                  ))}
                </tbody>*/}
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
  teacherInfo: {
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


  /*

statsSection: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },

  copiesTableTd: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
  },
  
  copiesLink: {
    color: '#3498db',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },*/


};

export default Dashboard;