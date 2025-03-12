//require('dotenv').config

//const connection = require('./db-config')


const express = require('express')

const app = express()
const PORT = 5000;


const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'pedantic_mcnulty',
  user: 'root',
  database: 'mbacke-projet',
  // port: 3306,
  // password: '',
});

connection.addListener('error', (err) => {
  console.log(err);
});


/*

try {
  const connection = await mysql.createConnection({
    host: 'pedantic_mcnulty',
    user: 'root',
    database: 'mbacke-projet',
    // port: 3306,
    // password: '',
  });
} catch (err) {
  console.log(err);
}*/



/*
const db = mysql.createConnection({
    host: "pedantic_mcnulty", 
    user: "root",
    password: "",
    database: "mbacke-projet",
}); 

db.connect((err) => {
    if (err) {
        console.error("Erreur ", err);
        process.exit(1);
    }
    console.log("Connecté à la base de données");
});
*/


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
            res.status(200).json({ message: "Inscription réussie" });
          }
        });
      } catch (dbErr) {
        console.error("Erreur lors de l'exécution de la requête:", dbErr);
        res.status(500).json({ message: "Erreur lors de l'inscription (exécution de la requête)" });
      }
});


app.listen(process.PORT  , () => {

    console.log(`server is running on port ${process.PORT}`)
})