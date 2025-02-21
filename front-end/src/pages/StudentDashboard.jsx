import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const [student, setStudent] = useState({ name: "Étudiant" });
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Simulation des requêtes API (à remplacer par l'URL réelle)
    axios.get("/api/exams").then((res) => setExams(res.data));
    axios.get("/api/results").then((res) => setResults(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenue, {student.name} !</h1>

      {/* Examens Disponibles */}
      <section className="mt-4">
        <h2 className="text-xl font-semibold">Examens Disponibles</h2>
        <ul>
          {exams.map((exam) => (
            <li key={exam.id} className="border p-2 my-2">
              <span>{exam.title} - {exam.date}</span>
              <Link to={`/exam/${exam.id}`} className="ml-4 text-blue-500">Accéder au sujet</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Résultats */}
      <section className="mt-4">
        <h2 className="text-xl font-semibold">Vos Résultats</h2>
        <ul>
          {results.map((result) => (
            <li key={result.id} className="border p-2 my-2">
              <span>{result.examTitle} - Note : {result.grade}/20</span>
              <Link to={`/results/${result.id}`} className="ml-4 text-green-500">Voir la correction</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default StudentDashboard;
