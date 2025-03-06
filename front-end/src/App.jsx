import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez les composants de routage
import Login from './Login';
<<<<<<< HEAD
import Dashboard from './Dashboard'; // Importer le Dashboard
=======
>>>>>>> a3cade8bbc3ef086241b230097d43083a0a7ebc1

const App = () => {
  return (
    <Router> {/* Enveloppez l'application avec Router */}
      <Routes> {/* Utilisez Routes pour définir les routes */}
        <Route path="/" element={<Login />} /> {/* Route pour la page de connexion */}
<<<<<<< HEAD
        <Route path="/dashboard" element={<Dashboard />} />
=======
>>>>>>> a3cade8bbc3ef086241b230097d43083a0a7ebc1
      </Routes>
    </Router>
  );
};

export default App;
