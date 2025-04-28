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
  const { t } = useTranslation("Patients");
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
        status: "ACTIVE",
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
        openModal(t("succes_enrollment_creation"), false);
      })
      .catch((err) =>
        openModal(
          t(`Backend:${err.response?.data?.error}`) ||
            t("error_enrollment_creation"),
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
          <h2>{t("title_patient_information")}</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_first_name")}
                required
                validateStatus={errors.patientFirstName ? "error" : ""}
                help={errors.patientFirstName?.message}
              >
                <Controller
                  name="patientFirstName"
                  control={control}
                  rules={{
                    required: t("error_first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("error_first_name_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("placeholder_first_name")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_last_name")}
                required
                validateStatus={errors.patientLastName ? "error" : ""}
                help={errors.patientLastName?.message}
              >
                <Controller
                  name="patientLastName"
                  control={control}
                  rules={{
                    required: t("error_last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("error_last_name_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("placeholder_last_name")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("label_birthday")}>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      placeholder={t("placeholder_birthday")}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_phone_number")}
                required
                validateStatus={errors.patientPhone ? "error" : ""}
                help={errors.patientPhone?.message}
              >
                <Controller
                  name="patientPhone"
                  control={control}
                  rules={{
                    required: t("error_phone_number_required"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("error_phone_number_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("placeholder_caregiver_phone")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_email")}
                required
                validateStatus={errors.patientEmail ? "error" : ""}
                help={errors.patientEmail?.message}
              >
                <Controller
                  name="patientEmail"
                  control={control}
                  rules={{
                    required: t("error_email_required"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("error_email_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("placeholder_email")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_confirm_email")}
                required
                validateStatus={errors.confirmPatientEmail ? "error" : ""}
                help={errors.confirmPatientEmail?.message}
              >
                <Controller
                  name="confirmPatientEmail"
                  control={control}
                  rules={{
                    required: t("error_confirm_email_required"),
                    validate: (value) =>
                      value === control._formValues.patientEmail ||
                      t("error_confirm_email_invalid"),
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("placeholder_confirm_email")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("label_additionnal_information")}>
                <Controller
                  name="otherinfo"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder={t("placeholder_additionnal_information")}
                      rows={4}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <h2>{t("title_caregiver_information")}</h2>
          {caregivers.map((caregiver, index) => (
            <div key={caregiver.id}>
              <h3>
                {t("label_caregiver")} {index + 1}
              </h3>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={t("label_first_name")}
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
                        required: t("error_first_name_required"),
                        minLength: {
                          value: 2,
                          message: t("error_first_name_min_length"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("placeholder_caregiver_first_name")}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={t("label_last_name")}
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
                        required: t("error_last_name_required"),
                        minLength: {
                          value: 2,
                          message: t("error_last_name_min_length"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("placeholder_caregiver_last_name")}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={t("relationship")}>
                    <Controller
                      name={`relationship${index + 1}`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder={t("placeholder_relationship")}
                        >
                          <Select.Option value="parent">
                            {t("option_parent")}
                          </Select.Option>
                          <Select.Option value="sibling">
                            {t("option_sibling")}
                          </Select.Option>
                          <Select.Option value="friend">
                            {t("option_friend")}
                          </Select.Option>
                          <Select.Option value="other">
                            {t("option_other")}
                          </Select.Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={t("label_email")}
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
                        required: t("error_email_required"),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t("email_invalid"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="email"
                          {...field}
                          placeholder={t("placeholder_caregiver_email")}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("label_phone_number")}
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
                        required: t("error_phone_number_required"),
                        pattern: {
                          value: /^[0-9+\s-]{8,}$/,
                          message: t("error_phone_number_invalid"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("placeholder_caregiver_phone")}
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
              {t("button_caregiver_add")}
            </Button>
          )}

          <h2>{t("title_program_enrollment")}</h2>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={t("label_program_select")}
                required
                validateStatus={errors.programId ? "error" : ""}
                help={errors.programId?.message}
              >
                <Controller
                  name="programId"
                  control={control}
                  rules={{
                    required: t("error_program_selection_required"),
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder={t("placeholder_program_selection")}
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
                label={t("label_program_code")}
                required
                validateStatus={errors.programCode ? "error" : ""}
                help={errors.programCode?.message}
              >
                <Controller
                  name="programCode"
                  control={control}
                  rules={{
                    required: t("error_program_code_required"),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("placeholder_program_code")}
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label={t("label_program_duration")}
                required
                validateStatus={errors.programDates ? "error" : ""}
                help={errors.programDates?.message}
              >
                <Controller
                  name="programDates"
                  control={control}
                  rules={{
                    required: t("error_program_duration_required"),
                  }}
                  render={({ field }) => (
                    <RangePicker
                      {...field}
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      placeholder={[
                        t("placeholder_date_start"),
                        t("placeholder_date_end"),
                      ]}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("button_create_enrollement")}
            </Button>
          </Form.Item>
        </Form>

        <Modal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              {t("button_close")}
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
