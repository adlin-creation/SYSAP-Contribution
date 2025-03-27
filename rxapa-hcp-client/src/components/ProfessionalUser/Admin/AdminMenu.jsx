import React, { useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
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
import CreateAdmin from "./CreateAdmin";
import AdminDetails from "./AdminDetails";
import { useTranslation } from "react-i18next";

export default function AdminMenu() {
  const [isCreateAdmin, setIsCreateAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { token } = useToken();
  const { t } = useTranslation("Professionals");
  const adminUrl = `${Constants.SERVER_URL}/professional-users`;
  const {
    data: adminList,
    isLoading,
    error,
    refetch: refetchAdmins,
  } = useQuery(["admins"], () => {
    return axios
      .get(adminUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data.filter((user) => user.role === "admin"));
  });

  const columns = [
    {
      title: t("Admins.name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("Admins.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Admins.phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Admins.status"),
      key: "active",
      dataIndex: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? t("Admins.active_status") : t("Admins.inactive_status")}
        </Tag>
      ),
    },
    {
      title: t("Admins.actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined /> {t("Admins.edit_button")}
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined /> {t("Admins.delete_button")}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsEditMode(true);
  };

  const handleDelete = (admin) => {
    AntModal.confirm({
      title: t("Admins.title_delete_admin_confirmation"),
      content: t("Admins.warning_permanent_delete", {
        firstname: admin.firstname,
        lastname: admin.lastname,
      }),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(
            `${Constants.SERVER_URL}/delete-professional-user/${admin.id}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          )
          .then(() => {
            refetchAdmins();
            openModal("Admin successfully deleted", false);
          })
          .catch((err) =>
            openModal(
              t(`Backend:${err.response?.data?.message}`) ||
                "Error deleting admin",
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
    if (isCreateAdmin) {
      return <CreateAdmin refetchAdmins={refetchAdmins} />;
    }

    if (isEditMode) {
      return (
        <AdminDetails
          admin={selectedAdmin}
          onClose={() => {
            setIsEditMode(false);
            setSelectedAdmin(null);
          }}
          refetchAdmins={refetchAdmins}
          openModal={openModal}
        />
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>{t("Admins.error_loading_admins")}</h3>
          <Button onClick={() => refetchAdmins()}>
            {t("Admins.button_retry")}
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
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateAdmin(true)}
          >
            {t("Admins.register_admin_button")}
          </Button>
          {adminList?.length > 0 && (
            <span>
              {t("Admins.total_admins")}: {adminList.length}
            </span>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={adminList}
          rowKey="id"
          loading={isLoading}
          locale={{
            emptyText: <Empty description="No admins found" />,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("Admins.of")} ${total} ${t(
                "Admins.admins"
              )}`,
          }}
        />
      </>
    );
  };

  return (
    <div>
      {/* Edit/Create admin form header */}
      {(isCreateAdmin || isEditMode) && (
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Button
              onClick={() => {
                setIsCreateAdmin(false);
                setIsEditMode(false);
                setSelectedAdmin(null);
              }}
              type="primary"
              icon={<ArrowLeftOutlined />}
            >
              {t("Admins.back_button")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreateAdmin
                ? t("Admins.register_new_admin")
                : t("Admins.edit_Admin_title")}
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
