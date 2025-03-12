import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez les composants de routage
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout'; // Importer la page Logout
import Dashboard from './pages/Prof/DashboardProf'; // Importer le Dashboard

const App = () => {
  return (
    <Router> {/* Enveloppez l'application avec Router */}
      <Routes> {/* Utilisez Routes pour définir les routes */}
        <Route path="/" element={<Login />}  />
        <Route path="/login" element={<Login />}  /> {/* Route pour la page de connexion */}
        <Route path="/dashprof" element={<Dashboard />} />
        <Route path="/register" element={<Register />} /> {/* Ajoutez la route pour Register */}
        <Route path="/logout" element={<Logout />} /> {/* Ajoutez la route pour Logout */}
      </Routes>
    </Router>
  );
};

export default App;
