import React from "react";
import PropTypes from "prop-types"; // Linting
import { Input, Button, Row, Col, Form } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import Constants from "../Utils/Constants";
import "./Auth.css";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Signup({ setIsSignup }) {
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      role: "superadmin", // Valeur par défaut pour le champ role
    },
  });
  const { t } = useTranslation();
  const onSubmit = (data) => {
    console.log(data); // Ajout d'un console.log pour vérifier les données envoyées
    axios
      .post(`${Constants.SERVER_URL}/signup`, data)
      .then((res) => {
        setIsSignup(false);
      })
      .catch((err) => {
        console.log(err.response?.data?.message);
      });
  };

  function backToLogin() {
    setIsSignup(false);
  }

  return (
    <div className="auth-container">
      <Col span={9}>
        <div className="auth-form">
          <Row>
            <Col span={16}></Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <LanguageSwitcher
                iconStyle={{ color: "#3b0062" }}
                iconClassName="login-language-icon"
              />
            </Col>
          </Row>
          <Button
            onClick={backToLogin}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            {t("Authentication:back_button")}
          </Button>
          <Form onFinish={handleSubmit(onSubmit)}>
          <div className="input-element">
              <h5> Entrez votre prenom</h5>
              <Controller
                name={"firstname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={"Votre prenom"}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("Authentication:name_title")}</h5>
              <Controller
                name={"lastname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("Authentication:name_placeholder")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("Authentication:email_title")}</h5>
              <Controller
                name={"email"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("Authentication:email_placeholder")}
                    type="email"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("Authentication:password_title")}</h5>
              <Controller
                name={"password"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    value={value}
                    placeholder={t("Authentication:password_placeholder")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("Authentication:confirm_password_title")}</h5>
              <Controller
                name={"confirmPassword"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    value={value}
                    placeholder={t(
                      "Authentication:confirm_password_placeholder"
                    )}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> Phone Number</h5>
              <Controller
                name={"phoneNumber"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={"Phone Number"}
                    type="tel"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> Role</h5>
              <Controller
                name={"role"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <select onChange={onChange} value={value} required>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="kinesiologist">Kinesiologue</option>
                    <option value="doctor">Doctor</option>
                  </select>
                )}
              />
            </div>

            <div className="input-element">
              <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                {t("Authentication:signup_button")}
              </Button>
            </div>
          </Form>
        </div>
      </Col>
    </div>
  );
}
// For the PropTypes, we only need to check if the setIsSignup function is passed as a prop. (Sonarlint)
Signup.propTypes = {
  setIsSignup: PropTypes.func.isRequired,
};
