import React, { useEffect } from "react";
import { Row, Col, Input, Button, Form, Switch, Modal as AntModal } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function DoctorDetails({ doctor, onClose, refetchDoctors, openModal }) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { token } = useToken();

  useEffect(() => {
    if (doctor) {
      setValue("firstname", doctor.firstname);
      setValue("lastname", doctor.lastname);
      setValue("email", doctor.email);
      setValue("phoneNumber", doctor.phoneNumber);
      setValue("active", doctor.active);
    }
  }, [doctor, setValue]);

  const onSubmit = (data) => {
    const doctorData = {
      ...data,
      role: "doctor",
    };

    axios
      .put(`${Constants.SERVER_URL}/update-professional-user/${doctor.id}`, doctorData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        refetchDoctors();
        AntModal.success({
          content: t("Professionals:Physicians:updating_success_msg"),
          okText: t("Professionals:Physicians:close_button"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || t("Professionals:Physicians:updating_error_msg");
        AntModal.error({
          content: errorMessage,
          okText: t("Professionals:Physicians:close_button"),
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
                label={t("Professionals:Physicians:first_name_label")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("Professionals:Physicians:required_first_name_error"),
                    minLength: {
                      value: 2,
                      message: t("Professionals:Physicians:first_name_min_length_error"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Physicians:last_name_label")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("Professionals:Physicians:required_last_name_error"),
                    minLength: {
                      value: 2,
                      message: t("Professionals:Physicians:last_name_min_length_error"),
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
                label={t("Professionals:Physicians:email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("Professionals:Physicians:required_email_error"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("Professionals:Physicians:invalid_email_format_error"),
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Physicians:phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("Professionals:Physicians:required_phone_number_error"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Professionals:Physicians:invalid_phone_number_error"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Professionals:Physicians:status")}>
                <Controller
                  name="active"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      checkedChildren={t("Professionals:Physicians:active_status")}
                      unCheckedChildren={t("Professionals:Physicians:inactive_status")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("Professionals:Physicians:update_physician_button")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

DoctorDetails.propTypes = {
  doctor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchDoctors: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default DoctorDetails;
