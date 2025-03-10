import React from "react";
import { Row, Col, Input, Button, Form, Modal, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons"; // Ajout de l'importation
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import "./Styles.css";
import { useTranslation } from "react-i18next";

export default function ExerciseDetail({ exercise, refetchExercises }) {
  const { t } = useTranslation();
  const { handleSubmit, control, setValue } = useForm();
  const { token } = useToken();

  // État pour gérer si l'on est en mode édition
  const [isEditing, setIsEditing] = React.useState(false); 

  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // Fonction pour ouvrir le modal avec un message et un indicateur d'erreur
  function openModal(message, isError) {
    setMessage(message); 
    setIsErrorMessage(isError); 
    setIsOpenModal(true); 
  }

  // Fonction pour fermer le modal et réinitialiser les valeurs
  function closeModal() {
    setIsOpenModal(false); 
    setMessage(""); 
    setIsErrorMessage(false); 
  }

  // Fonction de soumission du formulaire
  const onSubmit = (data) => {
    // Appel à l'API pour mettre à jour les données de l'exercice
    axios
      .put(`${Constants.SERVER_URL}/update-exercise/${exercise.key}`, data, {
        headers: {
          Authorization: "Bearer " + token, // Envoie le token pour l'authentification
        },
      })
      .then((res) => {
        refetchExercises(); // Recharger les exercices
        openModal(res.data.message, false); // Ouvre le modal avec le message de succès
      })
      .catch((err) => {
        openModal(err.response.data.message, true); // Ouvre le modal avec le message d'erreur
      });
  };

  // Fonction pour activer le mode édition et pré-remplir les champs
  const startEditing = () => {
    setIsEditing(true); // Active le mode édition
    setValue("name", exercise.name); // Pré-remplir les champs avec les données existantes
    setValue("description", exercise.description); // Pré-remplir les champs avec les données existantes
    setValue("category", exercise.category); // Pré-remplir la catégorie
    setValue("fitnessLevel", exercise.fitnessLevel); // Pré-remplir le niveau de forme physique
  };

  // Rendu du composant
  return (
    <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Champ de saisie pour le nom de l'exercice */}
          <Form.Item label={t("Nom de l'exercice")}>
            <Controller
              name="name"
              control={control}
              defaultValue={exercise.name}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Entrez le nouveau nom d'exercice."
                  required
                  disabled={!isEditing} // Si isEditing est false, les champs sont en lecture seule
                />
              )}
            />
          </Form.Item>

          {/* Champ pour la catégorie de l'exercice */}
          <Form.Item label="Catégorie de l'exercice">
            <Controller
              name="category"
              control={control}
              defaultValue={exercise.category}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={onChange}
                  value={value}
                  placeholder="Sélectionner une catégorie"
                  style={{ width: "100%" }}
                  allowClear
                  disabled={!isEditing} // Si isEditing est false, les champs sont en lecture seule
                >
                  {["Cardio", "Force", "Flexibilité", "Équilibre"].map((category) => (
                    <Select.Option key={category} value={category}>
                      {category}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Champ pour le niveau de forme physique */}
          <Form.Item label={t("le niveau de forme physique attendu")}>
            <Controller
              name="fitnessLevel"
              control={control}
              defaultValue={exercise.fitnessLevel}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={onChange}
                  value={value}
                  placeholder="Sélectionner un niveau"
                  style={{ width: "100%" }}
                  allowClear
                  disabled={!isEditing} // Si isEditing est false, les champs sont en lecture seule
                >
                  {["Débutant", "Intermédiaire", "Avancé"].map((level) => (
                    <Select.Option key={level} value={level}>
                      {level}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Champ de saisie pour la description de l'exercice */}
          <Form.Item label="Description d'exercice">
            <Controller
              name="description"
              control={control}
              defaultValue={exercise.description}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder="Entrez la nouvelle description de l'exercice."
                  rows={4}
                  required
                  disabled={!isEditing} // Si isEditing est false, les champs sont en lecture seule
                />
              )}
            />
          </Form.Item>

          {/* Bouton pour activer le mode édition ou soumettre les modifications */}
          <Form.Item>
            {!isEditing ? (
              <Button
                type="primary"
                onClick={startEditing} // Active le mode édition 
              >
                Modifier
              </Button>
            ) : (
              // Une fois en mode édition, afficher le bouton "Sauvegarder" pour soumettre les changements
              <Button
                type="primary"
                htmlType="submit" 
                icon={<CheckOutlined />}
              >
                Sauvegarder
              </Button>
            )}
          </Form.Item>
        </Form>

        {/* Modal qui s'affiche avec un message de feedback après soumission */}
        {isOpenModal && (
          <Modal
            title="Feedback"
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                Fermer
              </Button>,
            ]}
          >
            <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
          </Modal>
        )}
      </Col>
    </Row>
  );
}