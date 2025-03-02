import React, { useState } from "react";
import PropTypes from "prop-types"; // Import de PropTypes
import { Col, Input, Button, Form, Modal, Select, Checkbox } from "antd";
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

  const [selectedExerciseCategory, setSelectedExerciseCategory] =
    useState(null);
  //const [displayedExerciseCategory, setDisplayedExerciseCategory] = useState("");

  const [selectedTargetAgeRange, setSelectedTargetAgeRange] = useState(null);
  //const [displayedTargetAgeRange, setDisplayedTargetAgeRange] = useState("");

  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null); // Assurez-vous que la valeur initiale est null
  //const [displayedFitnessLevel, setDisplayedFitnessLevel] = useState("");

  const [isSeatingExercise, setIsSeatingExercise] = useState(false);

  const [exerciseImage, setExerciseImage] = useState(null);

  // destructure custom use hook
  const { token } = useToken();

  const handleChange = (event) => {
    setIsSeatingExercise(event.target.checked);
  };

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
    const { name, description, instructionalVideo } = data;
    let formData = new FormData();
    const combinedData = {
      name: name,
      description: description,
      instructionalVideo: instructionalVideo,
      isSeating: isSeatingExercise,
      category: selectedExerciseCategory,
      targetAgeRange: selectedTargetAgeRange,
      fitnessLevel: selectedFitnessLevel,
      exerciseImage: exerciseImage,
    };
    console.log("The exercise object", combinedData);
    formData.append("image", exerciseImage);
    // formData.append("name", combinedData.name);
    // formData.append("description", combinedData.description);
    // formData.append("instructionalVideo", combinedData.instructionalVideo);
    // formData.append("isSeating", combinedData.isSeating);
    // formData.append("category", combinedData.category);
    // formData.append("targetAgeRange", combinedData.targetAgeRange);
    // formData.append("fitnessLevel", combinedData.fitnessLevel);
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
    <div className="form-container">
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Please select the category : "
            className="input-element"
          >
            <Select
              value={selectedExerciseCategory}
              onChange={(value) => setSelectedExerciseCategory(value)}
              placeholder={t("Exercises:exercise_category")}
              style={{ width: "100%" }}
              allowClear
            >
              {["AEROBIC", "STRENGTH", "ENDURANCE", "FLEXIBILITY"].map(
                (category) => (
                  <Select.Option key={category} value={category}>
                    {t(`Exercises:${category.toLowerCase()}`)}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("Exercises:desired_age_group")}
            className="input-element"
          >
            <Select
              value={selectedTargetAgeRange}
              onChange={(value) => setSelectedTargetAgeRange(value)}
              placeholder={t("Exercises:select_target_age_range")}
              style={{ width: "100%" }}
              allowClear
            >
              {[
                "FIFTY_TO_FIFTY_NINE",
                "SIXTY_TO_SIXTY_NINE",
                "SEVENTY_TO_SEVENTY_NINE",
                "EIGHTY_TO_EIGHTY_NINE",
              ].map((ageRange) => (
                <Select.Option key={ageRange} value={ageRange}>
                  {t(`Exercises:${ageRange.toLowerCase()}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("Exercises:select_expected_fitness_level")}
            className="input-element"
          >
            <Select
              value={selectedFitnessLevel}
              onChange={(value) => setSelectedFitnessLevel(value)}
              placeholder={t("Exercises:select_expected_fitness_level")}
              style={{ width: "100%" }}
              allowClear
            >
              {["LOW", "BELOW_AVERAGE", "AVERAGE", "ABOVE_AVERAGE", "HIGH"].map(
                (level) => (
                  <Select.Option key={level} value={level}>
                    {t(`Exercises:${level.toLowerCase()}`)}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("Exercises:enter_exercise_name")}
            className="input-element"
          >
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

          <Form.Item
            label={t("Exercises:enter_exercise_description")}
            className="input-element"
          >
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

          <Form.Item
            label={t("Exercises:enter_exercise_video")}
            className="input-element"
          >
            <Controller
              name="instructionalVideo"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Exercises:exercise_video")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t("Exercises:exercise_image")}
            className="input-element"
          >
            <input type="file" accept="image/*" onChange={onChangeImage} />
          </Form.Item>

          <Form.Item className="input-element">
            <Checkbox checked={isSeatingExercise} onChange={handleChange}>
              {t("Exercises:seating_exercise")}
            </Checkbox>
          </Form.Item>

          <Form.Item className="input-element">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />} // Utilisation de l'icône Ant Design
            >
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
  );
}

CreateExercise.propTypes = {
  refetchExercises: PropTypes.func.isRequired, // Validation de la prop refetchExercises
};
