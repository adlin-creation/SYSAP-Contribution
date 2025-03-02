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
  const { t } = useTranslation();
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
          content: t("Professionals:Admins:updating_success_msg"),
          okText: t("Professionals:Admins:close_button"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message ||
          t("Professionals:Admins:updating_admin_error_msg");
        AntModal.error({
          content: errorMessage,
          okText: t("Professionals:Admins:close_button"),
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
                label={t("Professionals:Admins:first_name_label")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: "required_first_name_error",
                    minLength: {
                      value: 2,
                      message: "first_name_min_length_error",
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Admins:last_name_label")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: "required_last_name_error",
                    minLength: {
                      value: 2,
                      message: "last_name_min_length_error",
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
                label={t("Professionals:Admins:email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "L'email est obligatoire",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Format d'email invalide",
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Admins:phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Le numéro de téléphone est obligatoire",
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: "Format de numéro de téléphone invalide",
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
              <Form.Item label={t("Professionals:Admins:status")}>
                <Controller
                  name="active"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      checkedChildren={t("Professionals:Admins:active_status")}
                      unCheckedChildren={t(
                        "Professionals:Admins:inactive_status"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("Professionals:Admins:update_admin_button")}
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
