import React, { useEffect } from "react";
import { Row, Col, Input, Button, Form, Switch, Modal as AntModal } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function KinesiologistDetails({
  kinesiologist,
  onClose,
  refetchKinesiologists,
  openModal,
}) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { token } = useToken();
  const { t } = useTranslation();

  useEffect(() => {
    if (kinesiologist) {
      setValue("firstname", kinesiologist.firstname);
      setValue("lastname", kinesiologist.lastname);
      setValue("email", kinesiologist.email);
      setValue("phoneNumber", kinesiologist.phoneNumber);
      setValue("active", kinesiologist.active);
    }
  }, [kinesiologist, setValue]);

  const onSubmit = (data) => {
    const kinesiologistData = {
      ...data,
      role: "kinesiologist",
    };

    axios
      .put(
        `${Constants.SERVER_URL}/update-professional-user/${kinesiologist.id}`,
        kinesiologistData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        refetchKinesiologists();
        AntModal.success({
          content: t("Professionals:Kinesiologist:updating_success_msg"),
          okText: t("Professionals:Kinesiologist:close_button"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || t("Professionals:Kinesiologist:updating_error_msg");
        AntModal.error({
          content: errorMessage,
          okText: t("Professionals:Kinesiologist:close_button"),
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
                label={t("Professionals:Kinesiologist:first_name_label")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("Professionals:Kinesiologist:required_first_name_error"),
                    minLength: {
                      value: 2,
                      message: t("Professionals:Kinesiologist:first_name_min_length_error"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("Professionals:Kinesiologist:last_name_label")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("Professionals:Kinesiologist:required_last_name_error"),
                    minLength: {
                      value: 2,
                      message: t("Professionals:Kinesiologist:last_name_min_length_error"),
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
                label={t("Professionals:Kinesiologist:email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("Professionals:Kinesiologist:required_email_error"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("Professionals:Kinesiologist:invalid_email_format_error"),
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("Professionals:Kinesiologist:phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("Professionals:Kinesiologist:required_phone_number_error"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Professionals:Kinesiologist:invalid_phone_number_error"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Professionals:Kinesiologist:status")}>
                <Controller
                  name="active"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      checkedChildren={t("Professionals:Kinesiologist:active_status")}
                      unCheckedChildren={t("Professionals:Kinesiologist:inactive_status")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("Professionals:Kinesiologist:update_kinesiologist_button")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

KinesiologistDetails.propTypes = {
  kinesiologist: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchKinesiologists: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default KinesiologistDetails;
