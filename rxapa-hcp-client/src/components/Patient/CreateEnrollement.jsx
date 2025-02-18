import { SendOutlined, UserAddOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Row, Col, Input, Button, Form, Modal, Select, DatePicker } from "antd";
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

  // Récupération de la liste des programmes
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
      .then((res) => {
        refetchPatients(); // Rafraîchir la liste des patients
        openModal(t("Patients:enrollment_creation_success"), false);
      })
      .catch((err) =>
        openModal(
          err.response?.data?.error || t("Patients:enrollment_creation_failed"),
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
          <h2>{t("Patient:patient_information_title")}</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                required
                validateStatus={errors.patientFirstName ? "error" : ""}
                help={errors.patientFirstName?.message}
              >
                <Controller
                  name="patientFirstName"
                  control={control}
                  rules={{
                    required: "Le prénom est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Le prénom doit contenir au moins 2 caractères",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter patient's first name"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                required
                validateStatus={errors.patientLastName ? "error" : ""}
                help={errors.patientLastName?.message}
              >
                <Controller
                  name="patientLastName"
                  control={control}
                  rules={{
                    required: "Le nom est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Le nom doit contenir au moins 2 caractères",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter patient's last name" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Birthday">
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      placeholder="Select birth date"
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone"
                required
                validateStatus={errors.patientPhone ? "error" : ""}
                help={errors.patientPhone?.message}
              >
                <Controller
                  name="patientPhone"
                  control={control}
                  rules={{
                    required: "Le numéro de téléphone est obligatoire",
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: "Format de numéro de téléphone invalide",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter phone number" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                required
                validateStatus={errors.patientEmail ? "error" : ""}
                help={errors.patientEmail?.message}
              >
                <Controller
                  name="patientEmail"
                  control={control}
                  rules={{
                    required: "L'email est obligatoire",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Format d'email invalide",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder="Enter email address"
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Email"
                required
                validateStatus={errors.confirmPatientEmail ? "error" : ""}
                help={errors.confirmPatientEmail?.message}
              >
                <Controller
                  name="confirmPatientEmail"
                  control={control}
                  rules={{
                    required: "La confirmation de l'email est obligatoire",
                    validate: (value) =>
                      value === control._formValues.patientEmail ||
                      "Les emails ne correspondent pas",
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder="Confirm email address"
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Additional Information">
                <Controller
                  name="otherinfo"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder="Enter any additional information"
                      rows={4}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <h2>Caregivers Information</h2>
          {caregivers.map((caregiver, index) => (
            <div key={caregiver.id}>
              <h3>Caregiver {index + 1}</h3>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="First Name"
                    required
                    validateStatus={
                      errors[`caregiverFirstName${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverFirstName${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverFirstName${index + 1}`}
                      control={control}
                      rules={{
                        required: "Le prénom est obligatoire",
                        minLength: {
                          value: 2,
                          message:
                            "Le prénom doit contenir au moins 2 caractères",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter caregiver's first name"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Last Name"
                    required
                    validateStatus={
                      errors[`caregiverLastName${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverLastName${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverLastName${index + 1}`}
                      control={control}
                      rules={{
                        required: "Le nom est obligatoire",
                        minLength: {
                          value: 2,
                          message: "Le nom doit contenir au moins 2 caractères",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter caregiver's last name"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Relationship">
                    <Controller
                      name={`relationship${index + 1}`}
                      control={control}
                      render={({ field }) => (
                        <Select {...field} placeholder="Select relationship">
                          <Select.Option value="parent">Parent</Select.Option>
                          <Select.Option value="sibling">Sibling</Select.Option>
                          <Select.Option value="friend">Friend</Select.Option>
                          <Select.Option value="other">Other</Select.Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    required
                    validateStatus={
                      errors[`caregiverEmail${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverEmail${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverEmail${index + 1}`}
                      control={control}
                      rules={{
                        required: "L'email est obligatoire",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Format d'email invalide",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="email"
                          {...field}
                          placeholder="Enter caregiver's email"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Phone"
                    required
                    validateStatus={
                      errors[`caregiverPhone${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverPhone${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverPhone${index + 1}`}
                      control={control}
                      rules={{
                        required: "Le numéro de téléphone est obligatoire",
                        pattern: {
                          value: /^[0-9+\s-]{8,}$/,
                          message: "Format de numéro de téléphone invalide",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter caregiver's phone"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}

          {caregivers.length < 2 && (
            <Button
              type="dashed"
              onClick={addCaregiver}
              icon={<UserAddOutlined />}
              style={{ marginBottom: 24 }}
            >
              Add Caregiver
            </Button>
          )}

          <h2>Program Enrollment</h2>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Select Program"
                required
                validateStatus={errors.programId ? "error" : ""}
                help={errors.programId?.message}
              >
                <Controller
                  name="programId"
                  control={control}
                  rules={{
                    required: "La sélection du programme est obligatoire",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select a program"
                      style={{ width: "100%" }}
                    >
                      {programList?.map((program) => (
                        <Select.Option key={program.id} value={program.id}>
                          {program.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Program Code"
                required
                validateStatus={errors.programCode ? "error" : ""}
                help={errors.programCode?.message}
              >
                <Controller
                  name="programCode"
                  control={control}
                  rules={{ required: "Le code du programme est obligatoire" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter program code" />
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Program Duration"
                required
                validateStatus={errors.programDates ? "error" : ""}
                help={errors.programDates?.message}
              >
                <Controller
                  name="programDates"
                  control={control}
                  rules={{ required: "La durée du programme est obligatoire" }}
                  render={({ field }) => (
                    <RangePicker
                      {...field}
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      placeholder={["Start Date", "End Date"]}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              Create Enrollment
            </Button>
          </Form.Item>
        </Form>

        <Modal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
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
