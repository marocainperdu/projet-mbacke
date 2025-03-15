require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173", // Remplace par l'origine de ton frontend
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type"]
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour parser les requêtes form-data

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const fileExtension = file.originalname.split(".").pop();
      const fileName = `${req.body.teacher_id}-${Date.now()}.${fileExtension}`;
      cb(null, fileName);
    },
  });
  const upload = multer({ storage: storage });

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
        if (err) return res.status(500).json({ error: 'Erreur de base de données' });
        if (result.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
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
    const sql = `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`;

    db.query(sql, [email, hashedPassword, name, role], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de l'insertion dans la base de données" });
        res.status(201).json({ message: "Utilisateur ajouté avec succès", userId: results.insertId });
    });
});

// Gestion des notifications
app.get("/notifications", (req, res) => {
    db.query("SELECT * FROM notifications ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération des notifications" });
        res.json(results);
    });
});

app.put("/notifications/:id/read", (req, res) => {
    db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour de la notification" });
        res.json({ message: "Notification marquée comme lue" });
    });
});

app.delete("/notifications/:id", (req, res) => {
    db.query("DELETE FROM notifications WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la suppression de la notification" });
        res.json({ message: "Notification supprimée" });
    });
});

// Ajout d'un examen
app.post("/add-exam", (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: "Erreur lors du téléchargement du fichier" });
      }
  
      const { title, description, teacher_id, deadline } = req.body;
      const file_path = req.file ? `/uploads/${req.file.filename}` : null;
  
      if (!title || !description || !teacher_id || !file_path || !deadline) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }
  
      db.query(
        "INSERT INTO exams (title, description, teacher_id, deadline, file_path) VALUES (?, ?, ?, ?, ?)",
        [title, description, teacher_id, deadline, file_path],
        (err, result) => {
          if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur lors de l'ajout de l'examen" });
          }
          res.json({ success: true, exam_id: result.insertId, file_path });
        }
      );
    });
  });
  
// Récupération des examens
app.get("/get-sujets", (req, res) => {
    db.query("SELECT * FROM exams ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération des sujets" });
        res.json(results);
    });
});

// Suppression d'un sujet
app.delete("/subjects/:id", (req, res) => {
    db.query("DELETE FROM exams WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la suppression du sujet" });
        res.json({ message: "Sujet supprimé avec succès" });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
});
