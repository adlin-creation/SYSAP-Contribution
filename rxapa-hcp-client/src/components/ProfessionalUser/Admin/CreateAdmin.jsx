import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Modal as AntModal,
  Tooltip,
} from "antd";
import { SendOutlined, KeyOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import PropTypes from "prop-types";
import "./Styles.css";
import { useTranslation } from "react-i18next";

function CreateAdmin({ refetchAdmins }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { token } = useToken();
  const { t } = useTranslation("Professionals");

  const onSubmit = (data) => {
    const adminData = {
      ...data,
      role: "admin",
      active: true,
    };

    axios
      .post(`${Constants.SERVER_URL}/create-professional-user`, adminData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        refetchAdmins();
        openModal(t("Admins.success_creating_admin"), false);
      })
      .catch((err) =>
        openModal(
          t(`Backend:${err.response?.data?.message}`) ||
            t("Admins.error_creating_admin"),
          true
        )
      );
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: t("Admins.button_close"),
      centered: true,
      onOk: () => {
        if (!isError) {
          reset();
        }
      },
    });
  };

  const generatePassword = async () => {
    try {
      const response = await axios.get(
        `${Constants.SERVER_URL}/generate-password`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const generatedPassword = response.data.password;
      // Met à jour le champ password avec le mot de passe généré
      reset({ ...control._formValues, password: generatedPassword });
    } catch (err) {
      openModal(t("Admins.error_generating_password"), true);
    }
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Admins.placeholder_first_name")}
                    />
                  )}
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Admins.placeholder_last_name")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Admins.placeholder_email")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Admins.label_confirm_email")}
                required
                validateStatus={errors.confirmEmail ? "error" : ""}
                help={errors.confirmEmail?.message}
              >
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{
                    required: t("Admins.error_required_email_confirmation"),
                    validate: (value) =>
                      value === control._formValues.email ||
                      t("Admins.error_email_mismatch"),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Admins.placeholder_confirm_email")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Admins.placeholder_phone_number")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Admins.label_password")}
                required
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Input.Group compact>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: t("Admins.error_required_password"),
                      minLength: {
                        value: 8,
                        message: t("Admins.error_password_min_length"),
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: t("Admins.error_password_requirements"),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input.Password
                          {...field}
                          placeholder={t("Admins.placeholder_password")}
                          style={{ width: "calc(100% - 40px)" }}
                        />
                        <Tooltip
                          title={t("Admins.title_generate_password_tooltip")}
                        >
                          <Button
                            icon={<KeyOutlined />}
                            onClick={generatePassword}
                          />
                        </Tooltip>
                      </>
                    )}
                  />
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="submit-button">
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("Admins.button_create_admin")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

CreateAdmin.propTypes = {
  refetchAdmins: PropTypes.func.isRequired,
};

export default CreateAdmin;
