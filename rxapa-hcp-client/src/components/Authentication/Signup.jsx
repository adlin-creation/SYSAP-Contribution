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
  const { t } = useTranslation("Authentication");
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      role: "superadmin", // Valeur par défaut pour le champ role
    },
  });
  const onSubmit = (data) => {
    console.log(data); // Ajout d'un console.log pour vérifier les données envoyées
    axios
      .post(`${Constants.SERVER_URL}/signup`, data)
      .then((res) => {
        setIsSignup(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
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
                labelColor={{ color: "#3b0062" }}
              />
            </Col>
          </Row>
          <Button
            onClick={backToLogin}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            {t("button_back")}
          </Button>
          <Form onFinish={handleSubmit(onSubmit)}>
            <div className="input-element">
              <h5> {t("title_firstname")}</h5>
              <Controller
                name={"firstname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_firstname")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("title_name")}</h5>
              <Controller
                name={"lastname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_name")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("title_email")}</h5>
              <Controller
                name={"email"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_email")}
                    type="email"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("title_password")}</h5>
              <Controller
                name={"password"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_password")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("title_confirm_password")}</h5>
              <Controller
                name={"confirmPassword"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_confirm_password")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5>{t("title_phone_number")}</h5>
              <Controller
                name={"phoneNumber"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_phone_number")}
                    type="tel"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("title_role")}</h5>
              <Controller
                name={"role"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <select onChange={onChange} value={value} required>
                    <option value="superadmin">
                      {t("option_super_admin")}
                    </option>
                    <option value="admin">{t("option_admin")}</option>
                    <option value="kinesiologist">
                      {t("option_kinesiologist")}
                    </option>
                    <option value="doctor">{t("option_physician")}</option>
                  </select>
                )}
              />
            </div>

            <div className="input-element">
              <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                {t("button_signup")}
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
