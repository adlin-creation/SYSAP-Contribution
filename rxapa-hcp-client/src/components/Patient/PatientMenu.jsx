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
import { Card, Descriptions, Button, Table, Space, Tag, Row, Col, Modal as AntModal } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import CreatePatient from "./CreatePatient";
import PatientViewPage from "./PatientViewPage";
import PatientDetails from "./PatientDetails";
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next";


export default function PatientMenu({ role }) {
  const [viewingPatient, setViewingPatient] = useState(null);
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


  // Fonction principale pour gérer la recuperation en cascade jusqu'aux aides soignants
  const handleGetCaregivers = async (patient) => {
    console.log(patient);
    try {

      const response = await axios.get(`${Constants.SERVER_URL}/patientDetails/${patient.id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const { caregivers, patientCaregivers, programEnrollements } = response.data;
      openCaregiversModal(patient, caregivers, patientCaregivers, programEnrollements);
    } catch (err) {
      console.error("Erreur :", err.message);
      openModal(err.message, true);
    }
  };

  const openCaregiversModal = (patient, caregivers, patient_caregivers, programEnrollements) => {

    const modal = AntModal.info({
      title: (
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          Liste des soignants
        </div>
      ), content: caregivers.length ? (
        <Row gutter={[16, 16]}>
          {caregivers.filter(c => c).map(c => (
            <Col key={c.id} span={8}>
              <Card
                title={`${c.firstname} ${c.lastname}`}
                actions={[
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    onClick={() => viewCaregiverDetails(c, patient_caregivers, programEnrollements)}
                  >
                    {t("voir les details")}
                  </Button>,
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteCaregiver(c.id, patient, modal)}
                  >
                    {t("Supprimer")}
                  </Button>,

                ]}
              >
                <p><MailOutlined /> {c.email}</p>
                <p><PhoneOutlined /> {c.phoneNumber}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : <p>{t("Aucune aide soignante disponible")}</p>,
      onOk() { },
      width: "80%",
    });
  };

  const deleteCaregiver = (id, patient, modal) => {
    AntModal.confirm({
      title: "Confirmer la suppression",
      content: "Êtes-vous sûr de vouloir supprimer ce soignant ?",
      okText: "Oui",
      cancelText: "Annuler",
      onOk: async () => {

        try {
          const { data } = await axios.delete(`${Constants.SERVER_URL}/delete-caregiver/${id}`, {
            headers: { Authorization: "Bearer " + token },
          });
          console.log(data);
          modal.destroy();
          refetchPatients();
          handleGetCaregivers(patient);
        } catch (err) {
          console.log("Erreur lors de la suppression de l'aide soignant ");
        }
      },
    });
  };

  const fetchProgram = async (ProgramEnrollement) => {
    try {
      const { data } = await axios.get(`${Constants.SERVER_URL}/programs`, {
        headers: { Authorization: "Bearer " + token },
      });
      return data.find((prog) => prog.id === ProgramEnrollement.ProgramId);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Erreur lors de la récupération des programmes.");
    }
  };

  const viewCaregiverDetails = async (caregiver, patient_caregivers, programEnrollements) => {
    const keysToShow = ['firstname', 'lastname', 'email', 'phoneNumber', 'relationship'];

    const patient_caregiver = patient_caregivers.find(
      (p_c) => p_c.CaregiverId === caregiver.id
    );

    let program = null;
    if (patient_caregiver) {
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
        children: caregiver[key],
      }));

    if (program) {
      items.push({
        key: "program",
        label: t("Patients:program"),
        children: program.name,
      });
    }

    AntModal.info({
      title: (
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {caregiver.firstname} {caregiver.lastname} - Détails de l'aide soignant
        </div>
      ), content: (
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
      render: (_, record) => `${record.firstname || ''} ${record.lastname || ''}`,
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
      title: "Caregivers",
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
          <Button type="link" onClick={() => handleView(record)}
            style={{ display: role === 'admin' ? 'none' : 'inline-block' }}>
            <EyeOutlined /> {t("Patients:view_statistic_button")}
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}
            style={{ display: role === 'admin' ? 'none' : 'inline-block' }}
          >
            <EditOutlined /> {t("Patients:edit_button")}
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}
            style={{ display: role === 'admin' ? 'none' : 'inline-block' }}
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
  const handleView = (patient) => {
    setViewingPatient(patient);
  };

  const showCaregiverWarning = () => {
    AntModal.warning({
      title: "Deletion impossible.",
      content: "Please delete the associated caregivers before deleting this patient.",
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
            .catch((err) => openModal(err.response?.data?.message, true));

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


      {!isCreatePatient && !selectedPatient && !viewingPatient ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreatePatient(true)}
              style={{ display: role === 'admin' ? 'none' : 'inline-block' }}
            >
              {t("Patients:register_patient")}
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={patientList}
            rowKey={(record) => record.id || Math.random().toString()}
            loading={!patientList}
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
      ) : (
        <PatientViewPage patient={viewingPatient} onClose={() => setViewingPatient(null)} />
      )}

      {isOpenModal && (
        <AntModal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
            </Button>,
          ]}
          style={{ color: isErrorMessage ? "#ff4d4f" : "#52c41a" }}
        >
          <p>{message}</p>
        </AntModal>
      )}

    </div>
  );
}