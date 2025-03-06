import React, { useState } from 'react';
import { useNavigate ,  Link} from 'react-router-dom'; // Importez useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Pour afficher les erreurs
  const navigate = useNavigate(); // Initialisez navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Constantes pour simuler l'authentification
    const validEmail = 'test@example.com';
    const validPassword = 'password';

    if (email === validEmail && password === validPassword) {
      // Authentification réussie
      console.log('Authentification réussie !');
      localStorage.setItem('userEmail', email); // Stocker l'email
      navigate('/dashboard'); // Redirige vers /dashboard
    } else {
      // Authentification échouée
      setError('Email ou mot de passe incorrect.'); // Affiche un message d'erreur
      console.log('Authentification échouée.');
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.leftSide}>

        <h2 style={{ color: 'red' }}>Connexion</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche l'erreur si elle existe */}
        <form onSubmit={handleSubmit} style={styles.form}>
        
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
          <button type="submit" style={styles.button}>Se connecter</button>

        </form>

        <p style={{ color: 'black', marginLeft:'200px', }}>Pas de compte ? <Link to="/register">S'incrire</Link></p>  

      </div>
      

      <div style={styles.rightSide}> {/* Nouveau div pour la partie droite */}
        <div style={styles.examTextContainer}> {/* Div pour centrer le texte */}
          <span style={styles.examText}>Examen Pro</span> {/* Le texte "Exams" */}
          <span style={styles.sticker}>📚</span> {/* Ajoutez le sticker ici */}
        </div>
      </div>


    </div>
  );

};

/*
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',

  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
    color : '#CECECE',
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
};*/

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  leftSide: {
    flex: 1, // Peut être conservé ou ajusté
    display: 'flex',
    padding:200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSide: {
    flexGrow: 1, // Prend tout l'espace restant
    display: 'flex',
    padding : 100,
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
  examTextContainer: { // Style pour le conteneur du texte "Exams"
    textAlign: 'center', // Centre le texte horizontalement
    marginBottom : 200,
  },
  examText: { // Style pour le texte "Exams"
    fontSize: '6em', // Taille de la police 
    fontWeight: 'bold', // Gras 
    color: '#FFFFFF', // Couleur du texte 
  },
  sticker: {
    fontSize: '4em', // Ajustez la taille du sticker
    marginTop: '20px', // Ajoutez une marge au-dessus du sticker
  },

};


export default Login;