require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const Groq = require('groq-sdk');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS plus permissive pour le développement
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour parser les requêtes form-data

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

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

app.post("/compare-texts", (req, res) => {
  const { text1, text2 } = req.body;

  if (!text1 || !text2) {
    return res.status(400).json({ error: "Les deux textes sont requis" });
  }

  try {
    // Calculer la similarité cosinus (exemple simple)
    const similarityScore = calculateCosineSimilarity(text1, text2);
    res.json({ similarityScore });
  } catch (error) {
    console.error("❌ Erreur lors de la comparaison des textes :", error);
    res.status(500).json({ error: "Erreur lors de la comparaison des textes" });
  }
});

// Fonction pour calculer la similarité cosinus
function calculateCosineSimilarity(text1, text2) {
  const vector1 = text1.split(" ");
  const vector2 = text2.split(" ");

  const intersection = vector1.filter((word) => vector2.includes(word));
  const similarity = (intersection.length / Math.sqrt(vector1.length * vector2.length)) * 100;

  return Math.round(similarity * 100) / 100; // Arrondir à 2 décimales
}

app.post("/grade-copy", (req, res) => {
    const { text, submission_id, teacher_id } = req.body;

    console.log("📩 Requête reçue pour /grade-copy avec texte:", text.slice(0, 100) + "...");

    if (!text || !submission_id || !teacher_id) {
        console.error("❌ Données manquantes !");
        return res.status(400).json({ error: "Texte, ID de soumission ou professeur manquant" });
    }

    const prompt = `
    Voici une copie d'examen :
    ${text}
    
    Évalue cette copie sur 20 en fonction de la qualité des réponses. 
    Donne uniquement un nombre entre 0 et 20, sans explication.
    `;

    client.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            { role: "system", content: "Tu es un professeur qui corrige des copies." },
            { role: "user", content: prompt }
        ],
        max_tokens: 10,
        temperature: 0
    })
    .then((response) => {
        console.log("🧠 Réponse IA brute:", response);

        if (!response.choices || response.choices.length === 0) {
            throw new Error("Réponse IA vide");
        }

        const finalGrade = response.choices[0].message.content.trim();
        console.log("✅ Note attribuée par l'IA :", finalGrade);

        // 🔥 ➜ Mise à jour de la BD
        const updateQuery = `
            UPDATE grades
            SET grade = ?, corrected_by = ?
            WHERE submission_id = ?
        `;

        db.query(updateQuery, [finalGrade, teacher_id, submission_id], (err, result) => {
            if (err) {
                console.error("❌ Erreur SQL lors de la mise à jour :", err);
                return res.status(500).json({ error: "Erreur lors de la mise à jour de la note" });
            }

            console.log("✅ Note mise à jour avec succès !");
            res.json({ finalGrade });
        });
    })
    .catch((error) => {
        console.error("❌ Erreur d'évaluation :", error);
        res.status(500).json({ error: "Erreur de notation par l'IA" });
    });
});

app.post("/extract-text", (req, res) => {
    console.log("📥 Données reçues:", req.body);

    const { submission_file } = req.body;

    const filePath = path.join(__dirname, submission_file);

    if (!fs.existsSync(filePath)) {
        console.error("❌ Fichier introuvable :", filePath);
        return res.status(404).json({ error: "Fichier non trouvé" });
    }

    console.log("📄 Lecture du fichier :", filePath);
    const dataBuffer = fs.readFileSync(filePath);

    pdfParse(dataBuffer)
        .then((pdfData) => {
            console.log("✅ Extraction réussie !");
            res.json({ extractedText: pdfData.text });
        })
        .catch((error) => {
            console.error("❌ Erreur d'extraction du texte :", error);
            res.status(500).json({ error: "Erreur d'extraction du texte" });
        });
});



