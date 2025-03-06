const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "sql.momokabil.duckdns.org",
    user: "root",
    password: "7C2742Regy8kCC9VKYoub2",
    database: "mbacke-projet",
});

db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
        process.exit(1);
    }
    console.log("Connecté à la base de données");
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token manquant" });

    jwt.verify(token, 'votre_secret_jwt', (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalide" });
        req.user = user;
        next();
    });
};

app.post("/etudiant/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "etudiant";

    const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [username, email, hashedPassword, role], (err, results) => {
        if (err) {
            res.status(500).json({ message: "Erreur lors de l'inscription" });
        } else {
            res.status(201).json({ message: "Inscription réussie" });
        }
    });
});

app.post("/etudiant/login", async (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
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

app.get("/etudiant/examens", authenticateToken, (req, res) => {
    if (req.user.role !== 'etudiant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const query = "SELECT * FROM examens";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.json(results);
    });
});

app.post("/etudiant/examen/:examenId/soumettre", authenticateToken, (req, res) => {
    if (req.user.role !== 'etudiant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { fichier_pdf } = req.body;
    const examenId = req.params.examenId;

    const query = "INSERT INTO copies (examen_id, etudiant_id, fichier_pdf) VALUES (?, ?, ?)";
    db.query(query, [examenId, req.user.id, fichier_pdf], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la soumission de la copie" });
        }
        res.status(201).json({ message: "Copie soumise avec succès" });
    });
});

app.get("/etudiant/notes", authenticateToken, (req, res) => {
    if (req.user.role !== 'etudiant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const query = "SELECT e.titre, r.note FROM resultats r JOIN examens e ON r.examen_id = e.id WHERE r.etudiant_id = ?";
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.json(results);
    });
});

app.post("/etudiant/chatbot", authenticateToken, (req, res) => {
    if (req.user.role !== 'etudiant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { question } = req.body;
    const response = `Réponse automatique pour : "${question}"`;
    res.json({ message: response });
});

app.listen(PORT, () =>
