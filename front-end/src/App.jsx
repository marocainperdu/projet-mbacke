import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez les composants de routage
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard'; // Importer le Dashboard
import Welcome from './Welcome'; // Importez le nouveau composant Welcome

const App = () => {
  return (
    <Router> {/* Enveloppez l'application avec Router */}
      <Routes> {/* Utilisez Routes pour définir les routes */}
        <Route path="/" element={<Login />} /> {/* Route pour la page de connexion */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} /> {/* Ajoutez la route pour Register */}
        <Route path="/welcome" element={<Welcome />} /> {/* Route pour la page de bienvenue */}
      </Routes>
    </Router>
  );
};

export default App;