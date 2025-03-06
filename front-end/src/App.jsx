import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez les composants de routage
import Login from './Login';

const App = () => {
  return (
    <Router> {/* Enveloppez l'application avec Router */}
      <Routes> {/* Utilisez Routes pour définir les routes */}
        <Route path="/" element={<Login />} /> {/* Route pour la page de connexion */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
