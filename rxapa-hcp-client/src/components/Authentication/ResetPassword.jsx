import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form } from "antd";
import "./Auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  // 1) Récupérer le token depuis l'URL ?token=XYZ
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 2) Soumission du formulaire
  const handleResetPassword = async (values) => {
    // Vérifie la confirmation
    if (values.newPassword !== values.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // 3) Appeler l'API backend en envoyant `token` + `new_password`
      const response = await axios.post("http://localhost:80/reset-password", {
        token: token,
        new_password: values.newPassword,
      });
      if (response.status === 200) {
        alert("Mot de passe modifié avec succès !");
        navigate("/login");
      } else {
        alert(response.data.message || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      alert(
        "Erreur : " +
          (error.response?.data?.message ||
            "Impossible de réinitialiser le mot de passe")
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Définir un nouveau mot de passe</h2>

        <Form onFinish={handleSubmit(handleResetPassword)}>          
          <div className="input-element">
            <h5>Nouveau mot de passe</h5>
            <Controller
              name="newPassword"
              control={control}
              rules={{ required: "Veuillez entrer un mot de passe !" }}
              render={({ field }) => <Input.Password {...field} />}
            />
            {errors.newPassword && (
              <p className="error">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="input-element">
            <h5>Confirmer mot de passe</h5>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ required: "Veuillez confirmer le mot de passe !" }}
              render={({ field }) => <Input.Password {...field} />}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="primary" htmlType="submit">
            Confirmer
          </Button>
          <Button type="link" onClick={() => navigate("/login")}>
            Retour
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;