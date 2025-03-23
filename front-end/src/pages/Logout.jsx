// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import config from '../config';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const client = new Client();
      client.setEndpoint(config.apiEndpoint).setProject(config.projectId);
      const account = new Account(client);

      try {
        await account.deleteSession('current');  // Supprimer la session courante
        sessionStorage.removeItem('jwt');  // Supprimer le JWT du sessionStorage
        navigate('/');  // Rediriger vers la page de connexion
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    };

    handleLogout();
  }, [navigate]);
};

export default Logout;
