import React from "react";
import { Row, Col, Input, Button, Form, Modal, Select, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import "./Styles.css";

export default function ExerciseDetail({ exercise, refetchExercises }) {
  const { t } = useTranslation();
  const { handleSubmit, control, setValue } = useForm();
  const { token } = useToken();

  const [currentExercise, setCurrentExercise] = React.useState(exercise);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSaveClicked, setIsSaveClicked] = React.useState(false);
  const [exerciseStatus, setExerciseStatus] = React.useState(exercise.status || "active");

  // Regex pour validation URL vidéo
  const videoUrlRegex = /^(https?:\/\/)?(www\.)?(youtube|vimeo)\.(com|be)\/(watch\?v=|.*\/)([a-zA-zA-Z0-9_-]{11,})$/;

  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
    setIsSaveClicked(false);
  }

  const onSubmit = (data) => {
    // Validation du lien vidéo
    if (data.videoUrl && !videoUrlRegex.test(data.videoUrl)) {
      openModal(t("Exercises:invalid_video_link"), true);
      return;
    }
  
    if (isSaveClicked) {
      // Vérification manuelle des modifications
      const hasChanged = Object.keys(data).some(key => currentExercise[key] !== data[key]) 
        || (currentExercise.status || "active") !== exerciseStatus;
  
      if (!hasChanged) {
        openModal(t("Exercises:no_changes_detected"), true);
        setIsEditing(false);
        setIsSaveClicked(false);
        return;
      }
  
      setIsSubmitting(true);
      const payload = { ...data, status: exerciseStatus };

      axios.put(`${Constants.SERVER_URL}/update-exercise/${currentExercise.key}`, payload, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setCurrentExercise((prev) => ({ ...prev, ...data, status: exerciseStatus || "active" }));
        refetchExercises();
        openModal(res.data.message, false);
        setIsSubmitting(false);
        setIsEditing(false);
      })
      .catch((err) => {
        openModal(err.response?.data?.message || t("Exercises:error"), true);
        setIsSubmitting(false);
      });
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setValue("name", currentExercise.name);
    setValue("description", currentExercise.description);
    setValue("category", currentExercise.category);
    setValue("fitnessLevel", currentExercise.fitnessLevel);
    setValue("videoUrl", currentExercise.videoUrl);
    setExerciseStatus(currentExercise.status || "active");
  };

  return (
    <div className="exercise-detail-container">
      <Typography.Title level={1} className="exercise-title">
        {currentExercise.name}
      </Typography.Title>

      <Row gutter={40} style={{ width: "100%" }}>
        <Col span={12} className="video-container">
          {currentExercise.videoUrl && (
            <div className="video-wrapper">
              <ReactPlayer
                url={currentExercise.videoUrl}
                controls
                width="100%"
                height="100%"
                className="react-player"
              />
            </div>
          )}
        </Col>

        <Col span={12} className="info-container">
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              label={t("Exercises:exercise_name")}
              style={{ fontWeight: "bold" }}
            >
              <Controller
                name="name"
                control={control}
                defaultValue={currentExercise.name}
                render={({ field }) => (
                  <Input {...field} required disabled={!isEditing} />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("Exercises:category_placeholder")}
              style={{ fontWeight: "bold" }}
            >
              <Controller
                name="category"
                control={control}
                defaultValue={currentExercise.category}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    allowClear
                    disabled={!isEditing}
                  >
                    {[
                      t("Exercises:aerobic"),
                      t("Exercises:strength"),
                      t("Exercises:endurance"),
                      t("Exercises:flexibility"),
                      t("Exercises:balance"),
                    ].map((category) => (
                      <Select.Option key={category} value={category}>
                        {category}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("Exercises:fitness_level_placeholder")}
              style={{ fontWeight: "bold" }}
            >
              <Controller
                name="fitnessLevel"
                control={control}
                defaultValue={currentExercise.fitnessLevel}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    allowClear
                    disabled={!isEditing}
                  >
                    {[
                      t("Exercises:easy"),
                      t("Exercises:intermediate"),
                      t("Exercises:advanced"),
                    ].map((level) => (
                      <Select.Option key={level} value={level}>
                        {level}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("Exercises:exercise_description")}
              style={{ fontWeight: "bold" }}
            >
              <Controller
                name="description"
                control={control}
                defaultValue={currentExercise.description}
                render={({ field }) => (
                  <Input.TextArea {...field} rows={4} required disabled={!isEditing} />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("Exercises:exercise_video")}
              style={{ fontWeight: "bold" }}
            >
              <Controller
                name="videoUrl"
                control={control}
                defaultValue={currentExercise.videoUrl}
                render={({ field }) => (
                  <Input {...field} required disabled={!isEditing} />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("Exercises:exercise_status")}
              style={{ fontWeight: "bold" }}
            >
              <Select
                value={exerciseStatus}
                onChange={(value) => setExerciseStatus(value)}
                disabled={!isEditing}
                style={{ width: "100%" }}
              >
                <Select.Option value="active">{t("Exercises:active")}</Select.Option>
                <Select.Option value="inactive">{t("Exercises:inactive")}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              {!isEditing ? (
                <Button type="primary" onClick={startEditing}>
                  {t("Exercises:modify")}
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  loading={isSubmitting}
                  onClick={() => setIsSaveClicked(true)}
                >
                  {t("Exercises:save")}
                </Button>
              )}
            </Form.Item>
          </Form>

          {isOpenModal && (
            <Modal
              title={t("Feedback")}
              open={isOpenModal}
              onCancel={closeModal}
              footer={[
                <Button key="close" onClick={closeModal}>
                  {t("Close")}
                </Button>,
              ]}
            >
              <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
            </Modal>
          )}
        </Col>
      </Row>
    </div>
  );
}

ExerciseDetail.propTypes = {
  exercise: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    fitnessLevel: PropTypes.string.isRequired,
    videoUrl: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
  refetchExercises: PropTypes.func.isRequired,
};