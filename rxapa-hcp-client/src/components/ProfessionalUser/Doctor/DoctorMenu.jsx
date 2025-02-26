import React, { useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Table,
  Space,
  Tag,
  Row,
  Col,
  Modal as AntModal,
  Empty,
} from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import CreateDoctor from "./CreateDoctor";
import DoctorDetails from "./DoctorDetails";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DoctorMenu() {
  const { t } = useTranslation();
  const [isCreateDoctor, setIsCreateDoctor] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { token } = useToken();
  const navigate = useNavigate();

  const doctorUrl = `${Constants.SERVER_URL}/professional-users`;
  const {
    data: doctorList,
    isLoading,
    error,
    refetch: refetchDoctors,
  } = useQuery(["doctors"], () => {
    return axios
      .get(doctorUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data.filter((user) => user.role === "doctor"));
  });

  const columns = [
    {
      title: t("Professionals:Doctors:name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("Professionals:Doctors:email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Professionals:Doctors:phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Professionals:Doctors:status"),
      key: "active",
      dataIndex: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active
            ? t("Professionals:Doctors:active_status")
            : t("Professionals:Doctors:inactive_status")}
        </Tag>
      ),
    },
    {
      title: t("Professionals:Doctors:actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/doctor-patients/${record.id}`)}
          >
            <UserOutlined />
            {t("Professionals:Doctors:patients_button")}
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined /> {t("Professionals:Doctors:edit_button")}
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined /> {t("Professionals:Doctors:delete_button")}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditMode(true);
  };

  const handleDelete = (doctor) => {
    AntModal.confirm({
      title: "Are you sure you want to delete this doctor?",
      content: `This will permanently delete ${doctor.firstname} ${doctor.lastname}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(
            `${Constants.SERVER_URL}/delete-professional-user/${doctor.id}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          )
          .then(() => {
            refetchDoctors();
            openModal("Doctor successfully deleted", false);
          })
          .catch((err) =>
            openModal(
              err.response?.data?.message || "Error deleting doctor",
              true
            )
          );
      },
    });
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: "Close",
      centered: true,
    });
  };

  const renderContent = () => {
    if (isCreateDoctor) {
      return <CreateDoctor refetchDoctors={refetchDoctors} />;
    }

    if (isEditMode) {
      return (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={() => {
            setIsEditMode(false);
            setSelectedDoctor(null);
          }}
          refetchDoctors={refetchDoctors}
          openModal={openModal}
        />
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Error loading doctors</h3>
          <Button onClick={() => refetchDoctors()}>Retry</Button>
        </div>
      );
    }

    return (
      <>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateDoctor(true)}
          >
            {t("Professionals:Doctors:register_doctor")}
          </Button>
          {doctorList?.length > 0 && (
            <span>
              {t("Professionals:Doctors:total_doctors")}: {doctorList.length}
            </span>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={doctorList}
          rowKey="id"
          loading={isLoading}
          locale={{
            emptyText: <Empty description="No doctors found" />,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t(
                "Professionals:Doctors:of"
              )} ${total} ${t("Professionals:Doctors:doctors")}`,
          }}
        />
      </>
    );
  };

  return (
    <div>
      {/* Edit/Create doctor form header */}
      {(isCreateDoctor || isEditMode) && (
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Button
              onClick={() => {
                setIsCreateDoctor(false);
                setIsEditMode(false);
                setSelectedDoctor(null);
              }}
              type="primary"
              icon={<ArrowLeftOutlined />}
            >
              {t("Professionals:Doctors:back_button")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreateDoctor
                ? t("Professionals:Doctors:register_doctor_title")
                : t("Professionals:Doctors:edit_doctor")}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {/* Main content */}
      {renderContent()}
    </div>
  );
}
