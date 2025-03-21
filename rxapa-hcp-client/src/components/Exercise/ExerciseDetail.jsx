import React from "react";
import { Row, Col, Input, Button, Form, Modal, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ReactPlayer from "react-player"; // Import du lecteur vidéo
import "./Styles.css";

export default function ExerciseDetail({ exercise, refetchExercises }) {
  const { t } = useTranslation();
  const { handleSubmit, control, setValue } = useForm();
  const { token } = useToken();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSaveClicked, setIsSaveClicked] = React.useState(false);

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
    if (isSaveClicked) {
      setIsSubmitting(true);
      axios
        .put(`${Constants.SERVER_URL}/update-exercise/${exercise.key}`, data, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          refetchExercises();
          openModal(res.data.message, false);
          setIsSubmitting(false);
        })
        .catch((err) => {
          openModal(err.response.data.message, true);
          setIsSubmitting(false);
        });
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setValue("name", exercise.name);
    setValue("description", exercise.description);
    setValue("category", exercise.category);
    setValue("fitnessLevel", exercise.fitnessLevel);
    setValue("videoUrl", exercise.videoUrl);
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label={t("Exercises:exercise_name")}>
            <Controller
              name="name"
              control={control}
              defaultValue={exercise.name}
              render={({ field }) => <Input {...field} required disabled={!isEditing} />}
            />
          </Form.Item>
          
          <Form.Item label={t("Exercises:category_placeholder")}>
            <Controller
              name="category"
              control={control}
              defaultValue={exercise.category}
              render={({ field }) => (
                <Select {...field} style={{ width: "100%" }} allowClear disabled={!isEditing}>
                  {[t("Exercises:aerobic"), t("Exercises:strength"), t("Exercises:endurance"), t("Exercises:flexibility"), t("Exercises:balance")].map((category) => (
                    <Select.Option key={category} value={category}>{category}</Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label={t("Exercises:exercise_description")}>
            <Controller
              name="description"
              control={control}
              defaultValue={exercise.description}
              render={({ field }) => <Input.TextArea {...field} rows={4} required disabled={!isEditing} />}
            />
          </Form.Item>

          <Form.Item label={t("Exercises:exercise_video")}>
            <Controller
              name="videoUrl"
              control={control}
              defaultValue={exercise.videoUrl}
              render={({ field }) => <Input {...field} required disabled={!isEditing} />}
            />
          </Form.Item>
          
          {exercise.videoUrl && (
            <div style={{ marginTop: 20 }}>
              <ReactPlayer
                url={exercise.videoUrl}
                controls
                width="100%"
                height="400px"
              />
            </div>
          )}

          <Form.Item>
            {!isEditing ? (
              <Button type="primary" onClick={startEditing}>{t("Exercises:modify")}</Button>
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
          <Modal title="Feedback" open={isOpenModal} onCancel={closeModal} footer={[<Button key="close" onClick={closeModal}>{t("Close")}</Button>]}>
            <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
          </Modal>
        )}
      </Col>
    </Row>
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
  }).isRequired,
  refetchExercises: PropTypes.func.isRequired,
};