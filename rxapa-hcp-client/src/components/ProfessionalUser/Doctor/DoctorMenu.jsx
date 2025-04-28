import React, { useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  SearchOutlined,
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
  Input,
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
  const { t } = useTranslation("Professionals");
  const [isCreateDoctor, setIsCreateDoctor] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredDoctors = doctorList?.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.firstname.toLowerCase().includes(searchLower) ||
      doctor.lastname.toLowerCase().includes(searchLower) ||
      doctor.email.toLowerCase().includes(searchLower) ||
      (doctor.phoneNumber && doctor.phoneNumber.includes(searchTerm))
    );
  });

  const columns = [
    {
      title: t("Physicians.title_name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("Physicians.title_email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Physicians.title_phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Physicians.title_status"),
      key: "active",
      dataIndex: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active
            ? t("Physicians.active_status")
            : t("Physicians.inactive_status")}
        </Tag>
      ),
    },
    {
      title: t("Physicians.title_actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/doctor-patients/${record.id}`)}
          >
            <UserOutlined />
            {t("Physicians.button_patients")}
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined /> {t("Physicians.button_edit")}
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
      title: t("Physicians.title_delete_physician_confirmation"),
      content: t("Physicians.content_deletion_message", {
        firstname: doctor.firstname,
        lastname: doctor.lastname,
      }),

      okText: t("Physicians.button_yes"),
      okType: "danger",
      cancelText: t("Physicians.button_no"),
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
            openModal(t("Physicians.success_physician_deletion"), false);
          })
          .catch((err) =>
            openModal(
              t(`Backend:${err.response?.data?.message}`) ||
                t("Physicians.error_physician_deletion"),
              true
            )
          );
      },
    });
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: t("Physicians.button_close"),
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
          <h3>{t("Physicians.error_loading_physicians")}</h3>
          <Button onClick={() => refetchDoctors()}>
            {t("Physicians.button_retry")}
          </Button>
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
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateDoctor(true)}
          >
            {t("Physicians.button_register_physician")}
          </Button>

          <Input
            placeholder={t("Physicians.placeholder_search")}
            prefix={<SearchOutlined />}
            style={{ width: 300, marginTop: 45 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />

          {doctorList?.length > 0 && (
            <span>
              {t("Physicians.span_total_physicians")}:{" "}
              {filteredDoctors?.length || 0} / {doctorList.length}
            </span>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey="id"
          loading={isLoading}
          locale={{
            emptyText: <Empty description="No physicians found" />,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("Physicians.of")} ${total} ${t(
                "Physicians.physicians"
              )}`,
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
              {t("Physicians.button_back")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreateDoctor
                ? t("Physicians.title_register_physician")
                : t("Physicians.title_edit_physician")}
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
