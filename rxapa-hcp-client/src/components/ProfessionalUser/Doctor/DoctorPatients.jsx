import React from "react";
import { Button, Table, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";

export default function DoctorPatients() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useToken();

  const { data: patients, isLoading, error } = useQuery(["doctorPatients", id], () => {
    return axios
      .get(`${Constants.SERVER_URL}/doctor-patients/${id}`, {
        headers: { Authorization: "Bearer " + token }
      })
      .then((res) => res.data);
  });

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h3>Error loading patients</h3>
        <Button onClick={() => navigate('/doctors')}>Return to Doctors</Button>
      </div>
    );
  }

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
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Program Status',
      dataIndex: 'programStatus',
      key: 'programStatus',
    }
  ];

  return (
    <div>
      <Row align="middle" style={{ marginBottom: '20px' }}>
        <Col span={4}>
          <Button
            onClick={() => navigate('/doctors')}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            Back to Doctors
          </Button>
        </Col>
        <Col span={16} style={{ textAlign: 'center' }}>
          <h2>Doctor's Patients</h2>
        </Col>
        <Col span={4} />
      </Row>

      <Table
        columns={columns}
        dataSource={patients}
        rowKey="id"
        loading={isLoading}
        pagination={{ 
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} patients`
        }}
      />
    </div>
  );
}
