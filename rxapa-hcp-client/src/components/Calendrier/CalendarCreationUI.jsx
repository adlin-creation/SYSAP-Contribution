import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
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

const { Title } = Typography;
const { Option } = Select;

export default function CalendarCreationUI() {
  const { token } = useToken();
  const [patients, setPatients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    }
  };

  useEffect(() => {
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
    setEvents(updatedEvents);
    message.success("Session déplacée !");
  };

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
      <Title level={2} style={{ marginBottom: 32 }}>Calendrier des sessions</Title>

      <Card style={{ marginBottom: 24, backgroundColor: "#fafafa", borderRadius: 8 }}>
        <Row gutter={16}>
          <Col span={12}>
            <label>Patient :</label>
            <Select
              placeholder="Choisir un patient"
              onChange={setSelectedPatient}
              value={selectedPatient || undefined}
              style={{ width: "100%" }}
            >
              {patients.map((p) => (
                <Option key={p.id} value={p.id}>{p.firstname} {p.lastname}</Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <label>Programme :</label>
            <Select
              placeholder="Choisir un programme"
              onChange={setSelectedProgram}
              value={selectedProgram || undefined}
              style={{ width: "100%" }}
            >
              {programs.map((program) => (
                <Option key={program.id} value={program.id}>{program.name}</Option>
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
      </Card>

      <Modal
        title="Ajouter une session"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Select
          placeholder="Choisir une session existante"
          onChange={(value) => setSelectedSessionName(value)}
          value={selectedSessionName || undefined}
          style={{ width: "100%", marginBottom: 16 }}
        >
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
        <Button type="primary" size="large" disabled={isSaveDisabled} onClick={handleCreateSession}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}
