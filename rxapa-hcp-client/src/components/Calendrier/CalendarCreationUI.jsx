import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { Typography, message, Select, Row, Col, Card, Modal, Input } from "antd";

const { Title } = Typography;
const { Option } = Select;

export default function CalendarCreationUI() {
  const { token } = useToken();
  const [patients, setPatients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]); // Pour le calendrier
  const [allSessions, setAllSessions] = useState([]); // Pour le Select dans le Modal
  const [events, setEvents] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedProgram, token]);

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) => {
      if (event.id === info.event.id) {
        return { ...event, start: info.event.startStr };
      }
      return event;
    });
    setEvents(updatedEvents);
    message.success("Session déplacée !");
  };

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
      <Title level={2} style={{ marginBottom: 32 }}>Calendrier des sessions</Title>

      <Card style={{ marginBottom: 24, backgroundColor: "#fafafa", borderRadius: 8 }}>
        <Row gutter={16}>
          <Col span={12}>
            <label style={{ display: "block", marginBottom: 8 }}>Patient :</label>
            <Select
              placeholder="Choisir un patient"
              onChange={setSelectedPatient}
              value={selectedPatient || undefined}
              style={{ width: "100%" }}
            >
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.firstname} {patient.lastname}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <label style={{ display: "block", marginBottom: 8 }}>Programme :</label>
            <Select
              placeholder="Choisir un programme"
              onChange={setSelectedProgram}
              value={selectedProgram || undefined}
              style={{ width: "100%" }}
            >
              {programs.map((program) => (
                <Option key={program.id} value={program.id}>
                  {program.name}
                </Option>
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
      </Card>

      <Modal
        title="Ajouter une session"
        open={isModalVisible}
        onOk={handleCreateSession}
        onCancel={() => setIsModalVisible(false)}
        okText="Créer"
        cancelText="Annuler"
      >
        <p>Date : {newSessionDate}</p>

        <Select
          placeholder="Choisir une session existante"
          onChange={(value) => setSelectedSessionName(value)}
          value={selectedSessionName || undefined}
          style={{ width: "100%", marginBottom: 16 }}
        >
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
