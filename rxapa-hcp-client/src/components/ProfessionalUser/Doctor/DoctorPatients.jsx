import React from "react";
import { Button, Table, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function DoctorPatients() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useToken();
  const { t } = useTranslation();

  const {
    data: patients,
    isLoading,
    error,
  } = useQuery(["doctorPatients", id], () => {
    return axios
      .get(`${Constants.SERVER_URL}/doctor-patients/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>Error loading patients</h3>
        <Button onClick={() => navigate("/doctors")}>Return to Doctors</Button>
      </div>
    );
  }

  const columns = [
    {
      title: t("Patients:name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
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
      title: t("Patients:birthday"),
      dataIndex: "birthDate",
      key: "birthDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("Patients:program_status"),
      dataIndex: "programStatus",
      key: "programStatus",
    },
  ];

  return (
    <div>
      <Row align="middle" style={{ marginBottom: "20px" }}>
        <Col span={4}>
          <Button
            onClick={() => navigate("/doctors")}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            {t("Professionals:Physicians:back_to_physicians_button")}
          </Button>
        </Col>
        <Col span={16} style={{ textAlign: "center" }}>
          <h2> {t("Professionals:Physicians:physician_patients_title")}</h2>
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
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} patients`,
        }}
      />
    </div>
  );
}
