import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Row, Col } from "antd";
import "./Auth.css";

const SetNewPassword = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleResetPassword = async (values) => {
    try {
      const response = await axios.post("http://localhost:80/set-password", values);
      if (response.status === 200) {
        alert("Lien envoyé avec succès !");
        navigate("/login");
      } else {
        alert(response.data.message || "Erreur lors de l'envoi du lien");
      }
    } catch (error) {
      alert("Erreur : " + (error.response?.data?.message || "Impossible d'envoyer le lien de réinitialisation"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Envoyer un lien pour réinitialiser le mot de passe</h2>

        <Form onFinish={handleSubmit(handleResetPassword)}>
          <div className="input-element">
            <h5>Adresse e-mail</h5>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Veuillez entrer votre e-mail !" }}
              render={({ field }) => <Input {...field} />}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <Button type="primary" htmlType="submit">Confirmer</Button>
          <Button type="link" onClick={() => navigate("/login")}>Retour</Button>
        </Form>
      </div>
    </div>
  );
};

export default SetNewPassword;