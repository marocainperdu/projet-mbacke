const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host: "db", 
    user: "root",
    password: "2004super",
    database: "mbacke-projet",
});

db.connect((err) => {
    if (err) {
        console.error("Erreur ", err);
        process.exit(1);
    }
    console.log("Connecté ");
});


app.get("/jeledonneaprs", (req, res) => {
    res.send("Bienvenue sur l'API backend !");
});


app.get("after", (req, res) => {
    db.query("Requete souhaitee", (err, results) => {
        if (err) {
            console.error("Erreur", err);
            res.status(500).json({ error: "Erreur serveur" });
        } else {
            res.json(results);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});

