import { useState, useEffect } from "react";
import axios from "axios";
import useToken from "../Authentication/useToken";
import { useQuery } from "@tanstack/react-query";
import { Card, Button } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTranslation } from "react-i18next";
import Constants from "../Utils/Constants";
import "./Styles.css"; // Import the CSS file

export default function PatientData({ patient, onClose }) {
  const { t } = useTranslation();
  const patientSessionsUrl = `${Constants.SERVER_URL}/patient/${patient.id}/sessions`;
  const { token } = useToken();

  // Récupérer les sessions avec useQuery
  const {
    data: sessionsData
  } = useQuery(["SessionRecord", patient.id], () => {
    return axios
      .get(patientSessionsUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });

  const sessions = sessionsData || [];

// Définir currentSession et le mettre à jour lorsque sessions change
  const [currentSession, setCurrentSession] = useState(0); // Initialiser à 0 par défaut

  useEffect(() => {
    if (sessions.length > 0) {
      // Mettre à jour currentSession pour afficher la session la plus récente
      setCurrentSession(sessions.length - 1);
    }
  }, [sessions]); // Déclencher cet effet lorsque sessions change

  const sessionData = sessions[currentSession] || {};

  const sessionDataForChart = [sessionData];

  // Calcul des moyennes
  const averageData = sessions.reduce(
    (acc, s) => {
      acc.difficultyLevel += s.difficultyLevel || 0;
      acc.painLevel += s.painLevel || 0;
      acc.accomplishedExercice += s.accomplishedExercice || 0;
      return acc;
    },
    { difficultyLevel: 0, painLevel: 0, accomplishedExercice: 0 }
  );

  const totalSessions = sessions.length;
  const averages = {
    difficulty: (averageData.difficultyLevel / totalSessions).toFixed(1),
    pain: (averageData.painLevel / totalSessions).toFixed(1),
    exercises: (averageData.accomplishedExercice / totalSessions).toFixed(1),
  };

  // Transformation des moyennes en tableau d'objets avec des couleurs personnalisées
  const averagesArray = [
    { name: "Difficulty", value: parseFloat(averages.difficulty), fill: "#8884d8" },
    { name: "Pain", value: parseFloat(averages.pain), fill: "#82ca9d" },
    { name: "Exercises", value: parseFloat(averages.exercises), fill: "#ff7300" },
  ];


  return (
    <div className="patient-data-container">
      <h1>{t("Patient Data")}</h1>
      <Card>
        <h2>{`${patient.firstname} ${patient.lastname}`}</h2>
        <p><strong>{t("Patients:email")}:</strong> {patient.email}</p>
        <p><strong>{t("Patients:phone")}:</strong> {patient.phoneNumber}</p>
        <p><strong>{t("Patients:status")}:</strong> {patient.status}</p>
        <p><strong>{t("Patients:programs")}:</strong> {patient.numberOfPrograms}</p>
      </Card>

      <h2>Session Data</h2>
      <Card>
        <div className="session-data-container">
          {/* Informations de la session */}
          <div className="session-info">
            <div className="session-buttons">
              <Button onClick={() => setCurrentSession((prev) => Math.max(prev - 1, 0))}>
                Previous
              </Button>
              <Button onClick={() => setCurrentSession((prev) => Math.min(prev + 1, sessions.length - 1))}>
                Next
              </Button>
            </div>

            {/* Données de la session */}
            <p><strong>Session:</strong> {currentSession + 1}</p>
            <p><strong>Date:</strong> {sessionData.date}</p>
            <p><strong>Difficulty Level:</strong> {sessionData.difficultyLevel}</p>
            <p><strong>Pain Level:</strong> {sessionData.painLevel}</p>
            <p><strong>Accomplished Exercice:</strong> {sessionData.accomplishedExercice}</p>
          </div>

          {/* Graphique Session Data */}
          <div className="session-chart">
            <BarChart width={400} height={300} data={sessionDataForChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="difficultyLevel" fill="#8884d8" name="Difficulty" />
              <Bar dataKey="painLevel" fill="#82ca9d" name="Pain" />
              <Bar dataKey="accomplishedExercice" fill="#ff7300" name="Exercises" />
            </BarChart>
          </div>
        </div>
      </Card>

      <h2>Average Since Inception</h2>
      <Card>
        <div className="average-data-container">
          {/* Informations des moyennes */}
          <div className="average-info">
            <p><strong>Difficulty Level:</strong> {averages.difficulty}</p>
            <p><strong>Pain Level:</strong> {averages.pain}</p>
            <p><strong>Accomplished Exercice:</strong> {averages.exercises}</p>
          </div>

          {/* Graphique Average Since Inception */}
          <div className="average-chart">
            <BarChart width={400} height={300} data={averagesArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={({ fill }) => fill} />
            </BarChart>
          </div>
        </div>
      </Card>
    </div>
  );
}