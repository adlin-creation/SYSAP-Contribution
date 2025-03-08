import React, { useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Table, Space, Tag, Row, Col, Modal as AntModal } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import CreatePatient from "./CreatePatient";
import PatientDetails from "./PatientDetails";
import { useTranslation } from "react-i18next";

export default function PatientMenu({ role }) {
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatePatient, setIsCreatePatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { token } = useToken();

  const patientUrl = `${Constants.SERVER_URL}/patients`;

  const { data: patientList, refetch: refetchPatients } = useQuery(
    ["patients"],
    async () => {
      const { data } = await axios.get(patientUrl, {
        headers: { Authorization: "Bearer " + token },
      });
      return data;
    }
  );

  // Fonction pour récupérer les enregistrements de programme liés à un patient
  const fetchProgramEnrollements = async (patientId) => {
    try {
      const { data } = await axios.get(
        `${Constants.SERVER_URL}/program-enrollements`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      return data.filter((prog) => prog.PatientId === patientId);
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          "Erreur lors de la récupération des programmes."
      );
    }
  };

  // Fonction pour récupérer les soignants liés aux enregistrements de programme
  const fetchPatientCaregivers = async (programEnrollements) => {
    try {
      const { data } = await axios.get(
        `${Constants.SERVER_URL}/patient-caregivers`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      return data.filter((patientCaregiver) =>
        programEnrollements.some(
          (enrollment) =>
            enrollment.id === patientCaregiver.ProgramEnrollementId
        )
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          "Erreur lors de la récupération des soignants."
      );
    }
  };

  // Fonction pour récupérer les détails des soignants
  const fetchCaregiversDetails = async (caregivers) => {
    try {
      const caregiversDetails = await Promise.all(
        caregivers.map((caregiver) =>
          axios
            .get(`${Constants.SERVER_URL}/caregiver/${caregiver.CaregiverId}`, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((res) => res.data)
        )
      );
      return caregiversDetails;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          "Erreur lors de la récupération des détails des soignants."
      );
    }
  };

  // Fonction principale pour gérer la recuperation en cascade jusqu'aux aides soignants
  const handleGetCaregivers = async (patient) => {
    console.log(patient);
    try {
      const programEnrollements = await fetchProgramEnrollements(patient.id);
      console.log("Enregistrements du patient :", programEnrollements);

      const caregivers = await fetchPatientCaregivers(programEnrollements);
      console.log("Soignants associés :", caregivers);

      const caregiversDetails = await fetchCaregiversDetails(caregivers);
      console.log("Détails des soignants :", caregiversDetails);

      openCaregiversModal(caregiversDetails);
    } catch (err) {
      console.error("Erreur :", err.message);
      openModal(err.message, true);
    }
  };
  //Fonction pour afficher la liste des aidants disponibles et chaque aidant a un bouton permettant d'afficher ses détails.
const openCaregiversModal = (caregivers) => {
  AntModal.info({
    title: t("Patients:caregivers_list"),
    content: caregivers.length ? (
      <ul>
        {caregivers.filter(c => c).map(c => (
          <li key={c.id}>
            {c.firstname} {c.lastname}
            <Button type="link" onClick={() => viewCaregiverDetails(c)}>
              {t("voir les details")}
            </Button>
          </li>
        ))}
      </ul>
    ) : <p>{t("Aucune aide soignante disponible")}</p>,
    onOk() {},
  });
};

// fonction pour aficher les dteails d'un aidant, en excluant certains attributs, les clés 'active', 'createdAt' et 'updatedAt' sont filtrées.
const viewCaregiverDetails = (caregiver) => {
  const filteredCaregiver = Object.keys(caregiver)
    .filter(key => key !== 'active' && key !== 'createdAt' && key !== 'updatedAt') 
    .map(key => (
      <p key={key}>{t(`Patients:${key}`)}: {caregiver[key]}</p>
    ));

  AntModal.info({
    title: `${caregiver.firstname} ${caregiver.lastname} - ${t("Details de l'aide soignant")}`,
    content: filteredCaregiver,
    onOk() {},
  });
};

  const getStatusColor = (status) => {
    switch (status) {
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
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("Patients:email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Patients:phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Patients:status"),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status) || "grey"}>
          {status ? status.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: t("Patients:programs"),
      dataIndex: "numberOfPrograms",
      key: "numberOfPrograms",
    },
    {
      title: t("Patients:caregivers"),
      key: "caregivers",
      render: (record) => (
        <Button type="link" onClick={() => handleGetCaregivers(record)}>
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
            onClick={() => handleEdit(record)}
            style={{ display: role === "admin" ? "none" : "inline-block" }}
          >
            <EditOutlined /> {t("Patients:edit_button")}
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record)}
            style={{ display: role === "admin" ? "none" : "inline-block" }}
          >
            <DeleteOutlined /> {t("Patients:delete_button")}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
  };

  const showCaregiverWarning = () => {
    AntModal.warning({
      title: "Deletion impossible.",
      content:
        "Please delete the associated caregivers before deleting this patient.",
      okText: "OK",
    });
  };

  const handleDelete = (patient) => {
    AntModal.confirm({
      title: t("Patients:delete_patient_alert"),
      icon: <ExclamationCircleOutlined />,
      content: `${patient.firstname} ${patient.lastname}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        console.log(patient);
        if (patient.numberOfCaregivers === 0) {
          axios
            .delete(`${Constants.SERVER_URL}/delete-patient/${patient.id}`, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
              refetchPatients();
              openModal(res.data.message, false);
            })
            .catch((err) => openModal(err.response.data.message, true));
        } else {
          showCaregiverWarning();
        }
      },
    });
  };

  const openModal = (message, isError) => {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  };

  return (
    <div>
      {/* Affiche le bouton Back et le titre si on est en mode création ou édition */}
      {(isCreatePatient || selectedPatient) && (
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Button
              onClick={() => {
                setIsCreatePatient(false);
                setSelectedPatient(null);
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
                : t("Patients:edit_patient_details")}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {/* Affiche soit la liste des patients soit le formulaire de création ou d'édition */}
      {!isCreatePatient && !selectedPatient && role ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreatePatient(true)}
              style={{ display: role === "admin" ? "none" : "inline-block" }}
            >
              {t("Patients:register_patient")}
            </Button>
          </div>

          <Table columns={columns} dataSource={patientList} rowKey="key" />
        </>
      ) : isCreatePatient ? (
        <CreatePatient
          refetchPatients={refetchPatients}
          onClose={() => setIsCreatePatient(false)}
        />
      ) : (
        <PatientDetails
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          refetchPatients={refetchPatients}
          openModal={openModal}
        />
      )}

      {/* Modal reste inchangé */}
      {isOpenModal && (
        <AntModal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
            </Button>,
          ]}
          style={{
            color: isErrorMessage ? "#ff4d4f" : "#52c41a",
          }}
        >
          <p>{message}</p>
        </AntModal>
      )}
    </div>
  );
}
