import React from "react";
import { Row, Col, Input, Button, Form, Modal } from "antd";
import { CheckOutlined } from '@ant-design/icons'; // Ajout de l'importation
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import "./Styles.css";

export default function ExerciseDetail({ exercise, refetchExercises }) {
  const { handleSubmit, control } = useForm();
  const { token } = useToken();

  const [selectedExerciseCategory, setselectedExerciseCategory] =
    React.useState(null);
  const [displayedExerciseCategory, setdisplayedExerciseCategory] =
    React.useState("");

  const [selectedTargetAgeRange, setselectedTargetAgeRange] =
    React.useState(null);
  const [displayedTargetAgeRange, setdisplayedTargetAgeRange] =
    React.useState("");

  const [selectedFitnessLevel, setselectedFitnessLevel] = React.useState(null);
  const [displayedFitnessLevel, setdisplayedFitnessLevel] =
    React.useState("");

  const [selectedIsSeatingExercise, setSelectedIsSeatingExercise] =
    React.useState(null);
  const [
    selectedDisplayedIsSeatingExercise,
    setSelectedDisplayedIsSeatingExercise,
  ] = React.useState("");

  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const [exerciseAttributes, setExerciseAttributes] = React.useState({
    name: "",
    description: "",
    instructionalVideo: "",
    isSeating: false,
  });

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

  function setExerciseAttribute(attribute, value) {
    setExerciseAttributes((prevAttributes) => ({
      ...prevAttributes,
      [attribute]: value,
    }));
  }

  const onSubmit = (data) => {
    axios
      .put(`${Constants.SERVER_URL}/update-exercise/${exercise.key}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchExercises();
        openModal(res.data.message, false);
      })
      .catch((err) => {
        openModal(err.response.data.message, true);
      });
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Exercise Name">
            <Controller
              name="name"
              control={control}
              defaultValue={exercise.name}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Enter another name to update the exercise name"
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Exercise Description">
            <Controller
              name="description"
              control={control}
              defaultValue={exercise.description}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder="Enter another value to edit the description"
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
            >
              UPDATE
            </Button>
          </Form.Item>
        </Form>

        {isOpenModal && (
          <Modal
            title="Feedback"
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                Close
              </Button>,
            ]}
          >
            <p style={{ color: isErrorMessage ? 'red' : 'green' }}>{message}</p>
          </Modal>
        )}
      </Col>
    </Row>
  );
}