const client = new Groq({
    apiKey: process.env.GROQ_API_KEY, // Sécurisé avec dotenv
  });

  app.post('/chat', async (req, res) => {
    try {
      const { message } = req.body;
  
      // Optionnel: Tronquer le message pour limiter le nombre de tokens (par exemple, à 512 tokens max)
      const maxTokens = 512;  // Nombre maximum de tokens que tu veux utiliser
      let truncatedMessage = message;
  
      if (message.length > maxTokens) {
        truncatedMessage = message.slice(0, maxTokens);  // Tronquer le message
      }
  
      // Appel à l'API avec LLaMA 70B
      const response = await client.chat.completions.create({
        model: 'llama-3.1-8b-instant',  // Utiliser le modèle LLaMA 70B
        messages: [{ role: 'user', content: truncatedMessage }],
      });
  
      // Retourner la réponse
      res.json({ reply: response.choices?.[0]?.message?.content || "Je n'ai pas compris." });
    } catch (error) {
      console.error('Erreur API:', error);
      res.status(500).json({ error: 'Erreur de connexion au chatbot' });
    }
  });
  

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/get-teacher-id', (req, res) => {
    console.log("Requête get-teacher-id reçue");
    const { name } = req.query;
    
    if (!name) {
        return res.status(400).json({ error: 'Nom requis' });
    }

    const query = 'SELECT id FROM users WHERE name = ?';
    console.log("Recherche de l'enseignant:", name);

    db.query(query, [name], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (result.length === 0) {
            console.log("Aucun enseignant trouvé pour le nom:", name);
            return res.status(404).json({ error: 'Enseignant non trouvé' });
        }
        
        console.log("Enseignant trouvé:", result[0]);
        res.json({ teacher_id: result[0].id });
    });
});

app.get('/get-student-id', (req, res) => {
    const { name } = req.query;
    db.query('SELECT id FROM users WHERE name = ?', [name], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur de base de données' });
        if (result.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json({ student_id: result[0].id });
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

                // Envoi d'e-mails aux étudiants
                const { sendEmail } = require('./emailService'); // Importez le service d'e-mails

                db.query("SELECT email FROM users WHERE role = 'student'", (studentErr, studentResults) => {
                    if (studentErr) {
                        console.error("Erreur lors de la récupération des emails des étudiants:", studentErr);
                        return res.status(500).json({ error: "Erreur lors de la récupération des emails des étudiants" });
                    }

                    const studentEmails = studentResults.map(student => student.email);

                    //sendEmail(studentEmails, 'Nouvel examen disponible', `Un nouvel examen "${title}" a été déposé.`);

                    try {
                        sendEmail(studentEmails, 'Nouvel examen disponible', `Un nouvel examen "${title}" a été déposé.`);
                    } catch (emailError) {
                        console.error("Erreur lors de l'envoi de l'email :", emailError);
                        return res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
                    }

                    res.json({ success: true, exam_id: result.insertId, file_path });
                });
            }
        );
    });
});
  
// Récupération des examens
app.get("/get-sujets", (req, res) => {
    const { id } = req.query;
    db.query("SELECT * FROM exams ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération des sujets" });
        res.json(results);
    });
});

app.get("/get-mes-sujets", (req, res) => {
    const { id } = req.query; // ou req.params selon comment tu l'envoies

    if (!id) {
        return res.status(400).json({ message: "ID du professeur requis" });
    }

    db.query("SELECT * FROM exams WHERE teacher_id = ? ORDER BY created_at DESC", [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération des sujets" });
        res.json(results);
    });
});


// Récupération des copies des étudiants
app.get("/get-copies", (req, res) => {
    const examId = req.query.exam_id; // Récupérer l'examen sélectionné depuis la query string

    if (!examId) {
        return res.status(400).json({ message: "Exam ID est requis" });
    }

    const query = `
        SELECT 
        s.id AS submission_id, 
        e.title AS exam_title, 
        u.name AS student_name, 
        s.file_path AS submission_file, 
        s.submitted_at AS submission_date,
        g.grade AS finalGrade,      -- Note finale venant de la table grades
        g.comments AS comment      -- Commentaires venant de la table grades
        FROM submissions s
        JOIN exams e ON s.exam_id = e.id
        JOIN users u ON s.student_id = u.id
        LEFT JOIN grades g ON s.id = g.submission_id   -- Jointure avec grades pour récupérer les notes et commentaires
        WHERE s.exam_id = ?      -- Filtrer par exam_id
        ORDER BY s.submitted_at DESC;

    `;

    db.query(query, [examId], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des copies :", err);
            return res.status(500).json({ message: "Erreur lors de la récupération des copies" });
        }
        res.json(results);
    });
});

