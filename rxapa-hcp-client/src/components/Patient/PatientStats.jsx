import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import useToken from "../Authentication/useToken";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Empty, Descriptions, Calendar, DatePicker, Alert, Tag, Spin, Radio } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend, ResponsiveContainer
} from "recharts";
import { useTranslation } from "react-i18next";
import Constants from "../Utils/Constants";
import "./Styles.css";
import PropTypes from "prop-types";
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import locale from 'antd/es/date-picker/locale/fr_FR';
import quarterOfYear from 'dayjs/plugin/quarterOfYear'; 

dayjs.extend(quarterOfYear); 
dayjs.locale('fr');

const { RangePicker } = DatePicker;

export default function PatientStats({ patient, onClose }) {
  const { t } = useTranslation("Patients");
  const { token } = useToken();

  // --- URLs ---
  const patientSessionsUrl = `${Constants.SERVER_URL}/patient/${patient.id}/sessions`;
  const programsUrl = `${Constants.SERVER_URL}/programs/${patient.id}`;
  const blocsUrl = `${Constants.SERVER_URL}/blocs/${patient.id}`;
  const exercicesUrl = `${Constants.SERVER_URL}/exercices/${patient.id}`;

  // --- Data Fetching ---
  const fetchConfig = { headers: { Authorization: "Bearer " + token } };

  const { data: sessionsData, isLoading: isLoadingSessions } = useQuery(
      ["SessionRecord", patient.id],
      () => axios.get(patientSessionsUrl, fetchConfig).then((res) => res.data),

  );
  const { data: allPrograms } = useQuery(["AllPrograms", patient.id], () => axios.get(programsUrl, fetchConfig).then((res) => res.data));
  const { data: allBlocs } = useQuery(["AllBlocs", patient.id], () => axios.get(blocsUrl, fetchConfig).then((res) => res.data));
  const { data: allExercises } = useQuery(["AllExercises", patient.id], () => axios.get(exercicesUrl, fetchConfig).then((res) => res.data));

  // --- State ---
  // Program State
  const [currentProgram, setCurrentProgram] = useState(0);

  // Session State
  const sessions = useMemo(() => sessionsData || [], [sessionsData]);
  const hasSessions = sessions.length > 0;

  // State for the date selected in the calendar
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // State for tracking current session index for the selected date
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  // State for the date range selected for averages
  const [dateRange, setDateRange] = useState([null, null]);
  
  // State for navigating periods
  const [averageViewMode, setAverageViewMode] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [currentPeriodDate, setCurrentPeriodDate] = useState(dayjs());

  // --- Memoized Derived Data ---

  // Map sessions by date (YYYY-MM-DD) for quick lookup
  const sessionsByDate = useMemo(() => {
    const map = new Map();
    sessions.forEach(session => {
      if (session.date) {
        const dateStr = dayjs(session.date).format('YYYY-MM-DD');
        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }
        map.get(dateStr).push(session);
      }
    });
    return map;
  }, [sessions]);

  // Get all sessions for the selected date
  const selectedDateSessions = useMemo(() => {
    const dateStr = selectedDate.format('YYYY-MM-DD');
    return sessionsByDate.get(dateStr) || [];
  }, [selectedDate, sessionsByDate]);

  // Get the current session for the selected date
  const selectedSessionData = useMemo(() => {
    if (selectedDateSessions.length === 0) return null;
    // Make sure the index is within bounds
    const safeIndex = Math.min(currentSessionIndex, selectedDateSessions.length - 1);
    return selectedDateSessions[safeIndex];
  }, [selectedDateSessions, currentSessionIndex]);

  // Data formatted for the single session BarChart
  const sessionDataForChart = useMemo(() => {
    const result = [];
    if (selectedSessionData) {
      result.push(selectedSessionData);
    }
    return result;
  }, [selectedSessionData]);
  
  // Function to obtain date according to intervall
  const getCurrentPeriodRange = useCallback(() => {
    // Use a memoized/stable reference to the current date
    const date = currentPeriodDate;
    let start, end;
    
    switch (averageViewMode) {
      case 'week':
        start = dayjs(date).startOf('week');
        end = dayjs(date).endOf('week');
        break;
      case 'month':
        start = dayjs(date).startOf('month');
        end = dayjs(date).endOf('month');
        break;
      case 'quarter':
        start = dayjs(date).startOf('quarter');
        end = dayjs(date).endOf('quarter');
        break;
      case 'year':
        start = dayjs(date).startOf('year');
        end = dayjs(date).endOf('year');
        break;
      default:
        start = dayjs(date).startOf('month');
        end = dayjs(date).endOf('month');
    }
    
    // Return stable date objects
    return [start, end];
  }, [currentPeriodDate, averageViewMode]);

  const memoizedDateRange = useMemo(() => {
    const [start, end] = getCurrentPeriodRange();
    return [start, end];
  }, [getCurrentPeriodRange]);

  // Filter sessions based on the selected date range
  const filteredSessions = useMemo(() => {
    const start = dateRange[0];
    const end = dateRange[1];
    
    let filtered = sessions;
    
    if (start && end) {
      const startDate = dayjs(start).startOf('day');
      const endDate = dayjs(end).endOf('day');
      
      filtered = sessions.filter(session => {
        if (!session.date) return false;
        const sessionDate = dayjs(session.date);
        return !sessionDate.isBefore(startDate) && !sessionDate.isAfter(endDate);
      });
    }
    
    return filtered;
  }, [sessions, dateRange]);

  // Calculate averages based on filtered sessions
  const rangeAverages = useMemo(() => {
    if (filteredSessions.length === 0) return null;

    const averageData = filteredSessions.reduce(
      (acc, s) => {
        acc.difficultyLevel += Number(s.difficultyLevel) || 0;
        acc.painLevel += Number(s.painLevel) || 0;
        acc.accomplishedExercice += Number(s.accomplishedExercice) || 0;
        acc.walkingTime += Number(s.walkingTime) || 0;
        return acc;
      },
      { difficultyLevel: 0, painLevel: 0, walkingTime: 0, accomplishedExercice: 0 }
    );

    const totalFilteredSessions = filteredSessions.length;
    return {
      difficulty: (averageData.difficultyLevel / totalFilteredSessions).toFixed(1),
      pain: (averageData.painLevel / totalFilteredSessions).toFixed(1),
      walking: (averageData.walkingTime / totalFilteredSessions).toFixed(1),
      exercises: (averageData.accomplishedExercice / totalFilteredSessions).toFixed(1),
      count: totalFilteredSessions
    };
  }, [filteredSessions]);

  // Data for the Progression Line Chart based on filtered sessions
  const rangeProgressionData = useMemo(() => {
    return filteredSessions.map((session, index) => ({
      date: dayjs(session.date).format('YYYY-MM-DD'),
      sessionIndex: sessions.findIndex(s => s.id === session.id) + 1,
      difficulty: Number(session.difficultyLevel),
      pain: Number(session.painLevel),
      walking: Number(session.walkingTime),
      exercises: Number(session.accomplishedExercice)
    })).sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  }, [filteredSessions, sessions]);

  // --- Effects ---
  // Effect to set initial selected date to the latest session date
  useEffect(() => {
    if (hasSessions) {
      const latestSession = sessions.reduce((latest, current) => {
          return dayjs(current.date).isAfter(dayjs(latest.date)) ? current : latest;
      });
      if (latestSession && latestSession.date) {
          setSelectedDate(dayjs(latestSession.date));
      }
    } else {
        setSelectedDate(dayjs());
    }
  }, [sessions, hasSessions]);

  // Reset current session index when date changes
  useEffect(() => {
    setCurrentSessionIndex(0);
  }, [selectedDate]);
  
  
  useEffect(() => {
    // Only update if the dateRange is actually different
    const currentRangeStart = dateRange[0]?.format('YYYY-MM-DD');
    const currentRangeEnd = dateRange[1]?.format('YYYY-MM-DD');
    const newRangeStart = memoizedDateRange[0]?.format('YYYY-MM-DD');
    const newRangeEnd = memoizedDateRange[1]?.format('YYYY-MM-DD');
    
    if (currentRangeStart !== newRangeStart || currentRangeEnd !== newRangeEnd) {
      setDateRange(memoizedDateRange);
    }
  }, [memoizedDateRange]);

  // --- Other Derived Data & Variables ---
  const patientPrograms = allPrograms || [];
  const hasPrograms = patientPrograms.length > 0;
  const currentProgramData = hasPrograms ? patientPrograms[currentProgram] || {} : {};

  // Calculate overall averages (used if no range is selected)
  const overallAverages = useMemo(() => {
      if (!hasSessions) return null;
      const allSessionsAverageData = sessions.reduce(
        (acc, s) => {
          acc.difficultyLevel += Number(s.difficultyLevel) || 0;
          acc.painLevel += Number(s.painLevel) || 0;
          acc.accomplishedExercice += Number(s.accomplishedExercice) || 0;
          acc.walkingTime += Number(s.walkingTime) || 0;
          return acc;
        },
        { difficultyLevel: 0, painLevel: 0, walkingTime: 0, accomplishedExercice: 0 }
      );
      const totalSessions = sessions.length;
      return {
        difficulty: (allSessionsAverageData.difficultyLevel / totalSessions).toFixed(1),
        pain: (allSessionsAverageData.painLevel / totalSessions).toFixed(1),
        walking: (allSessionsAverageData.walkingTime / totalSessions).toFixed(1),
        exercises: (allSessionsAverageData.accomplishedExercice / totalSessions).toFixed(1),
        count: totalSessions
      };
  }, [sessions, hasSessions]);

  const averagesToDisplay = dateRange[0] && dateRange[1] ? rangeAverages : overallAverages;
  
  // Memoize the mapped sessions data separately
  const allSessionsProgressionData = useMemo(() => 
    sessions.map((session, index) => ({
      date: dayjs(session.date).format('YYYY-MM-DD'),
      sessionIndex: index + 1,
      difficulty: Number(session.difficultyLevel),
      pain: Number(session.painLevel),
      walking: Number(session.walkingTime),
      exercises: Number(session.accomplishedExercice)
    })).sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
  , [sessions]);
  
  const progressionDataToDisplay = dateRange[0] && dateRange[1] 
    ? rangeProgressionData 
    : allSessionsProgressionData;

  const needsFollowUp = overallAverages && (parseFloat(overallAverages.pain) >= 3.0 || parseFloat(overallAverages.difficulty) >= 3.0);
  
  // function to obtain label for current date
  const getPeriodLabel = useCallback(() => {
    const date = currentPeriodDate;
    
    switch (averageViewMode) {
      case 'week':
        return `Semaine du ${date.startOf('week').format('DD/MM/YYYY')}`;
      case 'month':
        return date.format('MMMM YYYY');
      case 'quarter':
        return `${date.quarter()}e trimestre ${date.year()}`;
      case 'year':
        return date.format('YYYY');
      default:
        return date.format('MMMM YYYY');
    }
  }, [currentPeriodDate, averageViewMode]);

  // function to check if period is in the future
  const isFuturePeriod = useCallback(() => {
    const now = dayjs();
    
    switch (averageViewMode) {
      case 'week':
        return currentPeriodDate.startOf('week').isAfter(now.startOf('week'));
      case 'month':
        return currentPeriodDate.startOf('month').isAfter(now.startOf('month'));
      case 'quarter':
        return currentPeriodDate.startOf('quarter').isAfter(now.startOf('quarter'));
      case 'year':
        return currentPeriodDate.startOf('year').isAfter(now.startOf('year'));
      default:
        return false;
    }
  }, [currentPeriodDate, averageViewMode]);

  // --- Event Handlers ---
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Reset to first session on date change
    setCurrentSessionIndex(0);
  };

  
  const handleRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
      setCurrentPeriodDate(dates[0]);
    } else {
      setDateRange([null, null]);
    }
  };

  // New handlers for navigating between sessions of the same day
  const handlePreviousSession = () => {
    setCurrentSessionIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNextSession = () => {
    setCurrentSessionIndex(prev => Math.min(prev + 1, selectedDateSessions.length - 1));
  };
  
  
  const handlePeriodChange = useCallback((direction) => {
    setCurrentPeriodDate(prevDate => {
      let newDate = dayjs(prevDate);
      
      if (direction === 'previous') {
        switch (averageViewMode) {
          case 'week':
            newDate = newDate.subtract(1, 'week');
            break;
          case 'month':
            newDate = newDate.subtract(1, 'month');
            break;
          case 'quarter':
            newDate = newDate.subtract(1, 'quarter');
            break;
          case 'year':
            newDate = newDate.subtract(1, 'year');
            break;
        }
      } else if (direction === 'next') {
        switch (averageViewMode) {
          case 'week':
            newDate = newDate.add(1, 'week');
            break;
          case 'month':
            newDate = newDate.add(1, 'month');
            break;
          case 'quarter':
            newDate = newDate.add(1, 'quarter');
            break;
          case 'year':
            newDate = newDate.add(1, 'year');
            break;
        }
      }
      
      return newDate;
    });
    // Don't update dateRange here - let the effect handle it based on currentPeriodDate changes
  }, [averageViewMode]); // Only depends on averageViewMode, not current dates

  
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dateSessionsArray = sessionsByDate.get(dateStr) || [];
    
    if (dateSessionsArray.length > 0) {
      return (
        <ul className="events">
          <li key={dateStr}>
            <Tag color="blue">
              {dateSessionsArray.length > 1 
                ? `${dateSessionsArray.length} Sessions` 
                : "1 Session"}
            </Tag>
          </li>
        </ul>
      );
    }
    return null;
  };

  // --- CSV Export Function ---
  const downloadCSV = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    let headers = [
      "PatientID", "PatientFirstName", "PatientLastName", "PatientEmail",
      "PatientPhone", "PatientStatus", "PatientPrograms",
      "SessionID", "ProgramEnrollementId", "SessionDate", "CreatedAt", "UpdatedAt",
      "DifficultyLevel", "PainLevel", "WalkingTime", "AccomplishedExercises"
    ];

    let rows = [];

    sessions.forEach((session) => {
      const sessionDate = session.date ? dayjs(session.date).format('YYYY-MM-DD') : "";
      const createdAt = session.createdAt ? dayjs(session.createdAt).format('YYYY-MM-DD') : "";
      const updatedAt = session.updatedAt ? dayjs(session.updatedAt).format('YYYY-MM-DD') : "";

      const row = {
        "PatientID": patient.id,
        "PatientFirstName": patient.firstname,
        "PatientLastName": patient.lastname,
        "PatientEmail": patient.email || "",
        "PatientPhone": patient.phoneNumber || "",
        "PatientStatus": patient.status || "",
        "PatientPrograms": patientPrograms.length,

        "SessionID": session.id,
        "ProgramEnrollementId": session.ProgramEnrollementId || "",
        "SessionDate": sessionDate,
        "CreatedAt": createdAt,
        "UpdatedAt": updatedAt,
        "DifficultyLevel": session.difficultyLevel ?? "",
        "PainLevel": session.painLevel ?? "",
        "WalkingTime": session.walkingTime ?? "",
        "AccomplishedExercises": session.accomplishedExercice ?? ""
      };
      rows.push(row);
    });

    const formatValue = (value) => {
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    let csvContent = '\ufeff';
    csvContent += headers.map(formatValue).join(",") + "\n";

    rows.forEach(row => {
      const rowValues = headers.map(header => formatValue(row[header]));
      csvContent += rowValues.join(",") + "\n";
    });

    // Add Program Info
    if (hasPrograms) {
      csvContent += "\n\n# PROGRAM INFORMATION\n";
      const programHeaders = ["ProgramID", "ProgramName", "ProgramDescription", "ProgramDuration", "ProgramUnit", "ProgramStatus"];
      csvContent += programHeaders.map(formatValue).join(",") + "\n";
      patientPrograms.forEach((program) => {
        csvContent += [ program.id, program.name, program.description, program.duration, program.duration_unit, program.actif ? "1" : "0" ].map(formatValue).join(",") + "\n";
      });
    }
    
    // Add Bloc Info
    if (allBlocs && allBlocs.length > 0) {
        csvContent += "\n\n# BLOC INFORMATION\n";
        const blocHeaders = ["BlocID", "BlocName", "BlocDescription", "BlocKey", "BlocCreatedAt", "BlocUpdatedAt"];
        csvContent += blocHeaders.map(formatValue).join(",") + "\n";
        allBlocs.forEach((bloc) => {
            const createdAt = bloc.createdAt ? dayjs(bloc.createdAt).format('YYYY-MM-DD') : "";
            const updatedAt = bloc.updatedAt ? dayjs(bloc.updatedAt).format('YYYY-MM-DD') : "";
            csvContent += [ bloc.id, bloc.name, bloc.description, bloc.key, createdAt, updatedAt ].map(formatValue).join(",") + "\n";
        });
    }
    
    // Add Exercise Info
    if (allExercises && allExercises.length > 0) {
        csvContent += "\n\n# EXERCISE INFORMATION\n";
        const exerciseHeaders = ["ExerciseID", "ExerciseName", "ExerciseDescription", "ExerciseKey", "ExerciseBlocId", "CreatedAt", "UpdatedAt"];
        csvContent += exerciseHeaders.map(formatValue).join(",") + "\n";
        allExercises.forEach((exercise) => {
            const createdAt = exercise.createdAt ? dayjs(exercise.createdAt).format('YYYY-MM-DD') : "";
            const updatedAt = exercise.updatedAt ? dayjs(exercise.updatedAt).format('YYYY-MM-DD') : "";
            csvContent += [ exercise.id, exercise.name, exercise.description, exercise.key, exercise.BlocId, createdAt, updatedAt ].map(formatValue).join(",") + "\n";
        });
    }

    const fileName = `${patient.firstname}_${patient.lastname}_data_spss_${dateStr}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
  };
  
  // --- Render JSX ---
  return (
    <div className="patient-data-container">
      <div className="export-header">
        <h2 className="section-header">
          {t("Statistique du patient")}
          <Button onClick={downloadCSV} type="primary" disabled={!hasSessions && !hasPrograms}>
            {t("Export to CSV")}
          </Button>
        </h2>
      </div>
  
      
      <div className="side-by-side-container">
        <div className="side-by-side-card">
          <h2 className="section-header">Informations</h2>
          <Card>
            <p>
              <strong className="patient-name">
                {patient.firstname?.charAt(0).toUpperCase() + patient.firstname?.slice(1)}{' '}
                {patient.lastname?.charAt(0).toUpperCase() + patient.lastname?.slice(1)}
              </strong>
              {needsFollowUp && ( <span className="warning-badge"> Suivi requis </span> )}
            </p>
            <p><strong>{t("Patients:email")}:</strong> {patient.email || "N/A"}</p>
            <p><strong>{t("Patients:phone")}:</strong> {patient.phoneNumber || "N/A"}</p>
            <p><strong>{t("Patients:status")}:</strong> {patient.status || "N/A"}</p>
            <p><strong>{t("Patients:programs")}:</strong> {patientPrograms.length}</p>
            {/* Warning Messages based on OVERALL Averages */}
            {overallAverages && (
              <div className="message-container">
                {parseFloat(overallAverages.pain) >= 3 && ( <p className="message warning-message"> Attention: Niveau de douleur moyen élevé ({overallAverages.pain}) - Consultation médicale recommandée </p> )}
                {parseFloat(overallAverages.difficulty) >= 3 && ( <p className="message warning-message"> Attention: Programme potentiellement trop difficile (moyenne {overallAverages.difficulty}) - Ajustement suggéré </p> )}
              </div>
            )}
          </Card>
        </div>
  
        {/* --- Patient Programs Section --- */}
        <div className="side-by-side-card">
          <h2 className="section-header">Programmes</h2>
          <Card>
            {hasPrograms ? (
              <div className="program-data-container">
                <div className="program-navigation">
                  <Button onClick={() => setCurrentProgram((prev) => Math.max(prev - 1, 0))} disabled={currentProgram === 0}> Précédent </Button>
                  <span className="program-indicator">Programme {currentProgram + 1} sur {patientPrograms.length}</span>
                  <Button onClick={() => setCurrentProgram((prev) => Math.min(prev + 1, patientPrograms.length - 1))} disabled={currentProgram === patientPrograms.length - 1}> Suivant </Button>
                </div>
                <div className="program-details">
                  <Descriptions bordered size="small" column={1} title={`Détails Programme ${currentProgram + 1}`}>
                    <Descriptions.Item label="Nom">{currentProgramData.name || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Description">{currentProgramData.description || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Durée">{currentProgramData.duration} {currentProgramData.duration_unit}</Descriptions.Item>
                    <Descriptions.Item label="Statut">{currentProgramData.actif ? "Actif" : "Inactif"}</Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            ) : ( <Empty description={<span>{t("Aucun programme disponible pour ce patient")}</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} /> )}
          </Card>
        </div>
      </div>
  
      
      <div className="side-by-side-container">
        <div className="side-by-side-card">
          <h2 className="section-header">Données de session</h2>
          <Card>
            {isLoadingSessions ? (
                <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
            ) : hasSessions ? (
              <div className="session-calendar-layout">
                <div className="session-calendar-container">
                  <div>  
                    <Calendar
                      fullscreen={false}
                      onSelect={handleDateSelect}
                      value={selectedDate}
                      locale={locale}
                      dateCellRender={dateCellRender}
                    />
                  </div> 
                </div>
  
                
                <div className="session-vertical-layout">
                  <div className="session-details-full-width">
                    {selectedDateSessions.length > 0 ? (
                      <>
                        {selectedDateSessions.length > 1 && (
                          <div className="session-navigation">
                            <Button 
                              onClick={handlePreviousSession} 
                              disabled={currentSessionIndex === 0}
                            >
                              Session précédente
                            </Button>
                            <span className="session-indicator">
                              Session {currentSessionIndex + 1} sur {selectedDateSessions.length}
                            </span>
                            <Button 
                              onClick={handleNextSession} 
                              disabled={currentSessionIndex === selectedDateSessions.length - 1}
                            >
                              Session suivante
                            </Button>
                          </div>
                        )}
                        
                        {/* Session details */}
                        <Descriptions 
                          bordered 
                          size="small" 
                          column={1} 
                          title={`Détails Session (${selectedDate.format('DD MMMM YYYY')}${
                              selectedDateSessions.length > 1 ? ` - #${currentSessionIndex + 1}` : ''})`
                          }
                        >
                          <Descriptions.Item label="ID Session">{selectedSessionData.id}</Descriptions.Item>
                          <Descriptions.Item label="Niveau Difficulté">{selectedSessionData.difficultyLevel ?? "N/A"}</Descriptions.Item>
                          <Descriptions.Item label="Niveau Douleur">{selectedSessionData.painLevel ?? "N/A"}</Descriptions.Item>
                          <Descriptions.Item label="Temps Marche (min)">{selectedSessionData.walkingTime ?? "N/A"}</Descriptions.Item>
                          <Descriptions.Item label="Exercices Accomplis">{selectedSessionData.accomplishedExercice ?? "N/A"}</Descriptions.Item>
                          {selectedSessionData.createdAt && (
                            <Descriptions.Item label="Créée le">
                              {dayjs(selectedSessionData.createdAt).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                          )}
                        </Descriptions>
                      </>
                    ) : (
                      <Alert message={`Aucune session enregistrée pour le ${selectedDate.format('DD MMMM YYYY')}`} type="info" showIcon />
                    )}
                  </div>
  
                  <div className="session-chart-full-width">
                    {selectedSessionData ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sessionDataForChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis hide={true} />
                          <YAxis />
                          <Tooltip />
                          <Legend 
                            align="center" 
                            verticalAlign="bottom" 
                            layout="horizontal" 
                            wrapperStyle={{ 
                              paddingTop: '10px', 
                              marginBottom: '0px' 
                            }} 
                          />
                          <Bar dataKey="difficultyLevel" fill="#8884d8" name="Difficulté" />
                          <Bar dataKey="painLevel" fill="#82ca9d" name="Douleur" />
                          <Bar dataKey="walkingTime" fill="#0088FE" name="Temps Marche" />
                          <Bar dataKey="accomplishedExercice" fill="#ff7300" name="Exercices" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="chart-placeholder">Sélectionnez une date avec une session pour voir le graphique.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Empty description={<span>{t("Aucune session disponible pour ce patient")}</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </div>
  
        {/* --- Average Section --- */}
        <div className="side-by-side-card">
          <h2 className="section-header">Moyenne des sessions</h2>
          <Card>
            
            <div className="average-vertical-layout">
              <div className="average-controls-container">
                <div className="average-view-selector">
                  <Radio.Group value={averageViewMode} onChange={(e) => setAverageViewMode(e.target.value)}>
                    <Radio.Button value="week">Semaine</Radio.Button>
                    <Radio.Button value="month">Mois</Radio.Button>
                    <Radio.Button value="quarter">Trimestre</Radio.Button>
                    <Radio.Button value="year">Année</Radio.Button>
                  </Radio.Group>
                </div>
                
                <div className="average-date-selector">
                  <label>Filtrer les moyennes par date : </label>
                  <div>  
                    <RangePicker
                      onChange={handleRangeChange}
                      locale={locale}
                      disabled={!hasSessions}
                      allowClear={true}
                      format="DD/MM/YYYY"
                      value={dateRange}
                    />
                  </div>  
                </div>
                
                <div className="average-period-navigation">
                  <Button 
                    onClick={() => handlePeriodChange('previous')} 
                    disabled={!hasSessions}
                  >
                    Période précédente
                  </Button>
                  <span className="period-indicator">
                    {getPeriodLabel()}
                  </span>
                  <Button 
                    onClick={() => handlePeriodChange('next')} 
                    disabled={!hasSessions || isFuturePeriod()}
                  >
                    Période suivante
                  </Button>
                </div>
              </div>
  
              <div className="average-summary-full-width">
                {averagesToDisplay ? (
                  <Descriptions bordered size="small" column={1} title={dateRange[0] && dateRange[1] ? `Moyennes (${dayjs(dateRange[0]).format('DD/MM/YY')} - ${dayjs(dateRange[1]).format('DD/MM/YY')})` : "Moyennes Globales"}>
                    <Descriptions.Item label="Nb Sessions">{averagesToDisplay.count}</Descriptions.Item>
                    <Descriptions.Item label="Difficulté Moy.">{averagesToDisplay.difficulty}</Descriptions.Item>
                    <Descriptions.Item label="Douleur Moy.">{averagesToDisplay.pain}</Descriptions.Item>
                    <Descriptions.Item label="Marche Moy. (min)">{averagesToDisplay.walking}</Descriptions.Item>
                    <Descriptions.Item label="Exercices Moy.">{averagesToDisplay.exercises}</Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Alert message="Aucune session trouvée dans la plage de dates sélectionnée." type="info" showIcon/>
                )}
              </div>
  
              <div className="average-chart-full-width">
                {progressionDataToDisplay.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={progressionDataToDisplay} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(tick) => dayjs(tick).format('DD/MM')}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis />
                      <Tooltip labelFormatter={(label) => dayjs(label).format('DD MMMM YYYY')} />
                      <Legend />
                      <Line type="monotone" dataKey="difficulty" stroke="#8884d8" name="Difficulté" dot={false} />
                      <Line type="monotone" dataKey="pain" stroke="#82ca9d" name="Douleur" dot={false} />
                      <Line type="monotone" dataKey="walking" stroke="#0088FE" name="Temps Marche" dot={false} />
                      <Line type="monotone" dataKey="exercises" stroke="#ff7300" name="Exercices" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-placeholder">Aucune donnée à afficher pour la période sélectionnée.</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// PropTypes definition
PatientStats.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func,
};

PatientStats.defaultProps = {
  onClose: null,
  patient: { firstname: '', lastname: '' }
};
