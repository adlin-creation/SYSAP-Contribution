import { useState, useEffect } from "react";
import axios from "axios";
import useToken from "../Authentication/useToken";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Empty, Slider } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import Constants from "../Utils/Constants";
import "./Styles.css";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";

export default function PatientStats({ patient, onClose }) {
  const { t } = useTranslation("Patients");
  const { token } = useToken();
  const patientSessionsUrl = `${Constants.SERVER_URL}/patient/${patient.id}/sessions`;
  const programsUrl = `${Constants.SERVER_URL}/programs/${patient.id}`;
  const blocsUrl = `${Constants.SERVER_URL}/blocs/${patient.id}`;
  const exercicesUrl = `${Constants.SERVER_URL}/exercices/${patient.id}`;

  // Récupérer les sessions avec useQuery
  const { data: sessionsData } = useQuery(["SessionRecord", patient.id], () => {
    return axios
      .get(patientSessionsUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });
  // Récupérer les programmes avec useQuery
  const { data: allPrograms } = useQuery(["AllPrograms"], () => {
    return axios
      .get(programsUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });

  const { data: allBlocs } = useQuery(["AllBlocs"], () => {
    return axios
      .get(blocsUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });

  const { data: allExercises } = useQuery(["AllExercises"], () => {
    return axios
      .get(exercicesUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });

  const [currentProgram, setCurrentProgram] = useState(0);
  const patientPrograms = allPrograms || [];
  const hasPrograms = patientPrograms.length > 0;

  const currentProgramData = hasPrograms
    ? patientPrograms[currentProgram] || {}
    : {};

  const sessions = sessionsData || [];
  const hasSessions = sessions.length > 0;

  // Définir currentSession et le mettre à jour lorsque sessions change
  const [currentSession, setCurrentSession] = useState(0);

  useEffect(() => {
    if (sessions.length > 0) {
      setCurrentSession(sessions.length - 1);
    }
  }, [sessions]);

  const sessionData = hasSessions ? sessions[currentSession] || {} : {};

  const sessionDataForChart = [sessionData];

  // Calcul des moyennes (seulement s'il y a des sessions)
  const averages = hasSessions
    ? (() => {
        const averageData = sessions.reduce(
          (acc, s) => {
            acc.difficultyLevel += Number(s.difficultyLevel) || 0;
            acc.painLevel += Number(s.painLevel) || 0;
            acc.accomplishedExercice += Number(s.accomplishedExercice) || 0;
            acc.walkingTime += Number(s.walkingTime) || 0;
            return acc;
          },
          {
            difficultyLevel: 0,
            painLevel: 0,
            walkingTime: 0,
            accomplishedExercice: 0,
          }
        );

        const totalSessions = sessions.length;
        return {
          difficulty: (averageData.difficultyLevel / totalSessions).toFixed(1),
          pain: (averageData.painLevel / totalSessions).toFixed(1),
          walking: (averageData.walkingTime / totalSessions).toFixed(1),
          exercises: (averageData.accomplishedExercice / totalSessions).toFixed(
            1
          ),
        };
      })()
    : null;

  // Creer ligne de progression pour graph progressive
  const progressionData = hasSessions
    ? sessions.map((session, index) => ({
        session: index + 1,
        difficulty: Number(session.difficultyLevel),
        pain: Number(session.painLevel),
        walking: Number(session.walkingTime),
        exercises: Number(session.accomplishedExercice),
      }))
    : [];

  // Fonction pour CSV avec structure de bloc correcte
  const downloadCSV = () => {
    // Formater la date pour le nom du fichier
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    let headers = [
      "PatientID",
      "PatientFirstName",
      "PatientLastName",
      "PatientEmail",
      "PatientPhone",
      "PatientStatus",
      "PatientPrograms",
      "SessionID",
      "ProgramEnrollementId",
      "SessionDate",
      "CreatedAt",
      "UpdatedAt",
      "DifficultyLevel",
      "PainLevel",
      "WalkingTime",
      "AccomplishedExercises",
    ];

    // Si plusieurs sessions existent, chaque session sera une ligne
    let rows = [];

    sessions.forEach((session, index) => {
      // Formater les dates pour SPSS
      const sessionDate = new Date(session.date).toISOString().split("T")[0];
      const createdAt = session.createdAt
        ? new Date(session.createdAt).toISOString().split("T")[0]
        : "";
      const updatedAt = session.updatedAt
        ? new Date(session.updatedAt).toISOString().split("T")[0]
        : "";

      // Créer une ligne pour chaque session avec les données du patient
      const row = {
        PatientID: patient.id,
        PatientFirstName: patient.firstname,
        PatientLastName: patient.lastname,
        PatientEmail: patient.email,
        PatientPhone: patient.phoneNumber,
        PatientStatus: patient.status,
        PatientPrograms: patient.numberOfPrograms,

        SessionID: session.id,
        ProgramEnrollementId: session.ProgramEnrollementId,
        SessionDate: sessionDate,
        CreatedAt: createdAt,
        UpdatedAt: updatedAt,
        DifficultyLevel: session.difficultyLevel,
        PainLevel: session.painLevel,
        WalkingTime: session.walkingTime,
        AccomplishedExercises: session.accomplishedExercice,
      };

      rows.push(row);
    });

    let csvContent = "\ufeff";
    // Construire le CSV
    csvContent += headers.join(",") + "\n";

    rows.forEach((row) => {
      const rowValues = headers.map((header) => {
        // Échapper les valeurs texte et ajouter des guillemets
        const value = row[header];
        if (value === null || value === undefined) {
          return ""; // Gérer les valeurs nulles
        }

        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });

      csvContent += rowValues.join(",") + "\n";
    });

    // Ajouter une section pour les programmes si nécessaire
    if (hasPrograms && patientPrograms.length > 0) {
      csvContent += "\n\n";
      csvContent += "# PROGRAM INFORMATION\n";

      const programHeaders = [
        "ProgramID",
        "ProgramName",
        "ProgramDescription",
        "ProgramDuration",
        "ProgramUnit",
        "ProgramStatus",
      ];
      csvContent += programHeaders.join(",") + "\n";

      patientPrograms.forEach((program) => {
        const name = program.name.replace(/"/g, '""');
        const description = program.description.replace(/"/g, '""');

        csvContent +=
          [
            program.id,
            `"${name}"`,
            `"${description}"`,
            program.duration,
            program.duration_unit,
            program.actif ? "1" : "0", // SPSS bool
          ].join(",") + "\n";
      });
    }

    // Ajouter une section pour les blocs
    if (allBlocs && allBlocs.length > 0) {
      csvContent += "\n\n";
      csvContent += "# BLOC INFORMATION\n";

      const blocHeaders = [
        "BlocID",
        "BlocName",
        "BlocDescription",
        "BlocKey",
        "BlocCreatedAt",
        "BlocUpdatedAt",
      ];
      csvContent += blocHeaders.join(",") + "\n";

      allBlocs.forEach((bloc) => {
        const name = bloc.name ? bloc.name.replace(/"/g, '""') : "";
        const description = bloc.description
          ? bloc.description.replace(/"/g, '""')
          : "";
        const createdAt = bloc.createdAt
          ? new Date(bloc.createdAt).toISOString().split("T")[0]
          : "";
        const updatedAt = bloc.updatedAt
          ? new Date(bloc.updatedAt).toISOString().split("T")[0]
          : "";

        csvContent +=
          [
            bloc.id,
            `"${name}"`,
            `"${description}"`,
            `"${bloc.key || ""}"`,
            createdAt,
            updatedAt,
          ].join(",") + "\n";
      });
    }

    // Ajouter une section pour les exercices
    if (allExercises && allExercises.length > 0) {
      csvContent += "\n\n";
      csvContent += "# EXERCISE INFORMATION\n";

      const exerciseHeaders = [
        "ExerciseID",
        "ExerciseName",
        "ExerciseDescription",
        "ExerciseKey",
        "ExerciseBlocId",
        "CreatedAt",
        "UpdatedAt",
      ];
      csvContent += exerciseHeaders.join(",") + "\n";

      allExercises.forEach((exercise) => {
        const name = exercise.name.replace(/"/g, '""');
        const description = exercise.description.replace(/"/g, '""');
        const createdAt = exercise.createdAt
          ? new Date(exercise.createdAt).toISOString().split("T")[0]
          : "";
        const updatedAt = exercise.updatedAt
          ? new Date(exercise.updatedAt).toISOString().split("T")[0]
          : "";

        csvContent +=
          [
            exercise.id,
            `"${name}"`,
            `"${description}"`,
            `"${exercise.key || ""}"`,
            exercise.BlocId || "",
            createdAt,
            updatedAt,
          ].join(",") + "\n";
      });
    }

    const fileName = `${patient.firstname}_${patient.lastname}_data_spss_${dateStr}.csv`;

    // Créer et sauvegarder
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  // Vérifier si le patient nécessite un suivi
  const needsFollowUp =
    hasSessions &&
    averages &&
    (parseFloat(averages.pain) >= 3.0 ||
      parseFloat(averages.difficulty) >= 3.0);

  return (
    <div className="patient-data-container">
      <h2 className="section-header">
        {t("title_patient_data")}
        <Button onClick={downloadCSV} type="primary" disabled={!hasSessions}>
          {t("button_export_to_csv")}
        </Button>
      </h2>
      <Card>
        <p>
          <strong className="patient-name">
            {patient.firstname.charAt(0).toUpperCase() +
              patient.firstname.slice(1)}{" "}
            {patient.lastname.charAt(0).toUpperCase() +
              patient.lastname.slice(1)}
          </strong>
          {needsFollowUp && (
            <span className="warning-badge">
              {t("span_required_follow_up")}
            </span>
          )}
        </p>
        <p>
          <strong>{t("title_email")}:</strong> {patient.email}
        </p>
        <p>
          <strong>{t("title_phone")}:</strong> {patient.phoneNumber}
        </p>
        <p>
          <strong>{t("title_status")}:</strong> {patient.status}
        </p>
        <p>
          <strong>{t("title_programs")}:</strong> {patientPrograms.length}
        </p>

        {averages && (
          <div className="message-container">
            {parseFloat(averages.pain) >= 3 && (
              <p className="message warning-message">
                {t("text_high_pain_level_warning")} ({averages.pain}) -{t("")}
              </p>
            )}
            {parseFloat(averages.difficulty) >= 3 && (
              <p className="message warning-message">
                {t("text_program_too_difficult_warning")} ({averages.difficulty}
                ) - {t("text_adjustment_needed")}
              </p>
            )}
          </div>
        )}
      </Card>

      <h2 className="section-header">{t("title_patient_programs")}</h2>
      <Card>
        {hasPrograms ? (
          <div className="program-data-container">
            <div className="program-navigation">
              <Button
                onClick={() =>
                  setCurrentProgram((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentProgram === 0}
              >
                {t("button_previous")}
              </Button>
              <Button
                onClick={() =>
                  setCurrentProgram((prev) =>
                    Math.min(prev + 1, patientPrograms.length - 1)
                  )
                }
                disabled={currentProgram === patientPrograms.length - 1}
              >
                {t("button_next")}
              </Button>
            </div>

            <div className="program-details">
              <p>
                <strong>
                  {t("label_program")} {currentProgram + 1} of{" "}
                  {patientPrograms.length}
                </strong>
              </p>
              <p>
                <strong>{t("title_name")}:</strong> {currentProgramData.name}
              </p>
              <p>
                <strong>{t("text_description")}:</strong>{" "}
                {currentProgramData.description}
              </p>
              <p>
                <strong>{t("text_duration")}:</strong>{" "}
                {currentProgramData.duration} {currentProgramData.duration_unit}
              </p>
              <p>
                <strong>{t("text_status")}:</strong>{" "}
                {currentProgramData.actif ? "Actif" : "Inactif"}
              </p>
            </div>
          </div>
        ) : (
          <Empty
            description={
              <span>{t("span_no_programs_available_for_patient")}</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      <h2 className="section-header">{t("title_session_data")}</h2>
      <Card>
        {hasSessions ? (
          <div className="session-data-container">
            {/* Left side: Session info and navigation buttons */}
            <div className="session-info">
              <div className="session-buttons">
                <Button
                  onClick={() =>
                    setCurrentSession((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentSession === 0}
                >
                  {t("button_previous")}
                </Button>
                <Button
                  onClick={() =>
                    setCurrentSession((prev) =>
                      Math.min(prev + 1, sessions.length - 1)
                    )
                  }
                  disabled={currentSession === sessions.length - 1}
                >
                  {t("button_next")}
                </Button>
              </div>
              <p>
                <strong>{t("text_session")}:</strong> {currentSession + 1}
              </p>
              <p>
                <strong>{t("text_date")}:</strong>{" "}
                {new Intl.DateTimeFormat("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(sessionData.date))}
              </p>
              <p>
                <strong>{t("text_difficulty_level")}:</strong>{" "}
                {sessionData.difficultyLevel}
              </p>
              <p>
                <strong>{t("text_pain_level")}:</strong> {sessionData.painLevel}
              </p>
              <p>
                <strong>{t("text_walking_time")}:</strong>{" "}
                {sessionData.walkingTime}
              </p>
              <p>
                <strong>{t("text_accomplished_exercise")}:</strong>{" "}
                {sessionData.accomplishedExercice}
              </p>
            </div>

            {/* Right side: Chart with slider on top */}
            <div className="session-chart-container">
              {/* Slider at the top of the chart */}
              <div className="chart-slider-container">
                <div className="slider-session-label">
                  {t("text_session")}: {currentSession + 1} of {sessions.length}
                </div>
                <div className="slider-with-labels">
                  <span className="slider-endpoint">{t("span_first")}</span>
                  <Slider
                    min={0}
                    max={sessions.length - 1}
                    value={currentSession}
                    onChange={(value) => setCurrentSession(value)}
                    tooltip={{
                      formatter: (value) => {
                        const sessionDate = new Date(sessions[value].date);
                        return `${value + 1}: ${sessionDate.toLocaleDateString(
                          "fr-FR"
                        )}`;
                      },
                    }}
                    className="compact-slider"
                  />
                  <span className="slider-endpoint">{t("span_latest")}</span>
                </div>
              </div>

              {/* Chart */}
              <div className="session-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionDataForChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis />
                    <Tooltip />
                    <Legend align="center" verticalAlign="bottom" />
                    <Bar
                      dataKey="difficultyLevel"
                      fill="#8884d8"
                      name="Difficulty"
                    />
                    <Bar dataKey="painLevel" fill="#82ca9d" name="Pain" />
                    <Bar
                      dataKey="walkingTime"
                      fill="#0088FE"
                      name="Walking Time"
                    />
                    <Bar
                      dataKey="accomplishedExercice"
                      fill="#ff7300"
                      name="Exercises"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <Empty
            description={
              <span>{t("span_no_sessions_available_for_patient")}</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      <h2 className="section-header">{t("average_since_inception")}</h2>
      <Card>
        {hasSessions ? (
          <div className="average-container">
            <div className="average-summary">
              <p>
                <strong>{t("text_average_difficulty")}:</strong>{" "}
                {averages.difficulty}
              </p>
              <p>
                <strong>{t("text_average_pain")}:</strong> {averages.pain}
              </p>
              <p>
                <strong>{t("text_average_walking")}:</strong> {averages.walking}
              </p>
              <p>
                <strong>{t("text_average_exercises")}:</strong>{" "}
                {averages.exercises}
              </p>
            </div>

            <div className="average-chart">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="difficulty"
                    stroke="#8884d8"
                    name="Difficulty Level"
                  />
                  <Line
                    type="monotone"
                    dataKey="pain"
                    stroke="#82ca9d"
                    name="Pain Level"
                  />
                  <Line
                    type="monotone"
                    dataKey="walking"
                    stroke="#0088FE"
                    name="Walking Time"
                  />
                  <Line
                    type="monotone"
                    dataKey="exercises"
                    stroke="#ff7300"
                    name="Accomplished Exercises"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <Empty
            description={
              <span>{t("span_no_sessions_available_for_patient")}</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}

// PropTypes
PatientStats.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    status: PropTypes.string,
    numberOfPrograms: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func,
};

PatientStats.defaultProps = {
  onClose: () => {},
};
