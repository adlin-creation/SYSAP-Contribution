import { useState, useEffect } from "react";
import axios from "axios";
import useToken from "../Authentication/useToken";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Empty } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTranslation } from "react-i18next";
import Constants from "../Utils/Constants";
import "./Styles.css"; // Import the CSS file

export default function PatientData({ patient, onClose }) {
  const { t } = useTranslation();
  const patientSessionsUrl = `${Constants.SERVER_URL}/patient/${patient.id}/sessions`;
  const { token } = useToken();

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
  const hasSessions = sessions.length > 0;

  const [currentSession, setCurrentSession] = useState(0);

  useEffect(() => {
    if (sessions.length > 0) {
      setCurrentSession(sessions.length - 1);
    }
  }, [sessions]);

  const sessionData = hasSessions ? sessions[currentSession] || {} : {};

  const sessionDataForChart = [sessionData];

  const averages = hasSessions ? (() => {
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
    return {
      difficulty: (averageData.difficultyLevel / totalSessions).toFixed(1),
      pain: (averageData.painLevel / totalSessions).toFixed(1),
      exercises: (averageData.accomplishedExercice / totalSessions).toFixed(1),
    };
  })() : null;

  const averagesArray = hasSessions ? [
    { name: t("Patients:difficulty"), value: parseFloat(averages.difficulty), fill: "#8884d8" },
    { name: t("Patients:pain"), value: parseFloat(averages.pain), fill: "#82ca9d" },
    { name: t("Patients:exercises"), value: parseFloat(averages.exercises), fill: "#ff7300" },
  ] : [];

  return (
    <div className="patient-data-container">
      <h1>{t("Patients:patient_data_title")}</h1>
      <Card>
        <h2>{`${patient.firstname} ${patient.lastname}`}</h2>
        <p><strong>{t("Patients:email")}:</strong> {patient.email}</p>
        <p><strong>{t("Patients:phone")}:</strong> {patient.phoneNumber}</p>
        <p><strong>{t("Patients:status")}:</strong> {patient.status}</p>
        <p><strong>{t("Patients:programs")}:</strong> {patient.numberOfPrograms}</p>
      </Card>

      <h2>{t("Patients:session_data_title")}</h2>
      <Card>
        {hasSessions ? (
          <div className="session-data-container">
            <div className="session-info">
              <div className="session-buttons">
                <Button onClick={() => setCurrentSession((prev) => Math.max(prev - 1, 0))}>
                  {t("Patients:previous_button")}
                </Button>
                <Button onClick={() => setCurrentSession((prev) => Math.min(prev + 1, sessions.length - 1))}>
                  {t("Patients:next_button")}
                </Button>
              </div>
              <p><strong>{t("Patients:session")}</strong> {currentSession + 1}</p>
              <p><strong>{t("Patients:date")}</strong> {sessionData.date}</p>
              <p><strong>{t("Patients:difficulty_level")}</strong> {sessionData.difficultyLevel}</p>
              <p><strong>{t("Patients:pain_level")}</strong> {sessionData.painLevel}</p>
              <p><strong>{t("Patients:accomplished_exercice")}</strong> {sessionData.accomplishedExercice}</p>
            </div>

            <div className="session-chart">
              <BarChart width={400} height={300} data={sessionDataForChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="difficultyLevel" fill="#8884d8" name={t("Patients:difficulty")} />
                <Bar dataKey="painLevel" fill="#82ca9d" name={t("Patients:pain")} />
                <Bar dataKey="accomplishedExercice" fill="#ff7300" name={t("Patients:exercises")} />
              </BarChart>
            </div>
          </div>
        ) : (
          <Empty
            description={<span>{t("Patients:no_session_description")}</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      <h2>{t("Patients:average_since_inception")}</h2>
      <Card>
        {hasSessions ? (
          <div className="average-data-container">
            <div className="average-info">
              <p><strong>{t("Patients:difficulty_level")}</strong> {averages.difficulty}</p>
              <p><strong>{t("Patients:pain_level")}</strong> {averages.pain}</p>
              <p><strong>{t("Patients:accomplished_exercice")}</strong> {averages.exercises}</p>
            </div>

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
        ) : (
          <Empty
            description={<span>{t("Patients:no_session_disponible")}</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}
