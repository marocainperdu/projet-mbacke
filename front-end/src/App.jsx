import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <Routes>
      {/* Page d'accueil de l'étudiant */}
      <Route path="/" element={<StudentDashboard />} />
    </Routes>
  );
}

export default App;
