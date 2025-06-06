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
  LinkOutlined,
} from "@ant-design/icons";
import {
  Card,
  Descriptions,
  Button,
  Table,
  Space,
  Tag,
  Row,
  Col,
  Modal as AntModal,
} from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import CreatePatient from "./CreatePatient";
import AddCargiver from "./AddCargiver";
import PatientStats from "./PatientStats";
import PatientDetails from "./PatientDetails";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function PatientMenu({ role }) {
  const [viewingPatient, setViewingPatient] = useState(null);
  const { t } = useTranslation("Patients");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatePatient, setIsCreatePatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAddCargiver, setSelectedAddCargiver] = useState(null);

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
    try {
      const response = await axios.get(
        `${Constants.SERVER_URL}/patientDetails/${patient.id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const { caregivers, patientCaregivers, programEnrollements } =
        response.data;
      openCaregiversModal(
        patient,
        caregivers,
        patientCaregivers,
        programEnrollements
      );
    } catch (err) {
      console.error("Erreur :", err.message);
      openModal(t(`Backend:${err.message}`), true);
    }
  };

  const openCaregiversModal = (
    patient,
    caregivers,
    patient_caregivers,
    programEnrollements
  ) => {
    const modal = AntModal.info({
      title: (
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {t("title_caregiver_list")}
        </div>
      ),
      content: caregivers.length ? (
        <Row gutter={[16, 16]}>
          {caregivers
            .filter((c) => c)
            .map((c) => (
              <Col key={c.id} span={8}>
                <Card
                  title={`${c.firstname} ${c.lastname}`}
                  actions={[
                    <Button
                      type="link"
                      icon={<LinkOutlined />}
                      onClick={() =>
                        viewCaregiverDetails(
                          c,
                          patient_caregivers,
                          programEnrollements
                        )
                      }
                    >
                      {t("button_see_details")}
                    </Button>,
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteCaregiver(c.id, patient, modal)}
                    >
                      {t("button_delete")}
                    </Button>,
                  ]}
                >
                  <p>
                    <MailOutlined /> {c.email}
                  </p>
                  <p>
                    <PhoneOutlined /> {c.phoneNumber}
                  </p>
                </Card>
              </Col>
            ))}
        </Row>
      ) : (
        <p>{t("text_no_caregiver_available")}</p>
      ),
      onOk() {},
      width: "80%",
      footer: (_, { OkBtn }) => (
        <>
          {caregivers.length < 2 && (
            <Button
              type="primary"
              onClick={() => {
                modal.destroy();
                handleAddCargiver(patient);
              }}
            >
              {t("button_caregiver_add")}
            </Button>
          )}
          <OkBtn />
        </>
      ),
    });
  };

  const handleAddCargiver = (patient) => {
    setSelectedAddCargiver(patient);
  };

  const deleteCaregiver = (id, patient, modal) => {
    AntModal.confirm({
      title: t("title_confirm_delete"),
      content: t("content_confirm_delete_caregiver"),
      okText: t("button_yes"),
      cancelText: t("button_cancel"),
      onOk: async () => {
        try {
          const { data } = await axios.delete(
            `${Constants.SERVER_URL}/delete-caregiver/${id}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          );
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
      throw new Error(
        t(`Backend:${err.response?.data?.message}`) || t("error_program_load")
      );
    }
  };

  const viewCaregiverDetails = async (
    caregiver,
    patient_caregivers,
    programEnrollements
  ) => {
    const keysToShow = [
      "firstname",
      "lastname",
      "email",
      "phoneNumber",
      "relationship",
    ];

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
      .filter((key) => caregiver[key] !== undefined)
      .map((key) => ({
        key,
        label: t(`Patients:${key}`),
        children: caregiver[key],
      }));

    if (program) {
      items.push({
        key: "program",
        label: t("label_program"),
        children: program.name,
      });
    }

    AntModal.info({
      title: (
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {caregiver.firstname} {caregiver.lastname} -{" "}
          {t("texte_details_caregiver")}
        </div>
      ),
      content: (
        <Descriptions bordered column={1}>
          {items.map((item) => (
            <Descriptions.Item key={item.key} label={item.label}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ),
      onOk() {},
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
      title: t("title_name"),
      key: "name",
      render: (_, record) =>
        `${record.firstname || ""} ${record.lastname || ""}`,
    },
    {
      title: t("title_email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("title_phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("title_status"),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status) || "grey"}>
          {status ? status.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: t("title_programs"),
      dataIndex: "numberOfPrograms",
      key: "numberOfPrograms",
    },
    {
      title: "Caregivers",
      key: "caregivers",
      render: (record) => (
        <Button type="link" onClick={() => handleGetCaregivers(record)}>
          {t("title_caregivers")}
        </Button>
      ),
    },
    {
      title: t("title_actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleView(record)}
            style={{ display: role === "admin" ? "none" : "inline-block" }}
          >
            <EyeOutlined /> {t("button_view_statistic")}
          </Button>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{ display: role === "admin" ? "none" : "inline-block" }}
          >
            <EditOutlined /> {t("button_edit")}
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record)}
            style={{ display: role === "admin" ? "none" : "inline-block" }}
          >
            <DeleteOutlined /> {t("button_delete")}
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
      title: t("title_warning_delete_impossible"),
      content: t("content_warning_delete_caregiver"),
      okText: t("button_ok"),
    });
  };

  const handleDelete = (patient) => {
    AntModal.confirm({
      title: t("title_alert_delete_patient"),
      icon: <ExclamationCircleOutlined />,
      content: `${patient.firstname} ${patient.lastname}`,
      okText: t("button_yes"),
      okType: "danger",
      cancelText: t("button_no"),
      onOk: () => {
        console.log(patient);
        if (patient.numberOfCaregivers === 0) {
          axios
            .delete(`${Constants.SERVER_URL}/delete-patient/${patient.id}`, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
              refetchPatients();
              openModal(t(`Backend:${res.data.message}`), false);
            })
            .catch((err) =>
              openModal(t(`Backend:${err.response.data.message}`), true)
            );
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
      {(isCreatePatient ||
        selectedPatient ||
        viewingPatient ||
        selectedAddCargiver) && (
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
                setViewingPatient(null);
              }}
              type="primary"
              icon={<ArrowLeftOutlined />}
            >
              {t("button_back")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreatePatient
                ? t("title_register_new_patient")
                : selectedPatient
                ? t("title_edit_patient_details")
                : t("title_view_patient_details")}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {!isCreatePatient &&
      !selectedPatient &&
      !viewingPatient &&
      !selectedAddCargiver ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreatePatient(true)}
              style={{ display: role === "admin" ? "none" : "inline-block" }}
            >
              {t("button_register_patient")}
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
        <CreatePatient
          refetchPatients={refetchPatients}
          onClose={() => setIsCreatePatient(false)}
        />
      ) : selectedPatient ? (
        <PatientDetails
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          refetchPatients={refetchPatients}
          openModal={openModal}
        />
      ) : selectedAddCargiver ? (
        <AddCargiver
          patient={selectedAddCargiver}
          refetchPatients={refetchPatients}
          onClose={() => setSelectedAddCargiver(null)}
        />
      ) : (
        <PatientStats
          patient={viewingPatient}
          onClose={() => setViewingPatient(null)}
        />
      )}

      {isOpenModal && (
        <AntModal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              {t("button_close")}
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
PatientMenu.propTypes = {
  role: PropTypes.string.isRequired,
};
