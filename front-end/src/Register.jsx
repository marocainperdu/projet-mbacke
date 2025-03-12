import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // Valeur par défaut
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', {
        username,
        email,
        password,
        role,
      });

      console.log('Inscription réussie:', response.data);
      navigate('/'); // Redirige vers la page de connexion

    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
      console.error('Erreur d\'inscription:', err);
    }
  };


  return (
    <div style={styles.container}>
    <div style={styles.leftSide}>
      <h2 style={{ color: 'red' }}>Inscription</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {/* Ajout du champ de sélection pour le rôle */}
        <div style={styles.inputGroup}>
          <label htmlFor="role">Rôle:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="student">Étudiant</option>
            <option value="teacher">Enseignant</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>
          S'inscrire
        </button>
      </form>
    </div>
    <div style={styles.rightSide}>
      <div style={styles.examTextContainer}>
        <span style={styles.examText}>Examen Pro</span>
        <span style={styles.sticker}>📚</span>
      </div>
    </div>
  </div>
);
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    padding: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSide: {
    flexGrow: 1,
    display: 'flex',
    padding: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '380px',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
    color: '#CECECE',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  },
  examTextContainer: {
    textAlign: 'center',
    marginBottom: 200,
  },
  examText: {
    fontSize: '6em',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sticker: {
    fontSize: '4em',
    marginTop: '20px',
  },
};

export default Register;