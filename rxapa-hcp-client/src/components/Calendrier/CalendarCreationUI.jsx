import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
<<<<<<< HEAD
import frLocale from "@fullcalendar/core/locales/fr";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Typography,
  message,
  Select,
  Row,
  Col,
  Card,
  Modal,
  Input,
  Button,
} from "antd";
=======
import { Typography, message, Select, Row, Col, Card, Modal, Input } from "antd";
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68

const { Title } = Typography;
const { Option } = Select;

export default function CalendarCreationUI() {
  const { token } = useToken();
  const [patients, setPatients] = useState([]);
  const [programs, setPrograms] = useState([]);
<<<<<<< HEAD
  const [allSessions, setAllSessions] = useState([]);
=======
  const [sessions, setSessions] = useState([]); // Pour le calendrier
  const [allSessions, setAllSessions] = useState([]); // Pour le Select dans le Modal
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
  const [events, setEvents] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
<<<<<<< HEAD
  const [selectedSessionName, setSelectedSessionName] = useState("");
  const [newSessionDate, setNewSessionDate] = useState(null);
  const [newSessionEndTime, setNewSessionEndTime] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [patientsRes, programsRes, sessionRes] = await Promise.all([
          axios.get(`${Constants.SERVER_URL}/patients`, {
            headers: { Authorization: "Bearer " + token },
          }),
          axios.get(`${Constants.SERVER_URL}/programs`, {
            headers: { Authorization: "Bearer " + token },
          }),
          axios.get(`${Constants.SERVER_URL}/sessions`, {
            headers: { Authorization: "Bearer " + token },
          }),
        ]);
        setPatients(patientsRes.data);
        setPrograms(programsRes.data);
        setAllSessions(Array.isArray(sessionRes.data) ? sessionRes.data : []);
      } catch (error) {
        console.error("Erreur chargement des données :", error);
      }
    };
    fetchDropdowns();
  }, [token]);

  const fetchCalendarSessions = async () => {
    if (!selectedProgram) return;
    try {
      const res = await axios.get(
        `${Constants.SERVER_URL}/calendar-sessions/by-program/${selectedProgram}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const sessionEvents = res.data.map((session) => ({
        id: session.id,
        title: session.name,
        start: session.startDate,
        end: session.endDate,
        allDay: false,
        extendedProps: {
          patientId: session.PatientId,
          programId: session.ProgramId,
        },
      }));
      setEvents(sessionEvents);
    } catch (error) {
      console.error("Erreur chargement rendez-vous calendrier :", error);
=======
  const [selectedSessionName, setSelectedSessionName] = useState(""); // Nouveau nom clair
  const [newSessionDate, setNewSessionDate] = useState(null);
  const [newSessionTime, setNewSessionTime] = useState("14:00");

  // Récupération initiale des patients, programmes et toutes les sessions
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const patientsRes = await axios.get(`${Constants.SERVER_URL}/patients`, {
          headers: { Authorization: "Bearer " + token },
        });
        setPatients(patientsRes.data);

        const programsRes = await axios.get(`${Constants.SERVER_URL}/programs`, {
          headers: { Authorization: "Bearer " + token },
        });
        setPrograms(programsRes.data);

        const sessionRes = await axios.get(`${Constants.SERVER_URL}/sessions`, {
          headers: { Authorization: "Bearer " + token },
        });
        const data = Array.isArray(sessionRes.data) ? sessionRes.data : [];
        setAllSessions(data);
      } catch (error) {
        console.error("Erreur chargement patients/programmes/sessions:", error);
      }
    };

    fetchDropdowns();
  }, [token]);

  // Récupération des sessions liées à un programme sélectionné
  const fetchSessions = async () => {
    if (!selectedProgram) return;
    try {
      const sessionsRes = await axios.get(`${Constants.SERVER_URL}/sessions/by-program/${selectedProgram}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = Array.isArray(sessionsRes.data) ? sessionsRes.data : [];
      setSessions(data);

      const sessionEvents = data.map((session) => ({
        id: session.id,
        title: session.name,
        start: session.startDate || session.date,
        allDay: false,
      }));
      setEvents(sessionEvents);
    } catch (error) {
      console.error("Erreur chargement sessions:", error);
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchCalendarSessions();
  }, [selectedProgram, token]);

  const handleDateClick = (info) => {
    const dateStr = info.dateStr + "T14:00";
    const endStr = info.dateStr + "T15:00";
    setNewSessionDate(dateStr);
    setNewSessionEndTime(endStr);
    setIsModalVisible(true);
    setSelectedEvent(null);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsEventModalVisible(true);
  };

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? { ...event, start: info.event.startStr }
        : event
    );
