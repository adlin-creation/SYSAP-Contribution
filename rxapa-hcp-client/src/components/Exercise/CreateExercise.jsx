import React, { useState } from "react";
import PropTypes from "prop-types"; // Import de PropTypes
import { Col, Input, Button, Form, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { SendOutlined } from "@ant-design/icons"; // Import de l'icône
import "./Styles.css";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { useTranslation } from "react-i18next";

export default function CreateExercise(props) {
  const { handleSubmit, control } = useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const [selectedExerciseCategory, setSelectedExerciseCategory] = useState(null);
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null); // Assurez-vous que la valeur initiale est null
  const [exerciseImage, setExerciseImage] = useState(null);

  // Correspondance des catégories en anglais vers le français
  const categoryTranslation = {
    "Aerobic": "Aérobic",
    "Strength": "Force",
    "Endurance": "Endurance",
    "Flexibility": "Flexibilité",
    "Balance": "Équilibre",
  };

  // Correspondance des niveaux de forme en anglais vers le français
  const fitnessLevelTranslation = {
    "Easy": "Facile",
    "Intermediate": "Intermédiaire",
    "Advanced": "Avancé",
  };

  // destructure custom use hook
  const { token } = useToken();
  
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

  const onSubmit = (data) => {
    const { name, description } = data;

    // Traduire la catégorie sélectionnée en français
    const categoryInFrench = categoryTranslation[selectedExerciseCategory] || selectedExerciseCategory;
    const fitnessLevelInFrench = fitnessLevelTranslation[selectedFitnessLevel] || selectedFitnessLevel;

    let formData = new FormData();
    const combinedData = {
      name: name,
      description: description,
      category: categoryInFrench,  // Utilisation de la catégorie traduite en français
      fitnessLevel: fitnessLevelInFrench,  // Utilisation du niveau de forme traduit
      exerciseImage: exerciseImage,
    };

    console.log("Submitting Data:", combinedData);
  
    if (exerciseImage) {
      formData.append("image", exerciseImage);
    }
    formData.append("name", combinedData.name);
    formData.append("description", combinedData.description);
    formData.append("category", combinedData.category);
    formData.append("fitnessLevel", combinedData.fitnessLevel);

    axios
      .post(`${Constants.SERVER_URL}/create-exercise`, combinedData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        openModal(res.data.message, false);
        props.refetchExercises();
      })
      .catch((err) => {
        const errorMessage = err.response
          ? err.response.data.message
          : "An error occurred";
        openModal(errorMessage, true);
      });
  };

  function onChangeImage(event) {
    console.log("The image is: ", event.target.files[0]);
    const image = event.target.files[0];
    setExerciseImage(image);
  }

  return (
    <div className="form-wrapper-exercice">
      <div className="title-container">
        <h2 className="form-title">{t("Exercises:create_exercise")}</h2>
      </div>
  
      <div className="form-box-exercice">
        <Col span={12}>
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item label={t("Exercises:enter_exercise_name")} className="input-element">
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("Exercises:exercise_name")}
                    required
                  />
                )}
              />
            </Form.Item>
  
            <Form.Item label={t("Exercises:exercise_category")} className="input-element">
              <Select
                value={selectedExerciseCategory}
                onChange={(value) => setSelectedExerciseCategory(value)}
                placeholder={t("Exercises:exercise_category")}
                style={{ width: "100%" }}
                allowClear
              >
                {[t("Exercises:aerobic"), t("Exercises:strength"), t("Exercises:endurance"), t("Exercises:flexibility"), t("Exercises:balance")].map((category) => (
                  <Select.Option key={category} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
  
            <Form.Item label={t("Exercises:select_expected_fitness_level")} className="input-element">
              <Select
                value={selectedFitnessLevel}
                onChange={(value) => setSelectedFitnessLevel(value)}
                placeholder={t("Exercises:select_fitness_level")}
                style={{ width: "100%" }}
                allowClear
              >
                {[t("Exercises:easy"), t("Exercises:intermediate"), t("Exercises:advanced")].map((level) => (
                  <Select.Option key={level} value={level}>
                    {level}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
  
            <Form.Item label={t("Exercises:enter_exercise_description")} className="input-element">
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.TextArea
                    onChange={onChange}
                    value={value}
                    placeholder={t("Exercises:exercise_description")}
                    rows={4}
                  />
                )}
              />
            </Form.Item>
  
            <Form.Item label={t("Exercises:enter_exercise_image")} className="input-element">
              <input type="file" accept="image/*" onChange={onChangeImage} />
            </Form.Item>
  
            <Form.Item className="input-element">
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                {t("Exercises:submit_button")}
              </Button>
            </Form.Item>
          </Form>
  
          {isOpenModal && (
            <Modal
              open={isOpenModal}
              onCancel={closeModal}
              footer={[
                <Button key="close" onClick={closeModal}>
                  {t("Exercises:close_button")}
                </Button>,
              ]}
            >
              <p style={{ color: isErrorMessage ? "red" : "black" }}>{message}</p>
            </Modal>
          )}
        </Col>
      </div>
    </div>
  );  
}

CreateExercise.propTypes = {
  refetchExercises: PropTypes.func.isRequired, // Validation de la prop refetchExercises
};
