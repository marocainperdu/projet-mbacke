import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const [student, setStudent] = useState({ name: "Étudiant" });
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("/api/exams")
      .then((res) => {
        console.log("Réponse API exams :", res.data);  // 🔴 Vérification ici
        setExams(Array.isArray(res.data) ? res.data : []);  // ⚠️ Assure que c'est bien un tableau
      })
      .catch((err) => {
        console.error("Erreur API :", err);  // 🔴 Affiche une erreur si l'API échoue
        setExams([]); // ⚠️ Évite que `exams` soit `undefined`
      });

    axios.get("/api/results")
      .then((res) => {
        console.log("Réponse API results :", res.data);  // 🔴 Vérification ici aussi
        setResults(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setResults([]);
      });
  }, []);

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
            <p>Aucun examen disponible.</p> // ✅ Message si la liste est vide
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
            <p>Aucun résultat disponible.</p> // ✅ Message si aucun résultat
          )}
        </ul>
      </section>
    </div>
  );
  
};

export default StudentDashboard;
