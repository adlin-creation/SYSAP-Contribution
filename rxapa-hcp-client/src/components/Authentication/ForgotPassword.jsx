import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form } from "antd";
import axios from "axios";
import "./Auth.css";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation("Authentication");
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSendLink = async (values) => {
    try {
      const response = await axios.post("http://localhost:80/reset-password-request", {
        email: values.email,
      });

      if (response.status === 200) {
        alert(t("alert_link_sent_successfully"));
        navigate("/login");
      }
    } catch (error) {
      alert(
        t("alert_error") +
          (t(`Backend:${error.response?.data?.message}`) || t("alert_link_cannot_be_sent"))
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{t("reinitialisation mot de passe ")}</h2>
        <Form onFinish={handleSubmit(handleSendLink)}>
          <div className="input-element">
            <h5>{t("title_email")}</h5>
            <Controller
              name="email"
              control={control}
              rules={{ required: t("error_mail_required") }}
              render={({ field }) => <Input {...field} />}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <Button type="primary" htmlType="submit">
            {t("envoyer")}
          </Button>
          <Button type="link" onClick={() => navigate("/login")}>
            {t("button_back")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
