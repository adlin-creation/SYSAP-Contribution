import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form } from "antd";
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
      const response = await axios.post("http://localhost:80/activate", values);
      if (response.status === 200) {
        alert(t("Compte activé avec succès !"));
        navigate("/login");
      } else {
        alert(t("Échec de l'activation.") + response.data.message);
      }
    } catch (error) {
      alert(
        t("alert_error") +
          (error.response?.data?.message || t("alert_link_cannot_be_sent"))
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Activation du compte</h2>

        <Form onFinish={handleSubmit(handleResetPassword)}>
          <div className="input-element">
            <h5>Email</h5>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email requis" }}
              render={({ field }) => <Input {...field} />}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="input-element">
            <h5>Code temporaire</h5>
            <Controller
              name="code"
              control={control}
              rules={{ required: "Code requis" }}
              render={({ field }) => <Input {...field} />}
            />
            {errors.code && <p className="error">{errors.code.message}</p>}
          </div>

          <div className="input-element">
            <h5>Nouveau mot de passe</h5>
            <Controller
              name="newPassword"
              control={control}
              rules={{ required: "Mot de passe requis" }}
              render={({ field }) => <Input.Password {...field} />}
            />
            {errors.newPassword && (
              <p className="error">{errors.newPassword.message}</p>
            )}
          </div>

          <Button type="primary" htmlType="submit">
            Activer le compte
          </Button>
          <Button type="link" onClick={() => navigate("/login")}>
            Retour à la connexion
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SetNewPassword;
