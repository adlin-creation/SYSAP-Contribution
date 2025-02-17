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
import { useTranslation } from "react-i18next";

function CreateKinesiologist({ refetchKinesiologists }) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { token } = useToken();

  const onSubmit = (data) => {
    const kinesiologistData = {
      ...data,
      role: "kinesiologist",
      active: true,
    };

    axios
      .post(
        `${Constants.SERVER_URL}/create-professional-user`,
        kinesiologistData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        refetchKinesiologists();
        openModal("Kinesiologist created successfully!", false);
      })
      .catch((err) =>
        openModal(
          err.response?.data?.message || "Error creating kinesiologist",
          true
        )
      );
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: "Close",
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
      openModal("Error generating password", true);
    }
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("first_name_label")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: "Le prénom est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Le prénom doit contenir au moins 2 caractères",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Entrez le prénom" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("last_name_label")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: "Le nom est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Le nom doit contenir au moins 2 caractères",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Entrez le nom" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("mail")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("required_email_error"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("invalid_email_format_error"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("enter_email_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("confirm_email_label")}
                required
                validateStatus={errors.confirmEmail ? "error" : ""}
                help={errors.confirmEmail?.message}
              >
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{
                    required: t("required_email_confirmation_error"),
                    validate: (value) =>
                      value === control._formValues.email ||
                      t("email_mismatch_error"),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("confirm_email_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                    required: t("required_phone_number_error"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("invalid_phone_number_error"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("phone_number_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("password_label")}
                required
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Input.Group compact>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: t("required_password_error"),
                      minLength: {
                        value: 8,
                        message: t("password_min_length_error"),
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: t("password_requirements_error"),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input.Password
                          {...field}
                          placeholder={t("password_placeholder")}
                          style={{ width: "calc(100% - 40px)" }}
                        />
                        <Tooltip title="Générer un mot de passe">
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
              {t("create_kinesiologist_button")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

CreateKinesiologist.propTypes = {
  refetchKinesiologists: PropTypes.func.isRequired,
};

export default CreateKinesiologist;
