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
import { t } from "i18next";

export default function AdminMenu() {
  const [isCreateAdmin, setIsCreateAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { token } = useToken();

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
      title: t("Professionals:Admins:name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("Professionals:Admins:email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Professionals:Admins:phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Professionals:Admins:status"),
      key: "active",
      dataIndex: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active
            ? t("Professionals:Admins:active_status")
            : t("Professionals:Admins:inactive_status")}
        </Tag>
      ),
    },
    {
      title: t("Professionals:Admins:actions"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined /> {t("Professionals:Admins:edit_button")}
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined /> {t("Professionals:Admins:delete_button")}
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
      title: t("Professionals:Admins:delete_confirm_title"),
      content: t("Professionals:Admins:delete_confirm_content", { name: `${admin.firstname} ${admin.lastname}` }),
      okText: t("Professionals:Admins:yes_button"),
      okType: "danger",
      cancelText: t("Professionals:Admins:no_button"),
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
            openModal(t("Professionals:Admins:delete_success"), false);
          })
          .catch((err) =>
            openModal(
              err.response?.data?.message || t("Professionals:Admins:delete_error"),
              true
            )
          );
      },
    });
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: t("Professionals:Admins:close_button"),
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
          <h3>{t("Professionals:Admins:error_loading")}</h3>
          <Button onClick={() => refetchAdmins()}>{t("Professionals:Admins:retry_button")}</Button>
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
            {t("Professionals:Admins:register_admin_button")}
          </Button>
          {adminList?.length > 0 && (
            <span>
              {t("Professionals:Admins:total_admins")}: {adminList.length}
            </span>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={adminList}
          rowKey="id"
          loading={isLoading}
          locale={{
            emptyText: <Empty description={t("Professionals:Admins:no_admins_found")} />,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("Professionals:Admins:of")} ${total} ${t("Professionals:Admins:admins")}`,
          }}
        />
      </>
    );
  };

  return (
    <div>
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
              {t("Professionals:Admins:back_button")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreateAdmin
                ? t("Professionals:Admins:register_new_admin")
                : t("Professionals:Admins:edit_Admin_title")}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}
      {renderContent()}
    </div>
  );
}
