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
  const { t } = useTranslation("Patients");
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
          content: t("patient_update_success"),
          okText: t("close_button"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        let errorMessage = t("patient_update_failed");
        if (err.response) {
          if (err.response.data?.message) {
            errorMessage =
              t(`Backend:${err.response.data.message}`) || errorMessage;
          }
        } else if (err.request) {
          errorMessage = t("no_response_from_server");
        } else {
          errorMessage = t("unexpected_error");
        }
        AntModal.error({
          content: errorMessage,
          okText: t("close_button"),
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
                label={t("first_name")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("first_name_required_info"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("last_name")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("last_name_required_info"),
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
                label={t("email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("email_needed"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("email_invalid"),
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("phone_number_required"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("phone_number_invalid"),
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
                label={t("programs_quantity")}
                required
                validateStatus={errors.numberOfPrograms ? "error" : ""}
                help={errors.numberOfPrograms?.message}
              >
                <Controller
                  name="numberOfPrograms"
                  control={control}
                  rules={{
                    required: t("programs_required_quantity"),
                    min: {
                      value: 0,
                      message: t("programs_quantity_invalid"),
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
                label={t("status")}
                required
                validateStatus={errors.status ? "error" : ""}
                help={errors.status?.message}
              >
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: t("status_required") }}
                  render={({ field }) => (
                    <Select {...field}>
                      <Select.Option value="active">
                        {t("active")}
                      </Select.Option>
                      <Select.Option value="paused">
                        {t("paused")}
                      </Select.Option>
                      <Select.Option value="waiting">
                        {t("waiting")}
                      </Select.Option>
                      <Select.Option value="completed">
                        {t("completed")}
                      </Select.Option>
                      <Select.Option value="abort">{t("abort")}</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("patient_update")}
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
