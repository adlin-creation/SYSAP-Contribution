import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Button, Row, Col, Modal, Input, Form } from "antd";
import { CheckOutlined } from "@ant-design/icons"; // Import de l'icône de antd
import { useNavigate } from "react-router-dom"; // Import de useNavigate
import Constants from "../Utils/Constants";
import Signup from "./Signup";
import "./Auth.css";
import PropTypes from "prop-types";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Login({ setToken }) {
  const [isSignup, setIsSignup] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm();
  const { t } = useTranslation();
  function register() {
    setIsSignup(true);
  }

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/login`, data)
      .then((res) => {
        console.log(res.data);
        setIsSignup(false);
        setToken(res.data);
        navigate("/", { state: { role: res.data.role } });
      })
      .catch((err) => {
        openModal(err.response.data.message, true);
      });
  };

  if (isSignup) {
    return <Signup setIsSignup={setIsSignup} />;
  }

  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  }

  return (
    <div className="auth-container">
      <Col span={9}>
        <div className="auth-form">
          <Row justify="space-between" align="middle">
            {/* Juste un espace vide pour centrer Login et mettre à gauche l'icone de langue*/}
            <Col span={8}></Col>{" "}
            <Col span={8} style={{ textAlign: "center" }}>
              <h2>{t("Authentication:login_title")}</h2>
            </Col>
            <Col span={8} style={{ textAlign: "center" }}>
              <LanguageSwitcher
                iconStyle={{ color: "#3b0062" }}
                iconClassName="login-language-icon"
              />
            </Col>
          </Row>
          <Form onFinish={handleSubmit(onSubmit)}>
            <div className="input-element">
              <h5>{t("Authentication:email_title")}</h5>
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
              <h5>{t("Authentication:password_title")}</h5>
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
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />} // Utilisation de l'icône de antd
              >
                {t("Authentication:login_button")}
              </Button>

              <Button type="link" onClick={register}>
                {t("Authentication:register_button")}
              </Button>

              <Button type="link" onClick={() => navigate("/set-new-password")}>
                Mot de passe oublie
              </Button>

            </div>
          </Form>
        </div>
        <Modal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
            </Button>,
          ]}
        >
          <p style={{ color: isErrorMessage ? "red" : "black" }}>{message}</p>
        </Modal>
      </Col>
    </div>
  );
}

// Validation des props
Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
