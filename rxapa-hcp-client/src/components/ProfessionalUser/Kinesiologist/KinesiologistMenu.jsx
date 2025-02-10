import React, { useState } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Table, Space, Tag, Row, Col, Modal as AntModal, Empty } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import CreateKinesiologist from "./CreateKinesiologist";
import KinesiologistDetails from "./KinesiologistDetails";
import { useNavigate } from "react-router-dom";

export default function KinesiologistMenu() {
  const [isCreateKinesiologist, setIsCreateKinesiologist] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKinesiologist, setSelectedKinesiologist] = useState(null);
  
  const { token } = useToken();
  const navigate = useNavigate();

  const kinesiologistUrl = `${Constants.SERVER_URL}/professional-users`;
  const { data: kinesiologistList, isLoading, error, refetch: refetchKinesiologists } = useQuery(
    ["kinesiologists"],
    () => {
      return axios
        .get(kinesiologistUrl, {
          headers: { Authorization: "Bearer " + token }
        })
        .then((res) => res.data.filter(user => user.role === 'kinesiologist'));
    }
  );

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Status',
      key: 'active',
      dataIndex: 'active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => navigate(`/kinesiologist-patients/${record.id}`)}
          >
            <UserOutlined /> Patients
          </Button>
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

  const handleEdit = (kinesiologist) => {
    setSelectedKinesiologist(kinesiologist);
    setIsEditMode(true);
  };

  const handleDelete = (kinesiologist) => {
    AntModal.confirm({
      title: 'Are you sure you want to delete this kinesiologist?',
      content: `This will permanently delete ${kinesiologist.firstname} ${kinesiologist.lastname}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .delete(`${Constants.SERVER_URL}/delete-professional-user/${kinesiologist.id}`, {
            headers: { Authorization: "Bearer " + token }
          })
          .then(() => {
            refetchKinesiologists();
            openModal("Kinesiologist successfully deleted", false);
          })
          .catch((err) => openModal(err.response?.data?.message || "Error deleting kinesiologist", true));
      },
    });
  };

  const openModal = (message, isError) => {
    AntModal[isError ? 'error' : 'success']({
      content: message,
      okText: 'Close',
      centered: true,
    });
  };

  const renderContent = () => {
    if (isCreateKinesiologist) {
      return <CreateKinesiologist refetchKinesiologists={refetchKinesiologists} />;
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
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Error loading kinesiologists</h3>
          <Button onClick={() => refetchKinesiologists()}>Retry</Button>
        </div>
      );
    }

    return (
      <>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateKinesiologist(true)}
          >
            Register a Kinesiologist
          </Button>
          {kinesiologistList?.length > 0 && (
            <span>Total Kinesiologists: {kinesiologistList.length}</span>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={kinesiologistList}
          rowKey="id"
          loading={isLoading}
          locale={{
            emptyText: <Empty description="No kinesiologists found" />
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} kinesiologists`
          }}
        />
      </>
    );
  };

  return (
    <div>
      {/* Edit/Create kinesiologist form header */}
      {(isCreateKinesiologist || isEditMode) && (
        <Row align="middle" justify="space-between" style={{ marginBottom: '20px' }}>
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
              Back
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: 0 }}>
              {isCreateKinesiologist ? 'Register a new kinesiologist' : 'Edit kinesiologist'}
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
