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
import { t } from "i18next";

function CreateDoctor({ refetchDoctors }) {

  const { Option } = Select;


  const milieuxTravail = [
    { value: "Hôpital: SPA soins post-aigus", label: "Hôpital: SPA soins post-aigus" },
    { value: "Hôpital: UCDG unité courte durée gériatrique", label: "Hôpital: UCDG unité courte durée gériatrique" },
    { value: "Hôpital: UTRF unité transitoire de réadaptation fonctionnelle", label: "Hôpital: UTRF unité transitoire de réadaptation fonctionnelle" },
    { value: "Hôpital: autre unité", label: "Hôpital: autre unité" },
    { value: "CHSLD", label: "CHSLD" },
    { value: "RPA Résidence Privée pour aînés", label: "RPA Résidence Privée pour aînés" },
    { value: "Clinique de médecine familiale-GMF", label: "Clinique de médecine familiale-GMF" },
    { value: "Clinique: autre", label: "Clinique: autre" }
  ];
      
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { token } = useToken();

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
      .then((res) => {
        refetchDoctors();
        openModal("Doctor created successfully!", false, data);
      })
      .catch((err) =>
        openModal(err.response?.data?.message || "Error creating doctor", true)
      );
  };

  const sendPassword = (email, password) => {
    const subject = encodeURIComponent('New Doctor Account');
    const body = encodeURIComponent(`Hello,\n\nHere are the details for the new doctor account:\n\nEmail: ${email}\nPassword: ${password}\n\nBest regards,`);
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };


  const openModal = (message, isError, passwordData) => {
    AntModal[isError ? 'error' : 'success']({
      content: (
        <div>
          <p>{message}</p>
          {!isError && passwordData && (
            <div>
              <p><strong>Email:</strong> {passwordData.email}</p>
              <p><strong>Password:</strong> {passwordData.password}</p>
              <button onClick={() => sendPassword(passwordData.email, passwordData.password)}>Send Password</button>
            </div>
          )}
        </div>
      ),
      okText: 'Close',
      centered: true,
      onOk: () => {
        if (!isError) {
          reset(); // Réinitialiser le formulaire en cas de succès
        }
      }
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
                label={t("Professionals:Doctors:first_name_label")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t(
                      "Professionals:Doctors:required_first_name_error"
                    ),
                    minLength: {
                      value: 2,
                      message: t(
                        "Professionals:Doctors:first_name_min_length_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Doctors:enter_first_name_placeholder"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Doctors:last_name_label")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t(
                      "Professionals:Doctors:required_last_name_error"
                    ),
                    minLength: {
                      value: 2,
                      message: t(
                        "Professionals:Doctors:last_name_min_length_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Doctors:enter_last_name_placeholder"
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
                label={t("Professionals:Doctors:email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("Professionals:Doctors:required_email_error"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t(
                        "Professionals:Doctors:invalid_email_format_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Doctors:enter_email_placeholder"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Doctors:confirm_email_label")}
                required
                validateStatus={errors.confirmEmail ? "error" : ""}
                help={errors.confirmEmail?.message}
              >
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{
                    required: t(
                      "Professionals:Doctors:required_email_confirmation_error"
                    ),
                    validate: (value) =>
                      value === control._formValues.email ||
                      t("Professionals:Doctors:email_mismatch_error"),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Doctors:confirm_email_placeholder"
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
                label={t("Professionals:Doctors:phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t(
                      "Professionals:Doctors:required_phone_number_error"
                    ),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t(
                        "Professionals:Doctors:invalid_phone_number_error"
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t(
                        "Professionals:Doctors:phone_number_placeholder"
                      )}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Work environment"
                required
                validateStatus={errors.workEnvironment ? "error" : ""}
                help={errors.workEnvironment?.message}
              >
                <Controller
                  name="workEnvironment"
                  control={control}
                  rules={{
                    required: "Le milieu de travail est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Le milieu de travail doit contenir au moins 2 caractères"
                    }
                  }}
                  render={({ field }) => 
                    <Select {...field} placeholder="Sélectionnez le milieu de travail">
                      {milieuxTravail.map((milieu) => (
                        <Option key={milieu.value} value={milieu.value}>
                          {milieu.label}
                        </Option>
                      ))}
                    </Select>}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Professionals:Doctors:password_label")}
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
                        "Professionals:Doctors:required_password_error"
                      ),
                      minLength: {
                        value: 8,
                        message: t(
                          "Professionals:Doctors:password_min_length_error"
                        ),
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: t(
                          "Professionals:Doctors:password_requirements_error"
                        ),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input.Password
                          {...field}
                          placeholder={t(
                            "Professionals:Doctors:password_placeholder"
                          )}
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
              {t("Professionals:Doctors:create_doctor_button")}
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
