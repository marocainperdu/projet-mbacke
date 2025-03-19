import React, { useState, useEffect } from "react";
import { Client, Account } from "appwrite";
import { Container } from "@mui/material";

const apiUrl = "http://localhost:3000"; // Remplace par l'URL de ton backend


const Stats = () => {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    title: "",
    professor: "",
    deadline: "",
    description: "",
    file: null,
  });
  const [teacherId, setTeacherId] = useState(null);
  const client = new Client().setEndpoint("https://41.82.59.121:453/v1").setProject("67cd9f540022aae0f0f5");
  const account = new Account(client);
  const [teacherName, setTeacherName] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <Container>
      Ceci est la page de statistique
    </Container>
  )
};

export default Stats;
