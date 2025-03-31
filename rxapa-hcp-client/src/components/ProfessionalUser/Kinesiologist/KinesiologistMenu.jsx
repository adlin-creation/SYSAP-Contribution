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
import CreateKinesiologist from "./CreateKinesiologist";
import KinesiologistDetails from "./KinesiologistDetails";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function KinesiologistMenu() {
  const { t } = useTranslation();
  const [isCreateKinesiologist, setIsCreateKinesiologist] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKinesiologist, setSelectedKinesiologist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useToken();
  const navigate = useNavigate();

  const kinesiologistUrl = `${Constants.SERVER_URL}/professional-users`;
  const {
    //liste kine a mainupeler pour le filtrage
    data: kinesiologistList,
    isLoading,
    error,
    refetch: refetchKinesiologists,
  } = useQuery(["kinesiologists"], () => {
    return axios
      .get(kinesiologistUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data.filter((user) => user.role === "kinesiologist"));
  });
  const filteredKinesiologist = kinesiologistList?.filter((kinesiologist) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      kinesiologist.firstname.toLowerCase().includes(searchLower) ||
      kinesiologist.lastname.toLowerCase().includes(searchLower) ||
      kinesiologist.email.toLowerCase().includes(searchLower) ||
      (kinesiologist.phoneNumber &&
        kinesiologist.phoneNumber.includes(searchTerm))
    );
  });
  const columns = [
    {
      title: t("Professionals:Kinesiologist:name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("Professionals:Kinesiologist:email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Professionals:Kinesiologist:phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Professionals:Kinesiologist:status"),
      key: "active",
      dataIndex: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active
            ? t("Professionals:Kinesiologist:active_status")
            : t("Professionals:Kinesiologist:inactive_status")}
        </Tag>
      ),
    },
    {
      title: t("Professionals:Kinesiologist:actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/kinesiologist-patients/${record.id}`)}
          >
            <UserOutlined /> {t("Professionals:Kinesiologist:patients_button")}
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined /> {t("Professionals:Kinesiologist:edit_button")}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (kinesiologist) => {
    setSelectedKinesiologist(kinesiologist);
    setIsEditMode(true);
  };

  const handleDelete = (kinesiologist) => {
    AntModal.confirm({
      title: "Are you sure you want to delete this kinesiologist?",
      content: `This will permanently delete ${kinesiologist.firstname} ${kinesiologist.lastname}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(
            `${Constants.SERVER_URL}/delete-professional-user/${kinesiologist.id}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          )
          .then(() => {
            refetchKinesiologists();
            openModal("Kinesiologist successfully deleted", false);
          })
          .catch((err) =>
            openModal(
              err.response?.data?.message || "Error deleting kinesiologist",
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
    if (isCreateKinesiologist) {
      return (
        <CreateKinesiologist refetchKinesiologists={refetchKinesiologists} />
      );
    }

    if (isEditMode) {
      return (
        <KinesiologistDetails
          kinesiologist={selectedKinesiologist}
          onClose={() => {
            setIsEditMode(false);
            setSelectedKinesiologist(null);
          }}
          refetchKinesiologists={refetchKinesiologists}
          openModal={openModal}
        />
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Error loading kinesiologists</h3>
          <Button onClick={() => refetchKinesiologists()}>Retry</Button>
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
            onClick={() => setIsCreateKinesiologist(true)}
          >
            {t("Professionals:Kinesiologist:register_kenisiologist_button")}
          </Button>

          <Input
            placeholder={t("Professionals:Kinesiologist:search_placeholder")}
            prefix={<SearchOutlined />}
            style={{ width: 300, marginTop: 45 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />

          {kinesiologistList?.length > 0 && (
            <span>
              {t("Professionals:Kinesiologist:total_kinesiologists")}:{" "}
              {filteredKinesiologist?.length || 0} / {kinesiologistList.length}
            </span>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={filteredKinesiologist}
          rowKey="id"
          loading={isLoading}
          locale={{
            emptyText: <Empty description="No kinesiologists found" />,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t(
                "Professionals:Kinesiologist:of"
              )} ${total} ${t("Professionals:Kinesiologist:kinesiologists")}`,
          }}
        />
      </>
    );
  };

  return (
    <div>
      {/* Edit/Create kinesiologist form header */}
      {(isCreateKinesiologist || isEditMode) && (
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Button
              onClick={() => {
                setIsCreateKinesiologist(false);
                setIsEditMode(false);
                setSelectedKinesiologist(null);
              }}
              type="primary"
              icon={<ArrowLeftOutlined />}
            >
              {t("Professionals:Kinesiologist:back_button")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreateKinesiologist
                ? t("Professionals:Kinesiologist:register_new_kinesiologist")
                : t("Professionals:Kinesiologist:edit_kinesiologist")}
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
