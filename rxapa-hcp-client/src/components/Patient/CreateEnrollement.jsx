import { SendOutlined, UserAddOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Modal,
  Select,
  DatePicker,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function CreateEnrollement({ refetchPatients }) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { token } = useToken();
  const [caregivers, setCaregivers] = useState([{ id: 1 }]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const { RangePicker } = DatePicker;

  const { data: programList } = useQuery(["programs"], () => {
    return axios
      .get(`${Constants.SERVER_URL}/programs`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data);
  });

  const addCaregiver = () => {
    if (caregivers.length < 2) {
      setCaregivers([...caregivers, { id: caregivers.length + 1 }]);
    }
  };

  const onSubmit = (data) => {
    const formattedData = {
      patientData: {
        firstname: data.patientFirstName,
        lastname: data.patientLastName,
        email: data.patientEmail,
        phoneNumber: data.patientPhone,
        birthday: data.birthday?.format("YYYY-MM-DD"),
        otherinfo: data.otherinfo,
        status: "active",
      },
      caregivers: caregivers
        .map((_cg, index) => ({
          firstname: data[`caregiverFirstName${index + 1}`],
          lastname: data[`caregiverLastName${index + 1}`],
          email: data[`caregiverEmail${index + 1}`],
          phoneNumber: data[`caregiverPhone${index + 1}`],
          relationship: data[`relationship${index + 1}`],
          active: true,
        }))
        .filter((cg) => cg.firstname && cg.lastname),
      enrollmentData: {
        enrollementDate: dayjs().format("YYYY-MM-DD"),
        startDate: data.programDates[0].format("YYYY-MM-DD"),
        endDate: data.programDates[1].format("YYYY-MM-DD"),
        programEnrollementCode: data.programCode,
        ProgramId: data.programId,
      },
    };

    axios
      .post(
        `${Constants.SERVER_URL}/create-complete-enrollment`,
        formattedData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        refetchPatients();
        openModal(t("Patients:enrollment_creation_success"), false);
      })
      .catch((err) =>
        openModal(
          err.response?.data?.error ||
            t("Patients:enrollment_creation_failed"),
          true
        )
      );
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
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <h2>{t("Patients:patient_information_title")}</h2>
          {/* ... toutes les Form.Item comme avant, inchangées ... */}

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("Patients:create_enrollement")}
            </Button>
          </Form.Item>
        </Form>

        <Modal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              {t("Patients:close_button")}
            </Button>,
          ]}
        >
          <p style={{ color: isErrorMessage ? "#ff4d4f" : "#52c41a" }}>
            {message}
          </p>
        </Modal>
      </Col>
    </Row>
  );
}

CreateEnrollement.propTypes = {
  refetchPatients: PropTypes.func.isRequired,
};

export default CreateEnrollement;
