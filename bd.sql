-- Création de la base de données
CREATE DATABASE IF NOT EXISTS `mbacke-projet`;
USE `mbacke-projet`;

-- Table `users` : Gestion des utilisateurs (enseignants et étudiants)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` ENUM('teacher', 'student') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table `exams` : Gestion des examens créés par les enseignants
CREATE TABLE IF NOT EXISTS `exams` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `file_path` VARCHAR(255) NOT NULL,
    `teacher_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Table `submissions` : Gestion des copies soumises par les étudiants
CREATE TABLE IF NOT EXISTS `submissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `exam_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Table `grades` : Gestion des notes attribuées aux copies
CREATE TABLE IF NOT EXISTS `grades` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `submission_id` INT NOT NULL,
    `grade` FLOAT NOT NULL,
    `comments` TEXT,
    `corrected_by` INT NOT NULL,
    `corrected_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`corrected_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Table `plagiarism_reports` : Gestion des rapports de plagiat
CREATE TABLE IF NOT EXISTS `plagiarism_reports` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `submission_id` INT NOT NULL,
    `similarity_score` FLOAT NOT NULL,
    `report_path` VARCHAR(255) NOT NULL,
    `generated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE CASCADE
);

-- Insertion de données de test

-- Utilisateurs
INSERT INTO `users` (`email`, `password`, `role`) VALUES
('teacher@example.com', '$2a$10$examplehash', 'teacher'), -- Mot de passe hashé
('student@example.com', '$2a$10$examplehash', 'student'); -- Mot de passe hashé

-- Examens
INSERT INTO `exams` (`title`, `description`, `file_path`, `teacher_id`) VALUES
('Examen de Mathématiques', 'Premier semestre', '/uploads/math.pdf', 1),
('Examen de Physique', 'Deuxième semestre', '/uploads/physics.pdf', 1);

-- Soumissions
INSERT INTO `submissions` (`exam_id`, `student_id`, `file_path`) VALUES
(1, 2, '/uploads/copie1.pdf'),
(2, 2, '/uploads/copie2.pdf');

-- Notes
INSERT INTO `grades` (`submission_id`, `grade`, `comments`, `corrected_by`) VALUES
(1, 15.5, 'Bon travail', 1),
(2, 12.0, 'Peut mieux faire', 1);

-- Rapports de plagiat
INSERT INTO `plagiarism_reports` (`submission_id`, `similarity_score`, `report_path`) VALUES
(1, 12.3, '/uploads/rapport1.pdf'),
(2, 8.5, '/uploads/rapport2.pdf');
 -- Créer une procédure stockée pour générer le rapport mensuel
CREATE PROCEDURE GenerateMonthlyExamReport AS BEGIN 
-- Créer une table temporaire pour stocker les données du rapport 
CREATE TABLE #MonthlyExams ( Month VARCHAR(10), NumberOfExams INT ); 
-- Insérer le nombre d'examens créés par mois dans la table temporaire 
INSERT INTO #MonthlyExams (Month, NumberOfExams) SELECT MONTH(created_at), COUNT(*) FROM exams WHERE created_at >= DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0) AND created_at < DATEADD(month, DATEDIFF(month, 0, GETDATE()) + 1, 0) GROUP BY MONTH(created_at); 
-- Sélectionner les données du rapport 
SELECT * FROM #MonthlyExams;
-- Supprimer la table temporaire
DROP TABLE #MonthlyExams; END; GO
-- Exécuter la procédure stockée 
EXEC GenerateMonthlyExamReport; 
