import React from "react";
import { Button, Table, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function KinesiologistPatients() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useToken();
  const { t } = useTranslation("Professionals");

  const {
    data: patients,
    isLoading,
    error,
  } = useQuery(["kinesiologistPatients", id], () => {
    return axios
      .get(`${Constants.SERVER_URL}/kinesiologist-patients/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>{t("Kinesiologist.error_loading_patients")}</h3>
        <Button onClick={() => navigate("/kinesiologists")}>
          {t("Kinesiologist.back_to_kinesiologists_button")}
        </Button>
      </div>
    );
  }

  const columns = [
    {
      title: t("Patients:title_name"),
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: t("Patients:title_email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Patients:title_phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Patients:title_birthday"),
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
            onClick={() => navigate("/kinesiologists")}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            {t("Kinesiologist.button_back_to_kinesiologists")}
          </Button>
        </Col>
        <Col span={16} style={{ textAlign: "center" }}>
          <h2>{t("Kinesiologist.title_kinesiologist_patients")}</h2>
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
