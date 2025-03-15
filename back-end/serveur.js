require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",  // Remplace par l'origine de ton frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    allowedHeaders: ["Content-Type"] // En-têtes autorisés
}));

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

app.use(express.json());

// Connexion sécurisée à MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("❌ Erreur de connexion à MySQL :", err);
        process.exit(1);
    }
    console.log("✅ Connecté à MySQL");
});

app.get('/get-teacher-id', (req, res) => {
    const { name } = req.query;
  
    db.query('SELECT id FROM users WHERE name = ?', [name], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur de base de données' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      res.json({ teacher_id: result[0].id });
    });
  });

// Création d'un Utilisateur
app.post("/api/new-user", async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (email, password, name, role) 
      VALUES (?, ?, ?, ?)
    `;
  
    db.query(sql, [email, hashedPassword, name, role], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erreur lors de l'insertion dans la base de données" });
        }
  
        return res.status(201).json({ message: "Utilisateur ajouté avec succès", userId: results.insertId });
    });
});

// Afficher les notifications
app.get("/notifications", (req, res) => {
    const query = "SELECT * FROM notifications ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération des notifications" });
        res.json(results);
    });
});

// Marquer une notification comme lue
app.put("/notifications/:id/read", (req, res) => {
    const query = "UPDATE notifications SET is_read = 1 WHERE id = ?";
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour de la notification" });
        res.json({ message: "Notification marquée comme lue" });
    });
});

// Supprimer une notification
app.delete("/notifications/:id", (req, res) => {
    const query = "DELETE FROM notifications WHERE id = ?";
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la suppression de la notification" });
        res.json({ message: "Notification supprimée" });
    });
});

// Créer un nouveau sujet
app.post('/add-exam', (req, res) => {
    const { title, description, file_path, teacher_id } = req.body;
  
    db.query(
      'INSERT INTO exams (title, description, file_path, teacher_id) VALUES (?, ?, ?, ?)',
      [title, description, file_path, teacher_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'examen' });
        }
        res.json({ success: true, exam_id: result.insertId });
      }
    );
  });  

// Récupérer tous les sujets
app.get("/get-sujets", (req, res) => {
    const query = "SELECT * FROM sujets ORDER BY deadline DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération des sujets" });
        res.json(results);
    });
});

// Supprimer un sujet
app.delete("/api/sujets/:id", (req, res) => {
    const query = "DELETE FROM sujets WHERE id = ?";
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la suppression du sujet" });
        res.json({ message: "Sujet supprimé avec succès" });
    });
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
});
