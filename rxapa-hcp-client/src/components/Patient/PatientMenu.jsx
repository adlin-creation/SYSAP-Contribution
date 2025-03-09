import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { Card, Descriptions, Button, Table, Space, Tag, Row, Col, Modal as AntModal, Spin } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import CreatePatient from "./CreatePatient";
import PatientViewPage from "./PatientViewPage"; 
import PatientDetails from "./PatientDetails";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PatientMenu({ role }) {
  const navigate = useNavigate();
  const [viewingPatient, setViewingPatient] = useState(null);
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatePatient, setIsCreatePatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { token } = useToken();
  const patientUrl = `${Constants.SERVER_URL}/patients`;

  const { data: patientList, refetch: refetchPatients, isLoading, isError, error } = useQuery(
    ["patients"],
    async () => {
      if (!token) return [];
      
      try {
        const { data } = await axios.get(patientUrl, {
          headers: { Authorization: "Bearer " + token },
        });
        return data || [];
      } catch (err) {
        console.error("Error fetching patients:", err);
        return [];
      }
    },
    {
      enabled: !!token,
      retry: 1,
      staleTime: 30000,
      onError: (err) => {
        console.error("Query error:", err);
        openModal(err.message || "Error loading patient data", true);
      }
    }
  );

  // Safe fetch functions with proper error handling
  const fetchProgramEnrollements = async (patientId) => {
    if (!token || !patientId) return [];
    
    try {
      const { data } = await axios.get(`${Constants.SERVER_URL}/program-enrollements`, {
        headers: { Authorization: "Bearer " + token },
      });
      return data.filter((prog) => prog.PatientId === patientId) || [];
    } catch (err) {
      console.error("Error fetching program enrollments:", err);
      return [];
    }
  };

  const fetchPatientCaregivers = async (programEnrollements) => {
    if (!token || !programEnrollements?.length) return [];
    
    try {
      const { data } = await axios.get(`${Constants.SERVER_URL}/patient-caregivers`, {
        headers: { Authorization: "Bearer " + token },
      });
      return data.filter((patientCaregiver) =>
        programEnrollements.some(
          (enrollment) => enrollment.id === patientCaregiver.ProgramEnrollementId
        )
      ) || [];
    } catch (err) {
      console.error("Error fetching patient caregivers:", err);
      return [];
    }
  };

  const fetchCaregiversDetails = async (caregivers) => {
    if (!token || !caregivers?.length) return [];
    
    try {
      const caregiversDetails = await Promise.all(
        caregivers.map((caregiver) =>
          axios
            .get(`${Constants.SERVER_URL}/caregiver/${caregiver.CaregiverId}`, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((res) => res.data)
            .catch(error => {
              console.error("Error fetching caregiver details:", error);
              return null;
            })
        )
      );
      return caregiversDetails.filter(Boolean); // Remove any null values
    } catch (err) {
      console.error("Error fetching caregiver details:", err);
      return [];
    }
  };

  const fetchProgram = async (ProgramEnrollement) => {
    if (!token || !ProgramEnrollement) return null;
    
    try {
      const { data } = await axios.get(`${Constants.SERVER_URL}/programs`, {
        headers: { Authorization: "Bearer " + token },
      });
      return data.find((prog) => prog.id === ProgramEnrollement.ProgramId) || null;
    } catch (err) {
      console.error("Error fetching program:", err);
      return null;
    }
  };

  const handleGetCaregivers = async (patient) => {
    if (!patient || !patient.id) {
      openModal("Invalid patient data", true);
      return;
    }
    
    try {
      const programEnrollements = await fetchProgramEnrollements(patient.id);
      
      if (!programEnrollements.length) {
        openCaregiversModal([], [], []);
        return;
      }

      const patient_caregivers = await fetchPatientCaregivers(programEnrollements);
      
      if (!patient_caregivers.length) {
        openCaregiversModal([], [], programEnrollements);
        return;
      }

      const caregivers = await fetchCaregiversDetails(patient_caregivers);
      openCaregiversModal(caregivers, patient_caregivers, programEnrollements);
    } catch (err) {
      console.error("Error getting caregivers:", err);
      openModal(err.message || "Error retrieving caregiver information", true);
    }
  };

  const openCaregiversModal = (caregivers, patient_caregivers, programEnrollements) => {
    AntModal.info({
      title: (
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {t("Liste des soignants")}
        </div>
      ), 
      content: caregivers.length ? (
        <Row gutter={[16, 16]}>
          {caregivers.map(c => (
            <Col key={c.id} span={8}>
              <Card
                title={`${c.firstname || ''} ${c.lastname || ''}`}
                actions={[
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    onClick={() => viewCaregiverDetails(c, patient_caregivers, programEnrollements)}
                  >
                    {t("voir les details")}
                  </Button>
                ]}
              >
                <p><MailOutlined /> {c.email || 'N/A'}</p>
                <p><PhoneOutlined /> {c.phoneNumber || 'N/A'}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : <p>{t("Aucune aide soignante disponible")}</p>,
      onOk() { },
      width: "80%",
    });
  };

  const viewCaregiverDetails = async (caregiver, patient_caregivers, programEnrollements) => {
    if (!caregiver) return;
    
    const keysToShow = ['firstname', 'lastname', 'email', 'phoneNumber', 'relationship'];

    const patient_caregiver = patient_caregivers?.find(
      (p_c) => p_c.CaregiverId === caregiver.id
    );

    let program = null;
    if (patient_caregiver && programEnrollements?.length) {
      const programEnrollement = programEnrollements.find(
        (p_e) => p_e.id === patient_caregiver.ProgramEnrollementId
      );

      if (programEnrollement) {
        program = await fetchProgram(programEnrollement);
      }
    }

    const items = keysToShow
      .filter(key => caregiver[key] !== undefined)
      .map(key => ({
        key,
        label: t(`Patients:${key}`),
        children: caregiver[key] || 'N/A',
      }));

    if (program) {
      items.push({
        key: "program",
        label: t("Patients:program"),
        children: program.name || 'N/A',
      });
    }

    AntModal.info({
      title: (
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {caregiver.firstname || ''} {caregiver.lastname || ''} - {t("Détails de l'aide soignant")}
        </div>
      ), 
      content: (
        <Descriptions bordered column={1}>
          {items.map(item => (
            <Descriptions.Item key={item.key} label={item.label}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ),
      onOk() { },
      width: "60%",
    });
  };

  const getStatusColor = (status) => {
    if (!status) return "grey";
    
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "paused":
        return "orange";
      case "waiting":
        return "blue";
      case "completed":
        return "purple";
      case "abort":
        return "red";
      default:
        return "grey";
    }
  };

  const columns = [
    {
      title: t("Patients:name"),
      key: "name",
      render: (_, record) => record ? `${record.firstname || ''} ${record.lastname || ''}` : 'N/A',
    },
    {
      title: t("Patients:email"),
      dataIndex: "email",
      key: "email",
      render: (email) => email || 'N/A',
    },
    {
      title: t("Patients:phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => phone || 'N/A',
    },
    {
      title: t("Patients:status"),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: t("Patients:programs"),
      dataIndex: "numberOfPrograms",
      key: "numberOfPrograms",
      render: (programs) => programs || 0,
    },
    {
      title: "Caregivers",
      key: "caregivers",
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleGetCaregivers(record)}
          disabled={!record || !record.id}
        >
          Caregivers
        </Button>
      ),
    },
    {
      title: t("Patients:actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleView(record)}
            disabled={!record || !record.id}
          >
            <EyeOutlined /> {t("Patients:view_statistic_button")}
          </Button>
          <Button 
            type="link" 
            onClick={() => handleEdit(record)}
            style={{ display: role === 'admin' ? 'none' : 'inline-block' }}
            disabled={!record || !record.id}
          >
            <EditOutlined /> {t("Patients:edit_button")}
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record)}
            style={{ display: role === 'admin' ? 'none' : 'inline-block' }}
            disabled={!record || !record.id}
          >
            <DeleteOutlined /> {t("Patients:delete_button")}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (patient) => {
    if (!patient) return;
    setSelectedPatient(patient);
  };
  
  const handleView = (patient) => {
    if (!patient) return;
    setViewingPatient(patient);
  };

  const showCaregiverWarning = () => {
    AntModal.warning({
      title: t("Deletion impossible."),
      content: t("Please delete the associated caregivers before deleting this patient."),
      okText: "OK",
    });
  };

  const handleDelete = (patient) => {
    if (!patient || !patient.id) return;
    
    AntModal.confirm({
      title: t("Patients:delete_patient_alert"),
      icon: <ExclamationCircleOutlined />,
      content: `${patient.firstname || ''} ${patient.lastname || ''}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        if (!token) {
          openModal("Authentication token is missing", true);
          return;
        }
        
        if (patient.numberOfCaregivers === 0) {
          axios
            .delete(`${Constants.SERVER_URL}/delete-patient/${patient.id}`, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
              refetchPatients();
              openModal(res.data.message || "Patient deleted successfully", false);
            })
            .catch((err) => {
              console.error("Error deleting patient:", err);
              openModal(err.response?.data?.message || "Error deleting patient", true);
            });
        } else {
          showCaregiverWarning();
        }
      },
    });
  };

  const openModal = (message, isError) => {
    setMessage(message || "");
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Spin size="large" tip="Loading patient data..." />
      </div>
    );
  }

  // Render error state
  if (isError && !patientList) {
    return (
      <div style={{ textAlign: 'center', margin: '30px' }}>
        <h2>Error loading patients</h2>
        <p>{error?.message || "There was a problem loading the patient data."}</p>
        <Button type="primary" onClick={() => refetchPatients()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Affiche le bouton Back et le titre si on est en mode création, édition ou vue détaillée */}
      {(isCreatePatient || selectedPatient || viewingPatient) && (
        <Row align="middle" justify="space-between" style={{ marginBottom: "20px" }}>
          <Col>
            <Button
              onClick={() => {
                setIsCreatePatient(false);
                setSelectedPatient(null);
                setViewingPatient(null);
              }}
              type="primary"
              icon={<ArrowLeftOutlined />}
            >
              {t("Patients:back_button")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreatePatient
                ? t("Patients:register_new_patient")
                : selectedPatient
                ? t("Patients:edit_patient_details")
                : t("Patients:view_patient_details")}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {/* Main content */}
      {!isCreatePatient && !selectedPatient && !viewingPatient ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreatePatient(true)}
              style={{ display: role === 'admin' ? 'none' : 'inline-block' }}
              disabled={!token}
            >
              {t("Patients:register_patient")}
            </Button>
          </div>
  
          <Table 
            columns={columns} 
            dataSource={patientList || []} 
            rowKey="id" 
            loading={isLoading}
          />
        </>
      ) : isCreatePatient ? (
        <CreatePatient refetchPatients={refetchPatients} onClose={() => setIsCreatePatient(false)} />
      ) : selectedPatient ? (
        <PatientDetails
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          refetchPatients={refetchPatients}
          openModal={openModal}
        />
      ) : viewingPatient ? (
        <PatientViewPage patient={viewingPatient} onClose={() => setViewingPatient(null)} />
      ) : null}
  
      {/* Error/Success message modal */}
      <AntModal
        open={isOpenModal}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
        style={{ color: isErrorMessage ? "#ff4d4f" : "#52c41a" }}
      >
        <p>{message}</p>
      </AntModal>
    </div>
  );
}