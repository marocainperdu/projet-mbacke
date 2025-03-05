import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles.css";


const StudentDashboard = () => {
  const [student, setStudent] = useState({ name: "Étudiant" });
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedExam, setSelectedExam] = useState(""); // Stocke l'ID de l'examen sélectionné

  useEffect(() => {
    axios.get("http://localhost:5000/api/exams")
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API exams :", err));

    axios.get("http://localhost:5000/api/results")
      .then((res) => setResults(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erreur API results :", err));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile || !selectedExam) {
      setUploadMessage("Veuillez sélectionner un fichier et un examen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("student_id", 2); // ID de l'étudiant (remplacer dynamiquement)
    formData.append("exam_id", selectedExam);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage(response.data.message);
      setSelectedFile(null);
      setSelectedExam("");
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      setUploadMessage("Échec de l'envoi du fichier.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenue, {student.name} !</h1>

      {/* 🔹 Examens Disponibles */}
      <section className="mt-4">
        <h2 className="text-xl font-semibold">Examens Disponibles</h2>
        <ul>
          {Array.isArray(exams) && exams.length > 0 ? (
            exams.map((exam) => (
              <li key={exam.id} className="border p-2 my-2">
                <span>{exam.title} - {exam.date}</span>
                <Link to={`/exam/${exam.id}`} className="ml-4 text-blue-500">Accéder au sujet</Link>
              </li>
            ))
          ) : (
            <p>Aucun examen disponible.</p>
          )}
        </ul>
      </section>

      {/* 🔹 Résultats */}
      <section className="mt-4">
        <h2 className="text-xl font-semibold">Vos Résultats</h2>
        <ul>
          {Array.isArray(results) && results.length > 0 ? (
            results.map((result) => (
              <li key={result.id} className="border p-2 my-2">
                <span>{result.examTitle} - Note : {result.grade}/20</span>
                <Link to={`/results/${result.id}`} className="ml-4 text-green-500">Voir la correction</Link>
              </li>
            ))
          ) : (
            <p>Aucun résultat disponible.</p>
          )}
        </ul>
      </section>

      {/* 🔹 Upload d’un devoir */}
      <section className="mt-4">
        <h2 className="text-xl font-semibold">Soumettre un Devoir</h2>
        <form onSubmit={handleUpload} className="mt-2">
          {/* Sélection de l'examen */}
          <label className="block mb-2">Sélectionnez un examen :</label>
          <select 
            value={selectedExam} 
            onChange={handleExamChange} 
            className="border p-2 w-full mb-2"
            required
          >
            <option value="">-- Choisir un examen --</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>

          {/* Sélection du fichier */}
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="border p-2 w-full mb-2"
            required 
          />
          
          <button 
            type="submit" 
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Envoyer
          </button>
        </form>
        {uploadMessage && <p className="mt-2 text-green-500">{uploadMessage}</p>}
      </section>
    </div>
  );
};

export default StudentDashboard;
