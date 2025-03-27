import {
  Row,
  Col,
  Select,
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

function CreateKinesiologist({ refetchKinesiologists }) {
  const { Option } = Select;

  const milieuxTravail = [
    {
      value: "Hôpital: SPA soins post-aigus",
      label: "Hôpital: SPA soins post-aigus",
    },
    {
      value: "Hôpital: UCDG unité courte durée gériatrique",
      label: "Hôpital: UCDG unité courte durée gériatrique",
    },
    {
      value: "Hôpital: UTRF unité transitoire de réadaptation fonctionnelle",
      label: "Hôpital: UTRF unité transitoire de réadaptation fonctionnelle",
    },
    { value: "Hôpital: autre unité", label: "Hôpital: autre unité" },
    { value: "CHSLD", label: "CHSLD" },
    {
      value: "RPA Résidence Privée pour aînés",
      label: "RPA Résidence Privée pour aînés",
    },
    {
      value: "Clinique de médecine familiale-GMF",
      label: "Clinique de médecine familiale-GMF",
    },
    { value: "Clinique: autre", label: "Clinique: autre" },
  ];

  const { t } = useTranslation("Professionals");
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
        openModal(t("Kinesiologist.creating_success_msg"), false);
      })
      .catch((err) =>
        openModal(
          t(`Backend:${err.response?.data?.message}`) ||
            t("Kinesiologist.creating_error_msg"),
          true
        )
      );
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: <p>{message}</p>,
      okText: "Close",
      centered: true,
      onOk: () => {
        if (!isError) {
          reset(); // Réinitialiser le formulaire en cas de succès
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
      openModal(t("Kinesiologist.generating_password_error_msg"), true);
    }
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.first_name_label")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.required_first_name_error"),
                    minLength: {
                      value: 2,
                      message: t("Kinesiologist.first_name_min_length_error"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Kinesiologist.enter_first_name_placeholder"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.last_name_label")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.required_last_name_error"),
                    minLength: {
                      value: 2,
                      message: t("Kinesiologist.last_name_min_length_error"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Kinesiologist.enter_last_name")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.required_email_error"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("Kinesiologist.invalid_email_format_error"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Kinesiologist.enter_email_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.confirm_email_label")}
                required
                validateStatus={errors.confirmEmail ? "error" : ""}
                help={errors.confirmEmail?.message}
              >
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{
                    required: t(
                      "Kinesiologist.required_email_confirmation_error"
                    ),
                    validate: (value) =>
                      value === control._formValues.email ||
                      t("Kinesiologist.email_mismatch_error"),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Kinesiologist.confirm_email_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.required_phone_number_error"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Kinesiologist.invalid_phone_number_error"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Kinesiologist.phone_number_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.work_environment_label")}
                required
                validateStatus={errors.workEnvironment ? "error" : ""}
                help={errors.workEnvironment?.message}
              >
                <Controller
                  name="workEnvironment"
                  control={control}
                  rules={{
                    required: t("Kinesiologist.work_environment_required"),
                    minLength: {
                      value: 2,
                      message: t("Kinesiologist.work_environment_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder={t(
                        "Kinesiologist.work_environment_placeholder"
                      )}
                    >
                      {milieuxTravail.map((milieu) => (
                        <Option key={milieu.value} value={milieu.value}>
                          {milieu.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Kinesiologist.password_label")}
                required
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Input.Group compact>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: t("Kinesiologist.required_password_error"),
                      minLength: {
                        value: 8,
                        message: t("Kinesiologist.password_min_length_error"),
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: t("Kinesiologist.password_requirements_error"),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input.Password
                          {...field}
                          placeholder={t("Kinesiologist.password_placeholder")}
                          style={{ width: "calc(100% - 40px)" }}
                        />
                        <Tooltip
                          title={t("Kinesiologist.generate_password_tooltip")}
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
              {t("Kinesiologist.create_kenisiologist_button")}
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