// Mise à jour de la note finale d'une copie
app.put("/copies/:id", (req, res) => {
    const { finalGrade, corrected_by } = req.body; 
    const { id } = req.params; 

    console.log(`📩 Mise à jour de la copie ID: ${id}`);
    console.log(`📊 Données reçues: Note = ${finalGrade}, Correcteur = ${corrected_by}`);

    if (finalGrade === undefined || corrected_by === undefined) {
        console.error("❌ Données manquantes !");
        return res.status(400).json({ message: "La note finale et l'ID du professeur sont requis" });
    }

    const checkQuery = `SELECT * FROM grades WHERE submission_id = ?`;

    db.query(checkQuery, [id], (err, result) => {
        if (err) {
            console.error("❌ Erreur MySQL lors de la vérification :", err);
            return res.status(500).json({ message: "Erreur lors de la vérification de la note" });
        }

        console.log(`🔍 Résultat de la recherche :`, result);

        if (result.length > 0) {
            console.log("📝 Mise à jour de la note...");
            const updateQuery = `
                UPDATE grades
                SET grade = ?, corrected_by = ?
                WHERE submission_id = ?
            `;
            db.query(updateQuery, [finalGrade, corrected_by, id], (err, result) => {
                if (err) {
                    console.error("❌ Erreur lors de la mise à jour :", err);
                    return res.status(500).json({ message: "Erreur lors de la mise à jour de la note" });
                }

                console.log("✅ Mise à jour réussie :", result);
                res.json({ message: "Note finale mise à jour avec succès" });
            });
        } else {
            console.log("➕ Insertion de la nouvelle note...");
            const insertQuery = `
                INSERT INTO grades (submission_id, grade, corrected_by)
                VALUES (?, ?, ?)
            `;
            db.query(insertQuery, [id, finalGrade, corrected_by], (err, result) => {
                if (err) {
                    console.error("❌ Erreur lors de l'insertion :", err);
                    return res.status(500).json({ message: "Erreur lors de l'insertion de la note" });
                }

                console.log("✅ Insertion réussie :", result);
                res.json({ message: "Note finale insérée avec succès" });
            });
        }
    });
});


app.get("/get-submissions", (req, res) => {
    const { student_id } = req.query;
  
    if (!student_id) {
      return res.status(400).json({ error: "ID étudiant manquant." });
    }
  
    const query = `
      SELECT s.id, s.file_path, s.submitted_at, e.title AS exam_title
      FROM submissions s
      JOIN exams e ON s.exam_id = e.id
      WHERE s.student_id = ?
      ORDER BY s.submitted_at DESC
    `;
  
    db.query(query, [student_id], (err, result) => {
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: "Erreur lors de la récupération des copies soumises." });
      }
  
      res.status(200).json(result);
    });
  });  

// Route pour obtenir les statistiques
app.get('/stats', (req, res) => {
    const teacherId = req.query.teacherId; // Récupérer l'ID depuis les query params

    if (!teacherId) {
        return res.status(400).json({ message: "ID du professeur manquant" });
    }

    const statsQuery = `
        SELECT 
            (SELECT COUNT(*) FROM exams WHERE teacher_id = ?) AS totalExams, 
            (SELECT COUNT(*) 
            FROM submissions s 
            JOIN exams e ON s.exam_id = e.id 
            WHERE e.teacher_id = ?) AS copiesCorrigees
    `;

    db.query(statsQuery, [teacherId, teacherId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des statistiques :", err);
            return res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
        }

        res.json(result[0]);
    });
});

app.post("/submit-copy", upload.single("file"), (req, res) => {
    const { exam_id, student_id } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  
    if (!exam_id || !student_id || !filePath) {
      return res.status(400).json({ error: "Données manquantes (examen, étudiant ou fichier)." });
    }
  
    // Requête SQL pour insérer la soumission dans la base de données
    const query = `
      INSERT INTO submissions (exam_id, student_id, file_path, submitted_at)
      VALUES (?, ?, ?, NOW())
    `;
  
    db.query(query, [exam_id, student_id, filePath], (err, result) => {
      if (err) {
        console.error("Erreur SQL lors de la soumission de la copie :", err);
        return res.status(500).json({ error: "Erreur lors de la soumission de la copie." });
      }
  
      res.status(200).json({ message: "Copie soumise avec succès !" });
    });
  });

