import React, { useEffect } from "react";
import { Row, Col, Input, Button, Form, Modal as AntModal, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function PatientDetails({ patient, onClose, refetchPatients }) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { token } = useToken();

  useEffect(() => {
    if (patient) {
      setValue("firstname", patient.firstname);
      setValue("lastname", patient.lastname);
      setValue("email", patient.email);
      setValue("phoneNumber", patient.phoneNumber);
      setValue("status", patient.status);
      setValue("numberOfPrograms", patient.numberOfPrograms);
    }
  }, [patient, setValue]);

  const onSubmit = (data) => {
    const patientData = {
      ...data,
      role: "patient",
    };

    axios
      .put(
        `${Constants.SERVER_URL}/update-patient/${patient.id}`,
        patientData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        refetchPatients();
        AntModal.success({
          content: t("Patients:patient_update_success"),
          okText: t("Patients:close_button"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || t("Patients:patient_update_failed");
        AntModal.error({
          content: errorMessage,
          okText: t("Patients:close_button"),
          centered: true,
        });
      });
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:first_name")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("Patients:first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("Patients:first_name_required_info"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:last_name")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("Patients:last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("Patients:last_name_required_info"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("Patients:email_needed"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("Patients:email_invalid"),
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("Patients:phone_required"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Patients:phone_number_invalid"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:programs_quantity")}
                required
                validateStatus={errors.numberOfPrograms ? "error" : ""}
                help={errors.numberOfPrograms?.message}
              >
                <Controller
                  name="numberOfPrograms"
                  control={control}
                  rules={{
                    required: t("Patients:programs_required_quantity"),
                    min: {
                      value: 0,
                      message: t("Patients:programs_quantity_invalid"),
                    },
                  }}
                  render={({ field }) => <Input type="number" {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:status")}
                required
                validateStatus={errors.status ? "error" : ""}
                help={errors.status?.message}
              >
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: t("Patients:status_required") }}
                  render={({ field }) => (
                    <Select {...field}>
                      <Select.Option value="active">
                        {t("Patients:status_active")}
                      </Select.Option>
                      <Select.Option value="paused">
                        {t("Patients:status_paused")}
                      </Select.Option>
                      <Select.Option value="waiting">
                        {t("Patients:status_waiting")}
                      </Select.Option>
                      <Select.Option value="completed">
                        {t("Patients:status_completed")}
                      </Select.Option>
                      <Select.Option value="abort">
                        {t("Patients:status_abort")}
                      </Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("Patients:patient_update")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

PatientDetails.propTypes = {
  patient: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchPatients: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default PatientDetails;