=======
    fetchSessions();
  }, [selectedProgram, token]);

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) => {
      if (event.id === info.event.id) {
        return { ...event, start: info.event.startStr };
      }
      return event;
    });
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
    setEvents(updatedEvents);
    message.success("Session déplacée !");
  };

<<<<<<< HEAD
  const handleEventResize = async (info) => {
    const updatedEvent = info.event;
    const fullStart = updatedEvent.start.toISOString();
    const fullEnd = updatedEvent.end.toISOString();

    try {
      await axios.put(
        `${Constants.SERVER_URL}/calendar-sessions/${updatedEvent.id}`,
        {
          startDate: fullStart,
          endDate: fullEnd,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      await fetchCalendarSessions();
      message.success("Rendez-vous modifié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification du rendez-vous :", error);
      message.error("Erreur lors de la modification.");
    }
  };

  const handleCreateSession = async () => {
    if (!selectedSessionName || !newSessionDate || !newSessionEndTime || !selectedProgram || !selectedPatient) {
      return message.error("Veuillez remplir tous les champs.");
    }

    const payload = {
      name: selectedSessionName,
      startDate: newSessionDate,
      endDate: newSessionEndTime,
      programId: selectedProgram,
      patientId: selectedPatient,
    };

    try {
      if (selectedEvent) {
        await axios.put(
          `${Constants.SERVER_URL}/calendar-sessions/${selectedEvent.id}`,
          payload,
          { headers: { Authorization: "Bearer " + token } }
        );
        await fetchCalendarSessions();
        message.success("Rendez-vous modifié !");
      } else {
        const res = await axios.post(
          `${Constants.SERVER_URL}/calendar-sessions`,
          payload,
          { headers: { Authorization: "Bearer " + token } }
        );
        setEvents((prev) => [
          ...prev,
          {
            id: res.data.id,
            title: res.data.name,
            start: res.data.startDate,
            end: res.data.endDate,
            allDay: false,
          },
        ]);
        message.success("Rendez-vous créé !");
      }

      setIsModalVisible(false);
      setSelectedSessionName("");
      setNewSessionDate(null);
      setNewSessionEndTime(null);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      message.error("Erreur lors de la sauvegarde.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await axios.delete(
        `${Constants.SERVER_URL}/calendar-sessions/${selectedEvent.id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setIsEventModalVisible(false);
      message.success("Rendez-vous supprimé !");
      fetchCalendarSessions();
    } catch (error) {
      console.error("Erreur suppression rendez-vous :", error);
      message.error("Erreur lors de la suppression.");
    }
  };

  const handleEditEvent = () => {
    setSelectedSessionName(selectedEvent.title);
    setNewSessionDate(new Date(selectedEvent.start).toISOString().slice(0, 16));
    setNewSessionEndTime(new Date(selectedEvent.end).toISOString().slice(0, 16));
    setIsEventModalVisible(false);
    setIsModalVisible(true);
  };

  const handleDownloadPDF = async () => {
    const calendarElement = document.querySelector(".fc");
    const canvas = await html2canvas(calendarElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("calendrier.pdf");
  };

  const isSaveDisabled =
    !isModalVisible ||
    !selectedSessionName ||
    !newSessionDate ||
    !newSessionEndTime ||
    !selectedProgram ||
    !selectedPatient;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto", position: "relative" }}>
=======
  const handleDateClick = (info) => {
    setNewSessionDate(info.dateStr);
    setIsModalVisible(true);
  };
  const handleEventResize = (info) => {
    const updatedEvents = events.map((event) => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.startStr,
          end: info.event.endStr, // 👈 durée modifiée
        };
      }
      return event;
    });
  
    setEvents(updatedEvents);
    message.success("Durée de la session modifiée !");
  };
  

  const handleCreateSession = async () => {
    if (!selectedSessionName || !newSessionDate || !selectedProgram || !selectedPatient) {
      message.error("Veuillez remplir tous les champs.");
      return;
    }

    const fullDateTime = `${newSessionDate}T${newSessionTime}:00`;

    try {
      await axios.post(`${Constants.SERVER_URL}/sessions`, {
        name: selectedSessionName,
        startDate: fullDateTime,
        programId: selectedProgram,
        patientId: selectedPatient
      }, {
        headers: { Authorization: "Bearer " + token }
      });

      message.success("Session ajoutée !");
      setIsModalVisible(false);
      setSelectedSessionName("");
      setNewSessionTime("14:00");
      //await fetchSessions(); // le backend n’est pas prêt
      const newEvent = {
        id: Date.now(), // ID temporaire
        title: selectedSessionName,
        start: `${newSessionDate}T${newSessionTime}:00`,
        allDay: false,
      };
      
      setEvents((prev) => [...prev, newEvent]); // Ajoute directement au calendrier
      
    } catch (error) {
      message.error("Erreur lors de la création de la session.");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
      <Title level={2} style={{ marginBottom: 32 }}>Calendrier des sessions</Title>

      <Card style={{ marginBottom: 24, backgroundColor: "#fafafa", borderRadius: 8 }}>
        <Row gutter={16}>
          <Col span={12}>
<<<<<<< HEAD
            <label>Patient :</label>
=======
            <label style={{ display: "block", marginBottom: 8 }}>Patient :</label>
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
            <Select
              placeholder="Choisir un patient"
              onChange={setSelectedPatient}
              value={selectedPatient || undefined}
              style={{ width: "100%" }}
            >
<<<<<<< HEAD
              {patients.map((p) => (
                <Option key={p.id} value={p.id}>{p.firstname} {p.lastname}</Option>
=======
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.firstname} {patient.lastname}
                </Option>
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
              ))}
            </Select>
          </Col>
          <Col span={12}>
<<<<<<< HEAD
            <label>Programme :</label>
=======
            <label style={{ display: "block", marginBottom: 8 }}>Programme :</label>
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
            <Select
              placeholder="Choisir un programme"
              onChange={setSelectedProgram}
              value={selectedProgram || undefined}
              style={{ width: "100%" }}
            >
              {programs.map((program) => (
<<<<<<< HEAD
                <Option key={program.id} value={program.id}>{program.name}</Option>
=======
                <Option key={program.id} value={program.id}>
                  {program.name}
                </Option>
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Card style={{ padding: 16, borderRadius: 8, backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          eventResize={handleEventResize}
<<<<<<< HEAD
          eventDrop={handleEventDrop}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          eventColor="#1890ff"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek,dayGridDay" }}
          locales={[frLocale]}
          locale="fr"
          firstDay={1}
          height={650}
        />
        <Button onClick={handleDownloadPDF} style={{ marginTop: 16 }}>Télécharger en PDF</Button>
=======
          events={events}
          eventDrop={handleEventDrop}
          dateClick={handleDateClick}
          eventColor="#1890ff"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay"
          }}
          height={650}
        />
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <button
            onClick={handleCreateSession}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1890ff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Sauvegarder le rendez-vous
          </button>
        </div>
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
      </Card>

      <Modal
        title="Ajouter une session"
        open={isModalVisible}
<<<<<<< HEAD
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
=======
        onOk={handleCreateSession}
        onCancel={() => setIsModalVisible(false)}
        okText="Créer"
        cancelText="Annuler"
      >
        <p>Date : {newSessionDate}</p>

>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
        <Select
          placeholder="Choisir une session existante"
          onChange={(value) => setSelectedSessionName(value)}
          value={selectedSessionName || undefined}
          style={{ width: "100%", marginBottom: 16 }}
        >
<<<<<<< HEAD
          {allSessions.map((session) => (
            <Option key={session.id} value={session.name}>{session.name}</Option>
          ))}
        </Select>

        <label>Début :</label>
        <Input
          type="datetime-local"
          value={newSessionDate || ""}
          onChange={(e) => setNewSessionDate(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <label>Fin :</label>
        <Input
          type="datetime-local"
          value={newSessionEndTime || ""}
          onChange={(e) => setNewSessionEndTime(e.target.value)}
        />
      </Modal>

      <Modal
        title="Détails du rendez-vous"
        open={isEventModalVisible}
        onCancel={() => setIsEventModalVisible(false)}
        footer={[
          <Button key="delete" danger onClick={handleDeleteEvent}>Supprimer</Button>,
          <Button key="edit" type="primary" onClick={handleEditEvent}>Modifier</Button>,
        ]}
      >
        {selectedEvent && (
          <>
            <p><strong>Nom :</strong> {selectedEvent.title}</p>
            <p><strong>Date début :</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
            <p><strong>Date fin :</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
          </>
        )}
      </Modal>

      <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999 }}>
        <Button type="primary" size="large" disabled={isSaveDisabled} onClick={handleCreateSession}>Sauvegarder</Button>
      </div>
    </div>
  );
}
=======
          {Array.isArray(allSessions) && allSessions.map((session) => (
            <Option key={session.id} value={session.name}>
              {session.name}
            </Option>
          ))}
        </Select>

        <Input
          type="time"
          value={newSessionTime}
          onChange={(e) => setNewSessionTime(e.target.value)}
        />
      </Modal>
    </div>
  );
}
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
