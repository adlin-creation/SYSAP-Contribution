import { SendOutlined, UserAddOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Modal as AntModal,
  DatePicker,
  Select,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function CreatePatient({ refetchPatients, onClose }) {
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

  const addCaregiver = () => {
    if (caregivers.length < 2) {
      setCaregivers([...caregivers, { id: caregivers.length + 1 }]);
    }
  };

  const onSubmit = (data) => {
    const patientData = {
      firstname: data.patientFirstName,
      lastname: data.patientLastName,
      email: data.patientEmail,
      phoneNumber: data.patientPhone,
      birthday: data.birthday?.format("YYYY-MM-DD"),
      otherinfo: data.otherinfo,
      // status: 'active'
    };

    const caregiversData = caregivers
      .map((_cg, index) => ({
        firstname: data[`caregiverFirstName${index + 1}`],
        lastname: data[`caregiverLastName${index + 1}`],
        email: data[`caregiverEmail${index + 1}`],
        phoneNumber: data[`caregiverPhone${index + 1}`],
        relationship: data[`relationship${index + 1}`],
        active: true,
      }))
      .filter((cg) => cg.firstname && cg.lastname);

    const endpoint =
      caregiversData.length > 0
        ? "/create-patient-with-caregivers"
        : "/create-patient";
    const payload =
      caregiversData.length > 0
        ? { patientData, caregivers: caregiversData }
        : patientData;

    axios
      .post(`${Constants.SERVER_URL}${endpoint}`, payload, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        refetchPatients();
        openModal(t("Patients:create_patient_success"), false);
      })
      .catch((err) =>
        openModal(err.response?.data?.error || t("create_patient_failed"), true)
      );
  };

  const openModal = (message, isError) => {
    setMessage(message);
    setIsErrorMessage(isError);
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: "Close",
      centered: true,
      onOk: () => {
        if (!isError) {
          refetchPatients();
          onClose();
        }
        closeModal();
      },
    });
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
          <h2>{t("Patients:patient_informations")}</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:first_name")}
                required
                validateStatus={errors.patientFirstName ? "error" : ""}
                help={errors.patientFirstName?.message}
              >
                <Controller
                  name="patientFirstName"
                  control={control}
                  rules={{
                    required: t("Patients:first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("Patients:first_name_required_info"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Patients:first_name_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:last_name")}
                required
                validateStatus={errors.patientLastName ? "error" : ""}
                help={errors.patientLastName?.message}
              >
                <Controller
                  name="patientLastName"
                  control={control}
                  rules={{
                    required: t("Patients:last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("Patients:last_name_required_info"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Patients:last_name_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:birthday")}>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      placeholder={t("Patients:birthday_select")}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:phone_number")}
                required
                validateStatus={errors.patientPhone ? "error" : ""}
                help={errors.patientPhone?.message}
              >
                <Controller
                  name="patientPhone"
                  control={control}
                  rules={{
                    required: t("Patients:phone_number_required"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Patients:phone_number_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Patients:phone_number_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:email")}
                required
                validateStatus={errors.patientEmail ? "error" : ""}
                help={errors.patientEmail?.message}
              >
                <Controller
                  name="patientEmail"
                  control={control}
                  rules={{
                    required: t("Patients:email_needed"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("email_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("Patients:email_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:email_confirm")}
                required
                validateStatus={errors.confirmPatientEmail ? "error" : ""}
                help={errors.confirmPatientEmail?.message}
              >
                <Controller
                  name="confirmPatientEmail"
                  control={control}
                  rules={{
                    required: t("Patients:email_confirm_required"),
                    validate: (value) =>
                      value === control._formValues.patientEmail ||
                      t("Patients:email_confirm_invalid"),
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("Patients:email_confirm_info")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:additionnal_information")}>
                <Controller
                  name="otherinfo"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder={t("Patients:additionnal_information_input")}
                      rows={4}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <h2>{t("Patients:caregiver_information")}</h2>
          {caregivers.map((caregiver, index) => (
            <div key={caregiver.id}>
              <h3>
                {t("Patients:caregiver")} {index + 1}
              </h3>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={t("Patients:first_name")}
                    validateStatus={
                      errors[`caregiverFirstName${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverFirstName${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverFirstName${index + 1}`}
                      control={control}
                      rules={{
                        required: t("Patients:first_name_required"),
                        minLength: {
                          value: 2,
                          message: t("Patients:first_name_required_info"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("Patients:caregiver_first_name_input")}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={t("Patients:last_name")}
                    validateStatus={
                      errors[`caregiverLastName${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverLastName${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverLastName${index + 1}`}
                      control={control}
                      rules={{
                        required: t("Patients:last_name_required"),
                        minLength: {
                          value: 2,
                          message: t("Patients:last_name_required_info"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("Patients:caregiver_last_name_input")}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={t("Patients:relationship")}
                    validateStatus={
                      errors[`relationship${index + 1}`] ? "error" : ""
                    }
                    help={errors[`relationship${index + 1}`]?.message}
                  >
                    <Controller
                      name={`relationship${index + 1}`}
                      control={control}
                      rules={{
                        required: t("Patients:choice_required"),
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder={t("Patients:relationship_choice")}
                        >
                          <Select.Option value="parent">
                            {t("Patients:relation_parent")}
                          </Select.Option>
                          <Select.Option value="sibling">
                            {t("Patients:relation_sibling")}
                          </Select.Option>
                          <Select.Option value="friend">
                            {t("Patients:relation_friend")}
                          </Select.Option>
                          <Select.Option value="other">
                            {t("Patients:relation_other")}
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
                    label={t("Patients:email")}
                    validateStatus={
                      errors[`caregiverEmail${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverEmail${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverEmail${index + 1}`}
                      control={control}
                      rules={{
                        required: t("Patients:email_needed"),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t("Patients:email_invalid"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="email"
                          {...field}
                          placeholder={t("Patients:caregiver_email_input")}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("Patients:phone_number")}
                    validateStatus={
                      errors[`caregiverPhone${index + 1}`] ? "error" : ""
                    }
                    help={errors[`caregiverPhone${index + 1}`]?.message}
                  >
                    <Controller
                      name={`caregiverPhone${index + 1}`}
                      control={control}
                      rules={{
                        required: t("Patients:phone_number_required"),
                        pattern: {
                          value: /^[0-9+\s-]{8,}$/,
                          message: t("Patients:phone_number_invalid"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("Patients:caregiver_phone_input")}
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
              {t("Patients:caregiver_add")}
            </Button>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("Patients:create_patient")}
            </Button>
          </Form.Item>
        </Form>

        <AntModal
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
        </AntModal>
      </Col>
    </Row>
  );
}

CreatePatient.propTypes = {
  refetchPatients: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreatePatient;
