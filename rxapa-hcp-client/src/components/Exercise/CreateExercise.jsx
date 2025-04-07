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
  const { t } = useTranslation("Exercises");

  const [selectedExerciseCategory, setSelectedExerciseCategory] =
    useState(null);
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [exerciseImage, setExerciseImage] = useState(null);
  const [exerciseStatus, setExerciseStatus] = useState("active");

  // Expression régulière pour vérifier un lien vidéo valide
  const videoUrlRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/\d+|(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11})(\?.*)?$/;

  // Correspondance des catégories en anglais vers le français
  const categoryTranslation = {
    Aerobic: "Aérobic",
    Strength: "Force",
    Endurance: "Endurance",
    Flexibility: "Flexibilité",
    Balance: "Équilibre",
  };

  // Correspondance des niveaux de forme en anglais vers le français
  const fitnessLevelTranslation = {
    Easy: "Facile",
    Intermediate: "Intermédiaire",
    Advanced: "Avancé",
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
    const { name, description, videoUrl } = data;

    // Vérification du lien vidéo
    if (!videoUrlRegex.test(videoUrl)) {
      openModal(t("error_invalid_video_link"), true); // Afficher un message d'erreur si le lien est invalide
      return;
    }

    const categoryInFrench =
      categoryTranslation[selectedExerciseCategory] || selectedExerciseCategory;
    const fitnessLevelInFrench =
      fitnessLevelTranslation[selectedFitnessLevel] || selectedFitnessLevel;

    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", categoryInFrench);
    formData.append("fitnessLevel", fitnessLevelInFrench);
    formData.append("videoUrl", videoUrl);
    formData.append("status", exerciseStatus);

    if (exerciseImage) {
      formData.append("file", exerciseImage);
    }
    axios
      .post(`${Constants.SERVER_URL}/create-exercise`, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        openModal(t(`Backend${res.data.message}`), false);
        props.refetchExercises();
      })
      .catch((err) => {
        const errorMessage = err.response
          ? t(`Backend${err.response.data.message}`)
          : t("error_unknown");
        openModal(errorMessage, true);
      });
  };

  function onChangeImage(event) {
    const image = event.target.files[0];
    setExerciseImage(image);
  }

  return (
    <div className="form-wrapper-exercice">
      <div className="title-container">
        <h2 className="form-title">{t("title_create_exercise")}</h2>
      </div>

      <div className="form-box-exercice">
        <Col span={12}>
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              label={t("label_exercise_name")}
              className="input-element"
            >
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_exercise_name")}
                    required
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("label_exercise_category")}
              className="input-element"
            >
              <Select
                value={selectedExerciseCategory}
                onChange={(value) => setSelectedExerciseCategory(value)}
                placeholder={t("placeholder_exercise_category")}
                style={{ width: "100%" }}
                allowClear
              >
                {[
                  t("option_aerobic"),
                  t("option_strength"),
                  t("option_endurance"),
                  t("option_flexibility"),
                  t("option_balance"),
                ].map((category) => (
                  <Select.Option key={category} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("label_expected_fitness_level")}
              className="input-element"
            >
              <Select
                value={selectedFitnessLevel}
                onChange={(value) => setSelectedFitnessLevel(value)}
                placeholder={t("placeholder_fitness_level")}
                style={{ width: "100%" }}
                allowClear
              >
                {[
                  t("option_easy"),
                  t("option_intermediate"),
                  t("option_advanced"),
                ].map((level) => (
                  <Select.Option key={level} value={level}>
                    {level}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("label_exercise_description")}
              className="input-element"
            >
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.TextArea
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_exercise_description")}
                    rows={4}
                  />
                )}
              />
            </Form.Item>
            <Form.Item
              label={t("label_exercise_status")}
              className="input-element"
            >
              <Select
                value={exerciseStatus}
                onChange={(value) => setExerciseStatus(value)}
                placeholder={t("placeholder_exercise_status")}
                style={{ width: "100%" }}
              >
                <Select.Option value="active">
                  {t("option_active")}
                </Select.Option>
                <Select.Option value="inactive">
                  {t("option_inactive")}
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t("label_exercise_video")}
              className="input-element"
            >
              <Controller
                name="videoUrl"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_exercise_video")}
                    required
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("label_exercise_image")}
              className="input-element"
            >
              <input type="file" accept="image/*" onChange={onChangeImage} />
            </Form.Item>

            <Form.Item className="input-element">
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                {t("button_submit")}
              </Button>
            </Form.Item>
          </Form>

          {isOpenModal && (
            <Modal
              open={isOpenModal}
              onCancel={closeModal}
              footer={[
                <Button key="close" onClick={closeModal}>
                  {t("button_close")}
                </Button>,
              ]}
            >
              <p style={{ color: isErrorMessage ? "red" : "black" }}>
                {message}
              </p>
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
