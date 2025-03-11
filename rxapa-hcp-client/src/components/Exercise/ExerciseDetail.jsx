import React from "react";
import { Row, Col, Input, Button, Form, Modal, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"; // Import PropTypes
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

  // Function to open the modal with a message
  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

  // Function to close the modal
  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
    setIsSaveClicked(false); 
  }

  // Submit handler
  const onSubmit = (data) => {
    if (isSaveClicked) {
      setIsSubmitting(true); 

      axios
        .put(`${Constants.SERVER_URL}/update-exercise/${exercise.key}`, data, {
          headers: {
            Authorization: "Bearer " + token,
          },
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

  // Function to enable editing mode and pre-fill fields
  const startEditing = () => {
    setIsEditing(true); 
    setValue("name", exercise.name); 
    setValue("description", exercise.description);
    setValue("category", exercise.category);
    setValue("fitnessLevel", exercise.fitnessLevel);
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Field for exercise name */}
          <Form.Item label={t("Exercises:exercise_name")}>
            <Controller
              name="name"
              control={control}
              defaultValue={exercise.name}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Exercises:exercise_name")}
                  required
                  disabled={!isEditing} 
                />
              )}
            />
          </Form.Item>

          {/* Field for category */}
          <Form.Item label={t("Exercises:category_placeholder")}>
            <Controller
              name="category"
              control={control}
              defaultValue={exercise.category}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={onChange}
                  value={value}
                  placeholder={t("Exercises:category_placeholder")}
                  style={{ width: "100%" }}
                  allowClear
                  disabled={!isEditing} 
                >
                  {[t("Exercises:aerobic"), t("Exercises:strength"), t("Exercises:endurance"), t("Exercises:flexibility"), t("Exercises:balance")].map((category) => (
                    <Select.Option key={category} value={category}>
                      {category}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Field for fitness level */}
          <Form.Item label={t("Exercises:fitness_level_placeholder")}>
            <Controller
              name="fitnessLevel"
              control={control}
              defaultValue={exercise.fitnessLevel}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={onChange}
                  value={value}
                  placeholder={t("Exercises:fitness_level_placeholder")}
                  style={{ width: "100%" }}
                  allowClear
                  disabled={!isEditing} 
                >
                  {[t("Exercises:easy"), t("Exercises:intermediate"), t("Exercises:advanced")].map((level) => (
                    <Select.Option key={level} value={level}>
                      {level}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Field for exercise description */}
          <Form.Item label={t("Exercises:exercise_description")}>
            <Controller
              name="description"
              control={control}
              defaultValue={exercise.description}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("Exercises:exercise_description")}
                  rows={4}
                  required
                  disabled={!isEditing}
                />
              )}
            />
          </Form.Item>

          {/* Button for editing or saving */}
          <Form.Item>
            {!isEditing ? (
              <Button
                type="primary"
                onClick={startEditing} 
              >
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

        {/* Modal after submission */}
        {isOpenModal && (
          <Modal
            title="Feedback"
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
  );
}

// Add PropTypes to validate the props
ExerciseDetail.propTypes = {
  exercise: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    fitnessLevel: PropTypes.string.isRequired,
  }).isRequired,
  refetchExercises: PropTypes.func.isRequired,
};
