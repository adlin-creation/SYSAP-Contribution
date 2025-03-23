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

function CreateDoctor({ refetchDoctors }) {
  const { Option } = Select;
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { token } = useToken();

  const milieuxTravail = [
    {
      value: "Hôpital: SPA soins post-aigus",
      label: t("Professionals:Physicians:spa_label"),
    },
    {
      value: "Hôpital: UCDG unité courte durée gériatrique",
      label: t("Professionals:Physicians:ucdg_label"),
    },
    {
      value: "Hôpital: UTRF unité transitoire de réadaptation fonctionnelle",
      label: t("Professionals:Physicians:utrf_label"),
    },
    { value: "Hôpital: autre unité", label: t("Professionals:Physicians:other_hospital_unit") },
    { value: "CHSLD", label: t("Professionals:Physicians:chlsd") },
    {
      value: "RPA Résidence Privée pour aînés",
      label: t("Professionals:Physicians:rpa"),
    },
    {
      value: "Clinique de médecine familiale-GMF",
      label: t("Professionals:Physicians:gmf"),
    },
    { value: "Clinique: autre", label: t("Professionals:Physicians:other_clinic") },
  ];

  const onSubmit = (data) => {
    const doctorData = {
      ...data,
      role: "doctor",
      active: true,
    };

    axios
      .post(`${Constants.SERVER_URL}/create-professional-user`, doctorData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        refetchDoctors();
        openModal(t("Professionals:Physicians:creating_success_msg"), false);
      })
      .catch((err) =>
        openModal(
          err.response?.data?.message ||
            t("Professionals:Physicians:creating_error_msg"),
          true
        )
      );
  };

  const openModal = (message, isError) => {
    AntModal[isError ? "error" : "success"]({
      content: <p>{message}</p>,
      okText: t("Professionals:Physicians:close_button"),
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
      reset({ ...control._formValues, password: generatedPassword });
    } catch (err) {
      openModal(
        t("Professionals:Physicians:generating_password_error_msg"),
        true
      );
    }
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Professionals:Physicians:enter_first_name_placeholder")}
                    />
                  )}
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Professionals:Physicians:enter_last_name_placeholder")}
                    />
                  )}
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Professionals:Physicians:enter_email_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Physicians:confirm_email_label")}
                required
                validateStatus={errors.confirmEmail ? "error" : ""}
                help={errors.confirmEmail?.message}
              >
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{
                    required: t("Professionals:Physicians:required_email_confirmation_error"),
                    validate: (value) =>
                      value === control._formValues.email ||
                      t("Professionals:Physicians:email_mismatch_error"),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Professionals:Physicians:confirm_email_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Professionals:Physicians:phone_number_placeholder")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Physicians:work_environment")}
                required
                validateStatus={errors.workEnvironment ? "error" : ""}
                help={errors.workEnvironment?.message}
              >
                <Controller
                  name="workEnvironment"
                  control={control}
                  rules={{
                    required: t("Professionals:Physicians:required_work_environment_error"),
                    minLength: {
                      value: 2,
                      message: t("Professionals:Physicians:work_environment_min_length_error"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder={t("Professionals:Physicians:select_work_environment_placeholder")}
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
                label={t("Professionals:Physicians:password_label")}
                required
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Input.Group compact>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: t("Professionals:Physicians:required_password_error"),
                      minLength: {
                        value: 8,
                        message: t("Professionals:Physicians:password_min_length_error"),
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: t("Professionals:Physicians:password_requirements_error"),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input.Password
                          {...field}
                          placeholder={t("Professionals:Physicians:password_placeholder")}
                          style={{ width: "calc(100% - 40px)" }}
                        />
                        <Tooltip title={t("Professionals:Physicians:generate_password_tooltip")}>
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
              {t("Professionals:Physicians:create_physician_button")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

CreateDoctor.propTypes = {
  refetchDoctors: PropTypes.func.isRequired,
};

export default CreateDoctor;
