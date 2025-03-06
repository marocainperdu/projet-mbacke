import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez les composants de routage
import Login from './Login';
import Dashboard from './Dashboard'; // Importer le Dashboard
import Register from './Register';

const App = () => {
  return (
    <Router> {/* Enveloppez l'application avec Router */}
      <Routes> {/* Utilisez Routes pour définir les routes */}
        <Route path="/" element={<Login />} /> {/* Route pour la page de connexion */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} /> {/* Ajoutez la route pour Register */}
      </Routes>
    </Router>
  );
};

export default App;