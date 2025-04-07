import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Row, Col } from "antd";
import "./Auth.css";
import { useTranslation } from "react-i18next";

const SetNewPassword = () => {
  const { t } = useTranslation("Authentication");
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleResetPassword = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:80/set-password",
        values
      );
      if (response.status === 200) {
        alert(t("alert_link_sent_successfully"));
        navigate("/login");
      } else {
        alert(
          t(`Backend:${response.data.message}`) || t("alert_link_sending_error")
        );
      }
    } catch (error) {
      alert(
        t("alert_error") +
          (t(`Backend:${error.response?.data?.message}`) ||
            t("alert_link_cannot_be_sent"))
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{t("title_link_sent_to_reset_password")}</h2>

        <Form onFinish={handleSubmit(handleResetPassword)}>
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
            {t("button_confirm")}
          </Button>
          <Button type="link" onClick={() => navigate("/login")}>
            {t("button_back")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SetNewPassword;
