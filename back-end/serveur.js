require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",  // Remplace par l'origine de ton frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    allowedHeaders: ["Content-Type"] // En-têtes autorisés
}));

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


app.post("/api/new-user", async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Hachage du mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Requête SQL pour insérer l'utilisateur dans la base de données
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

// Notifications
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

// Fonction de création de notification
const createNotification = (userId, message) => {
    const query = "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
    db.query(query, [userId, message], (err) => {
        if (err) console.error("❌ Erreur lors de la création de la notification :", err);
    });
};

// Création d'un examen
app.post("/enseignant/examen", (req, res) => {
    const { titre, description, date_debut, date_fin, duree } = req.body;
    const query = "INSERT INTO examens (titre, description, date_debut, date_fin, duree) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [titre, description, date_debut, date_fin, duree], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la création de l'examen" });

        createNotification(req.body.userId, `Votre examen "${titre}" a été créé.`);
        res.status(201).json({ message: "Examen créé avec succès", id: results.insertId });
    });
});

// Routes test
app.get("/jeledonneaprs", (req, res) => {
    res.send("Bienvenue");
});

app.get("/after", (req, res) => {
    db.query("SELECT * FROM votre_table", (err, results) => {
        if (err) {
            console.error("❌ Erreur :", err);
            return res.status(500).json({ error: "Erreur" });
        }
        res.json(results);
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
});
