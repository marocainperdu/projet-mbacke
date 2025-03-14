require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

app.use(cors()); // Utiliser le middleware cors pour toutes les requêtes

const PORT = 5000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mbacke-projet',
    port: 3306,
    password : 'passer',
});

connection.on('error', (err) => {
    console.error('Erreur de connexion à la base de données :', err);
});

app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "Données manquantes" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
        connection.query(query, [username, email, hashedPassword, role], (err, results) => {
            if (err) {
                console.error("Erreur de base de données:", err);
                return res.status(500).json({ message: "Erreur lors de l'inscription (base de données)" });
            }
            return res.status(200).json({ message: "Inscription réussie" });
        });
    } catch (err) {
        console.error("Erreur lors de l'inscription:", err);
        return res.status(500).json({ message: "Erreur lors de l'inscriptionss" });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});