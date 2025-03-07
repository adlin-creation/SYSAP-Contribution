import { useState } from "react";
import { Card, Button } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTranslation } from "react-i18next";

const sessions = [
  { session: 1, date: "2024-03-01", difficulty: 3, pain: 5, exercises: 4 },
  { session: 2, date: "2024-03-05", difficulty: 4, pain: 4, exercises: 5 },
  { session: 3, date: "2024-03-10", difficulty: 5, pain: 3, exercises: 6 },
];

export default function PatientData({ patient, onClose }) {
  const { t } = useTranslation();
  const [currentSession, setCurrentSession] = useState(sessions.length - 1);
  const sessionData = sessions[currentSession];

  // Transformation de sessionData en tableau pour le graphique
  const sessionDataForChart = [sessionData];

  // Calcul des moyennes
  const averageData = sessions.reduce(
    (acc, s) => {
      acc.difficulty += s.difficulty;
      acc.pain += s.pain;
      acc.exercises += s.exercises;
      return acc;
    },
    { difficulty: 0, pain: 0, exercises: 0 }
  );

  const totalSessions = sessions.length;
  const averages = {
    difficulty: (averageData.difficulty / totalSessions).toFixed(1),
    pain: (averageData.pain / totalSessions).toFixed(1),
    exercises: (averageData.exercises / totalSessions).toFixed(1),
  };

  // Transformation des moyennes en tableau d'objets avec des couleurs personnalisées
  const averagesArray = [
    { name: "Difficulty", value: parseFloat(averages.difficulty), fill: "#8884d8" },
    { name: "Pain", value: parseFloat(averages.pain), fill: "#82ca9d" },
    { name: "Exercises", value: parseFloat(averages.exercises), fill: "#ff7300" },
  ];

  return (
    <div>
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
        <div style={{ display: "flex", gap: "16px" }}>
          {/* Informations de la session */}
          <div style={{ flex: 1 }}>
            {/* Boutons avec une marge en bas */}
            <div style={{ marginBottom: "16px" }}>
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
            <p><strong>Difficulty Level:</strong> {sessionData.difficulty}</p>
            <p><strong>Pain Level:</strong> {sessionData.pain}</p>
            <p><strong>Accomplished Exercises:</strong> {sessionData.exercises}</p>
          </div>

          {/* Graphique Session Data */}
          <div style={{ flex: 1 }}>
            <BarChart width={400} height={300} data={sessionDataForChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="difficulty" fill="#8884d8" name="Difficulty" />
              <Bar dataKey="pain" fill="#82ca9d" name="Pain" />
              <Bar dataKey="exercises" fill="#ff7300" name="Exercises" />
            </BarChart>
          </div>
        </div>
      </Card>


      <h2>Average Since Inception</h2>
      <Card>
        <div style={{ display: "flex", gap: "16px" }}>
          {/* Informations des moyennes */}
          <div style={{ flex: 1 }}>
            <p><strong>Difficulty Level:</strong> {averages.difficulty}</p>
            <p><strong>Pain Level:</strong> {averages.pain}</p>
            <p><strong>Accomplished Exercises:</strong> {averages.exercises}</p>
          </div>

          {/* Graphique Average Since Inception */}
          <div style={{ flex: 1 }}>
          <BarChart width={400} height={300} data={averagesArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" /> {/* Utilise la propriété "name" pour l'axe X */}
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={({ fill }) => fill} /> {/* Une seule barre avec des couleurs personnalisées */}
            </BarChart>
          </div>
        </div>
      </Card>

    </div>
  );
}