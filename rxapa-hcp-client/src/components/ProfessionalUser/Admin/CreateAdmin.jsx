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
import { t } from "i18next";

function CreateAdmin({ refetchAdmins }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { token } = useToken();

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
        openModal(t("Professionals:Admins:creating_success_msg"), false);
      })
      .catch((err) =>
        openModal(
          err.response?.data?.message ||
            t("Professionals:Admins:creating_error_msg"),
          true
        )
      );
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: t("Professionals:Admins:close_button"),
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
      openModal(t("Professionals:Admins:generating_password_error_msg"), true);
    }
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
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
                    required: t(
                      "Professionals:Admins:required_first_name_error"
                    ),
                    minLength: {
                      value: 2,
                      message: t(
                        "Professionals:Admins:first_name_min_length_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Admins:enter_first_name_placeholder"
                      )}
                    />
                  )}
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
                    required: t(
                      "Professionals:Admins:required_last_name_error"
                    ),
                    minLength: {
                      value: 2,
                      message: t(
                        "Professionals:Admins:last_name_min_length_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Professionals:Admins:enter_last_name")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                    required: t("Professionals:Admins:required_email_error"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t(
                        "Professionals:Admins:invalid_email_format_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Admins:enter_email_placeholder"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Admins:confirm_email_label")}
                required
                validateStatus={errors.confirmEmail ? "error" : ""}
                help={errors.confirmEmail?.message}
              >
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{
                    required: t(
                      "Professionals:Admins:required_email_confirmation_error"
                    ),
                    validate: (value) =>
                      value === control._formValues.email ||
                      t("Professionals:Admins:email_mismatch_error"),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Admins:confirm_email_placeholder"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                    required: t(
                      "Professionals:Admins:required_phone_number_error"
                    ),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t(
                        "Professionals:Admins:invalid_phone_number_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Admins:phone_number_placeholder"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Admins:password_label")}
                required
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Input.Group compact>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: t(
                        "Professionals:Admins:required_password_error"
                      ),
                      minLength: {
                        value: 8,
                        message: t(
                          "Professionals:Admins:password_min_length_error"
                        ),
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: t(
                          "Professionals:Admins:password_requirements_error"
                        ),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input.Password
                          {...field}
                          placeholder={t(
                            "Professionals:Admins:password_placeholder"
                          )}
                          style={{ width: "calc(100% - 40px)" }}
                        />
                        <Tooltip title={t(
                          "Professionals:Admins:password_requirements_error"
                        )}>
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
              {t("Professionals:Admins:create_admin_button")}
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