// Route pour récupérer les examens
app.get('/exams', (req, res) => {
    const query = `
      SELECT 
        exams.id, 
        exams.title, 
        exams.deadline,
        COUNT(DISTINCT submissions.id) AS copies
        FROM exams
        LEFT JOIN submissions ON exams.id = submissions.exam_id
        GROUP BY exams.id, exams.title, exams.deadline;
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Erreur lors de la récupération des examens :", err);
        return res.status(500).json({ message: "Erreur lors de la récupération des examens" });
      }
  
      res.json(result);
    });
  });  

// Suppression d'un sujet
app.delete("/subjects/:id", (req, res) => {
    db.query("DELETE FROM exams WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la suppression du sujet" });
        res.json({ message: "Sujet supprimé avec succès" });
    });
});

app.get("/exams/pending", (req, res) => {
    const query = `
        SELECT COUNT(*) AS count 
        FROM exams
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des examens en attente :", err);
            return res.status(500).json({ error: "Erreur lors de la récupération des examens en attente" });
        }

        res.json({ pending_exams: result[0].count });
    });
});

// Route pour les statistiques du professeur
app.get('/api/professor/statistics', async (req, res) => {
    const { teacher_id } = req.query;

    if (!teacher_id) {
        return res.status(400).json({ error: 'ID du professeur requis' });
    }

    try {
        // Récupérer le nombre total d'examens
        const totalExams = await new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) as total FROM exams WHERE teacher_id = ?', [teacher_id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]?.total || 0);
            });
        });

        // Récupérer le nombre de soumissions
        const totalSubmissions = await new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) as total FROM submissions s JOIN exams e ON s.exam_id = e.id WHERE e.teacher_id = ?', [teacher_id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]?.total || 0);
            });
        });

        // Récupérer la moyenne des notes
        const averageScore = await new Promise((resolve, reject) => {
            db.query(`
                SELECT AVG(g.grade) as average 
                FROM grades g 
                JOIN submissions s ON g.submission_id = s.id 
                JOIN exams e ON s.exam_id = e.id 
                WHERE e.teacher_id = ?
            `, [teacher_id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]?.average || 0);
            });
        });

        // Récupérer les statistiques de plagiat
        const plagiarismStats = await new Promise((resolve, reject) => {
            db.query(`
                SELECT COUNT(*) as total 
                FROM plagiarism_reports pr 
                JOIN submissions s ON pr.submission_id = s.id 
                JOIN exams e ON s.exam_id = e.id 
                WHERE e.teacher_id = ? AND pr.similarity_score > 80
            `, [teacher_id], (err, results) => {
                if (err) reject(err);
                resolve({
                    totalCases: results[0]?.total || 0,
                    percentageOfSubmissions: totalSubmissions > 0 ? ((results[0]?.total || 0) / totalSubmissions) * 100 : 0
                });
            });
        });

        // Récupérer les performances par matière
        const subjectPerformance = await new Promise((resolve, reject) => {
            db.query(`
                SELECT e.title, AVG(g.grade) as average_grade 
                FROM exams e 
                LEFT JOIN submissions s ON s.exam_id = e.id 
                LEFT JOIN grades g ON g.submission_id = s.id 
                WHERE e.teacher_id = ? 
                GROUP BY e.title
            `, [teacher_id], (err, results) => {
                if (err) reject(err);
                resolve(results || []);
            });
        });

        // Récupérer les données temporelles
        const timelineData = await new Promise((resolve, reject) => {
            db.query(`
                SELECT DATE(s.submitted_at) as date, COUNT(*) as submissions 
                FROM submissions s 
                JOIN exams e ON s.exam_id = e.id 
                WHERE e.teacher_id = ? 
                GROUP BY DATE(s.submitted_at) 
                ORDER BY date DESC 
                LIMIT 10
            `, [teacher_id], (err, results) => {
                if (err) reject(err);
                resolve(results || []);
            });
        });

        res.json({
            totalExams,
            totalSubmissions,
            averageScore,
            plagiarismStats,
            subjectPerformance,
            timelineData
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

// Démarrage du serveur avec gestion d'erreur
const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Le port ${PORT} est déjà utilisé. Veuillez arrêter le serveur existant.`);
    } else {
        console.error('Erreur lors du démarrage du serveur:', err);
    }
    process.exit(1);
});
