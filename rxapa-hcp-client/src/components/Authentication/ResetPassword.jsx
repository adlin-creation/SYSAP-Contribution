// Importation des librairies React, React Router, Axios, etc.
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Pour redirection + lecture du token
import axios from "axios"; // Pour les requêtes HTTP
import { useForm, Controller } from "react-hook-form"; // Gestion de formulaire moderne
import { Button, Input, Form } from "antd"; // Composants UI Ant Design
import "./Auth.css"; // Fichier CSS personnalisé pour le style du formulaire

const ResetPassword = () => {
  // Permet de naviguer vers une autre page (comme "/login" après succès)
  const navigate = useNavigate();

  // Récupère le token directement depuis l'URL (ex: ?token=xyz)
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Ex: "1234abcd..."

  // Hook React Hook Form : initialise le contrôle du formulaire
  const {
    control,          // Permet de lier les inputs au formulaire
    handleSubmit,     // Fonction pour gérer la soumission
    formState: { errors }, // Contient les erreurs de validation des champs
  } = useForm();

  /**
   * Fonction déclenchée lors de la soumission du formulaire
   * Elle vérifie que les mots de passe sont identiques
   * et envoie une requête POST avec le token + le nouveau mot de passe
   */
  const handleResetPassword = async (values) => {
    // Vérifie que les 2 mots de passe saisis sont identiques
    if (values.newPassword !== values.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Appel au backend : envoie le token + nouveau mot de passe
      const response = await axios.post("http://localhost:80/reset-password", {
        token: token, // Token récupéré depuis l'URL
        new_password: values.newPassword, // Nouveau mot de passe saisi
      });

      // Si succès : on affiche un message + redirection vers page de connexion
      if (response.status === 200) {
        alert("Mot de passe modifié avec succès !");
        navigate("/login");
      } else {
        alert(response.data.message || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      // En cas d'erreur serveur ou réseau
      alert(
        "Erreur : " +
          (error.response?.data?.message || "Impossible de réinitialiser le mot de passe")
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {/* Titre du formulaire */}
        <h2>Définir un nouveau mot de passe</h2>

        {/* Formulaire avec Ant Design + React Hook Form */}
        <Form onFinish={handleSubmit(handleResetPassword)}>

          {/* --- Champ 1 : Nouveau mot de passe --- */}
          <div className="input-element">
            <h5>Nouveau mot de passe</h5>
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "Veuillez entrer un mot de passe !",
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                  message:
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.",
                },
              }}
              render={({ field }) => <Input.Password {...field} />}
            />
            {/* Affichage de l'erreur si le champ est invalide */}
            {errors.newPassword && (
              <p className="error">{errors.newPassword.message}</p>
            )}
          </div>

          {/* --- Champ 2 : Confirmation du mot de passe --- */}
          <div className="input-element">
            <h5>Confirmer mot de passe</h5>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Veuillez confirmer le mot de passe !",
              }}
              render={({ field }) => <Input.Password {...field} />}
            />
            {/* Affichage de l'erreur si le champ est invalide */}
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* --- Bouton principal : Confirmer --- */}
          <div className="input-element">
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }} // Même largeur que les champs
            >
              Confirmer
            </Button>
          </div>

          {/* --- Bouton secondaire : Retour --- */}
          <Button type="link" onClick={() => navigate("/login")}>
            Retour
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;