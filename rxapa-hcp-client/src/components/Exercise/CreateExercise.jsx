import React, { useState } from "react";
import PropTypes from 'prop-types'; // Import de PropTypes
import { Col, Input, Button, Form, Modal, Select, Checkbox } from "antd";
import { Controller, useForm } from "react-hook-form";
import { SendOutlined } from '@ant-design/icons'; // Import de l'icône
import "./Styles.css";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";

export default function CreateExercise(props) {
  const { handleSubmit, control } = useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedExerciseCategory, setSelectedExerciseCategory] = useState(null);
  //const [displayedExerciseCategory, setDisplayedExerciseCategory] = useState("");

  //const [displayedTargetAgeRange, setDisplayedTargetAgeRange] = useState("");
  ///const [selectedTargetAgeRange, setSelectedTargetAgeRange] = useState(null);

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
      instructionalVideo: " ",
      isSeating: isSeatingExercise,
      category: selectedExerciseCategory,
      targetAgeRange: " ",
      fitnessLevel: selectedFitnessLevel,
      exerciseImage: exerciseImage,
    };
    console.log("Submitting Data:", combinedData); 
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
        const errorMessage = err.response ? err.response.data.message : "An error occurred";
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

          <Form.Item label="Veuillez entrer le nom de l'exercice : " className="input-element">
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Nom de l'exercice"
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Veuillez sélectionner la catégorie : " className="input-element">
            <Select
              value={selectedExerciseCategory}
              onChange={(value) => setSelectedExerciseCategory(value)}
              placeholder="Sélectionnez la catégorie"
              style={{ width: '100%' }}
              allowClear
            >
              {["Aérobic", "Endurance", "Force", "Flexibilité", "Équilibre"].map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Veuillez sélectionner le niveau de forme physique attendu : " className="input-element">
            <Select
              value={selectedFitnessLevel}
              onChange={(value) => setSelectedFitnessLevel(value)}
              placeholder="Niveau de forme physique attendu"
              style={{ width: '100%' }}
              allowClear
            >
              {["Facile","Intermédiaire","Avancé"].map((level) => (
                <Select.Option key={level} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Veuillez entrer la description de l'exercice : " className="input-element">
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder="Description de l'exercice"
                  rows={4}
                />
              )}
            />
          </Form.Item>
          {/* 
          <Form.Item label="Please enter the instructional video of the exercise : " className="input-element">
            <Controller
              name="instructionalVideo"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Exercise Instructional Video"
                />
              )}
            />
          </Form.Item>
          */}
          <Form.Item label="Exercise Image : " className="input-element">
            <input type="file" accept="image/*" onChange={onChangeImage} />
          </Form.Item>

          <Form.Item className="input-element">
            <Checkbox
              checked={isSeatingExercise}
              onChange={handleChange}
            >
              Seating Exercise
            </Checkbox>
          </Form.Item>

          <Form.Item className="input-element">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />} // Utilisation de l'icône Ant Design
            >
              SUBMIT
            </Button>
          </Form.Item>
        </Form>
        {isOpenModal && (
          <Modal
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                Close
              </Button>,
            ]}
          >
            <p style={{ color: isErrorMessage ? 'red' : 'black' }}>{message}</p>
          </Modal>
        )}
      </Col>
    </div>
  );
}

CreateExercise.propTypes = {
  refetchExercises: PropTypes.func.isRequired, // Validation de la prop refetchExercises
};