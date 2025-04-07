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
  const { t } = useTranslation("Professionals");

  // Pré-remplir le formulaire avec les données du kinésiologue
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
          content: t("Kinesiologist.success_updating_msg"),
          okText: t("Kinesiologist.button_close"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        const errorMessage =
          t(`Backend:${err.response?.data?.message}`) ||
          t("Kinesiologist.error_updating_kinesiologist");
        AntModal.error({
          content: errorMessage,
          okText: t("Kinesiologist.button_close"),
          centered: true,
        });
      });
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            {/* First Name and Last Name fields */}
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.label_first_name")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.error_required_first_name"),
                    minLength: {
                      value: 2,
                      message: t("Kinesiologist.error_first_name_min_length"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.label_last_name")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.error_required_last_name"),
                    minLength: {
                      value: 2,
                      message: t("Kinesiologist.error_last_name_min_length"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Email and Phone Number fields */}
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.label_email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.error_required_email"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("Kinesiologist.error_invalid_email_format"),
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.label_phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.error_required_phone_number"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Kinesiologist.error_invalid_phone_number"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Status field */}
            <Col span={12}>
              <Form.Item label={t("Kinesiologist.label_status")}>
                <Controller
                  name="active"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      checkedChildren={t("Kinesiologist.active_status")}
                      unCheckedChildren={t("Kinesiologist.inactive_status")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("Kinesiologist.button_update_kinesiologist")}
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
