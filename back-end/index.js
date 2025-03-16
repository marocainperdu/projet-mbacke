require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

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


// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token manquant" });

    jwt.verify(token, 'votre_secret_jwt', (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalide" });
        req.user = user;
        next();
    });
};



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


/* // Route de connexion
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    });
});
*/


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("Login request received for email:", email); // Log email

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Error fetching user:", err); // Log error
            return res.status(500).json({ message: "Erreur serveur" });
        }
        if (results.length === 0) {
            console.log("User not found for email:", email); // Log user not found
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            console.log("Invalid password for email:", email); // Log incorrect password
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        const usernameQuery = "SELECT username FROM users WHERE email = ?";
        connection.query(usernameQuery, [email], (usernameErr, usernameResults) => {
            if (usernameErr) {
                console.error("Error fetching username:", usernameErr); // Log username error
                return res.status(500).json({ message: "Erreur serveur lors de la récupération du nom d'utilisateur" });
            }

            if (usernameResults.length === 0) {
                console.log("Username not found for email:", email);
                return res.status(500).json({ message: "Username not found" });
            }

            const username = usernameResults[0].username;

            console.log("Username fetched:", username); // Log username

            res.json({
                token,
                user: { id: user.id, email: user.email, role: user.role, username: username }
            });
        });
    });
});


// Routes spécifiques aux enseignants
app.get("/dashboard", authenticateToken, (req, res) => {
    if (req.user.role !== 'enseignant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const query = "SELECT * FROM examens WHERE enseignant_id = ?";
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.json(results);
    });
});


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});