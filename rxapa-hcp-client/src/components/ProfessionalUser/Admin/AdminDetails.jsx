import React, { useEffect } from "react";
import { Row, Col, Input, Button, Form, Switch, Modal as AntModal } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function AdminDetails({ admin, onClose, refetchAdmins, openModal }) {
  const { t } = useTranslation("Professionals");
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { token } = useToken();

  // Pré-remplir le formulaire avec les données de l'administrateur
  useEffect(() => {
    if (admin) {
      setValue("firstname", admin.firstname);
      setValue("lastname", admin.lastname);
      setValue("email", admin.email);
      setValue("phoneNumber", admin.phoneNumber);
      setValue("active", admin.active);
    }
  }, [admin, setValue]);

  const onSubmit = (data) => {
    const adminData = {
      ...data,
      role: "admin",
    };

    axios
      .put(
        `${Constants.SERVER_URL}/update-professional-user/${admin.id}`,
        adminData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        refetchAdmins();
        AntModal.success({
          content: t("Admins.success_updating_msg"),
          okText: t("Admins.button_close"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        const errorMessage =
          t(`Backend:${err.response?.data?.message}`) ||
          t("Admins.error_updating_admin");
        AntModal.error({
          content: errorMessage,
          okText: t("Admins.button_close"),
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
                label={t("Admins.label_first_name")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("Admins.error_required_first_name"),
                    minLength: {
                      value: 2,
                      message: t("Admins.error_first_name_min_length"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Admins.label_last_name")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("Admins.error_required_last_name"),
                    minLength: {
                      value: 2,
                      message: t("Admins.error_last_name_min_length"),
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
                label={t("Admins.label_email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("Admins.error_required_email"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("Admins.error_invalid_email_format"),
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Admins.label_phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("Admins.error_required_phone_number"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Admins.error_invalid_phone_number"),
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
              <Form.Item label={t("Admins.label_status")}>
                <Controller
                  name="active"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      checkedChildren={t("Admins.active_status")}
                      unCheckedChildren={t("Admins.inactive_status")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("Admins.button_update_admin")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

AdminDetails.propTypes = {
  admin: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchAdmins: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default AdminDetails;
