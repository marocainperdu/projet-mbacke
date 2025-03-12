const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.listen(process.PORT, () =>{
    console.log('Le serveur est ouvert')
})

const db = mysql.createConnection({
    host: "sql.momokabil.duckdns.org", 
    user: "root",
    password: "7C2742Regy8kCC9VKYoub2",
    database: "mbacke-projet",
});

db.connect((err) => {
    if (err) {
        console.error("Erreur ", err);
        process.exit(1);
    }
    console.log("Connecté à la base de données");
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

// Route d'inscription
app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    try {
        db.query(query, [username, email, hashedPassword, role], (err, results) => {
          if (err) {
            console.error("Erreur de base de données:", err);
            res.status(500).json({ message: "Erreur lors de l'inscription (base de données)" });
          } else {
            res.status(201).json({ message: "Inscription réussie" });
          }
        });
      } catch (dbErr) {
        console.error("Erreur lors de l'exécution de la requête:", dbErr);
        res.status(500).json({ message: "Erreur lors de l'inscription (exécution de la requête)" });
      }
});

// Route de connexion
app.post("/login", async (req, res) => {
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

// Routes spécifiques aux enseignants
app.get("/enseignant/dashboard", authenticateToken, (req, res) => {
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

// Création d'un examen
app.post("/enseignant/examen", authenticateToken, (req, res) => {
    if (req.user.role !== 'enseignant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { titre, description, date_debut, date_fin, duree } = req.body;
    const query = "INSERT INTO examens (titre, description, date_debut, date_fin, duree, enseignant_id) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(query, [titre, description, date_debut, date_fin, duree, req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la création de l'examen" });
        }
        res.status(201).json({ message: "Examen créé avec succès", id: results.insertId });
    });
});

// Ajout de questions à un examen
app.post("/enseignant/examen/:examenId/questions", authenticateToken, (req, res) => {
    if (req.user.role !== 'enseignant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { questions } = req.body;
    const examenId = req.params.examenId;

    // Vérifier que l'examen appartient à l'enseignant
    const checkQuery = "SELECT * FROM examens WHERE id = ? AND enseignant_id = ?";
    db.query(checkQuery, [examenId, req.user.id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({ message: "Accès non autorisé à cet examen" });
        }

        // Insérer les questions
        const insertQuery = "INSERT INTO questions (examen_id, question, reponse_correcte, points) VALUES ?";
        const values = questions.map(q => [examenId, q.question, q.reponse_correcte, q.points]);
        
        db.query(insertQuery, [values], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de l'ajout des questions" });
            }
            res.status(201).json({ message: "Questions ajoutées avec succès" });
        });
    });
});

// Obtenir les résultats d'un examen
app.get("/enseignant/examen/:examenId/resultats", authenticateToken, (req, res) => {
    if (req.user.role !== 'enseignant') {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    const examenId = req.params.examenId;
    const query = `
        SELECT r.*, u.username 
        FROM resultats r 
        JOIN users u ON r.etudiant_id = u.id 
        WHERE r.examen_id = ? AND r.examen_id IN (SELECT id FROM examens WHERE enseignant_id = ?)
    `;

    db.query(query, [examenId, req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.json(results);
    });
});

app.get("/jeledonneaprs", (req, res) => {
    res.send("Bienvenue");
});

app.get("after", (req, res) => {
    db.query("Requete souhaitee", (err, results) => {
        if (err) {
            console.error("Erreur", err);
            res.status(500).json({ error: "Erreur" });
        } else {
            res.json(results);
        }
    });
});

app.listen(PORT, 'localhost', () => {
    console.log(`Serveur démarré http://localhost:${PORT}`);
});
