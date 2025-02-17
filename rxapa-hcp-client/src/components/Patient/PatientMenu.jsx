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

export default function PatientMenu() {
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
    () => {
      return axios
        .get(patientUrl, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data);
    }
  );

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
      title: t("name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("status"),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status) || "grey"}>
          {status ? status.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: t("programs"),
      dataIndex: "numberOfPrograms",
      key: "numberOfPrograms",
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined /> Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
  };

  const handleDelete = (patient) => {
    AntModal.confirm({
      title: "Are you sure you want to delete this patient?",
      icon: <ExclamationCircleOutlined />,
      content: `${patient.firstname} ${patient.lastname}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        axios
          .delete(`${Constants.SERVER_URL}/delete-patient/${patient.id}`, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            refetchPatients();
            openModal(res.data.message, false);
          })
          .catch((err) => openModal(err.response.data.message, true));
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
              Back
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreatePatient
                ? "Register a new patient"
                : "Edit patient details"}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {/* Affiche soit la liste des patients soit le formulaire de création ou d'édition */}
      {!isCreatePatient && !selectedPatient ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreatePatient(true)}
            >
              Register a Patient
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
