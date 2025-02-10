import React, { useState } from "react";
import { Row, Col, Button, Input, Modal, Form } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import ExerciseTable from "./ExerciseTable";
import AddExercise from "./AddExercise";
import useToken from "../Authentication/useToken";
// import ExerciseTable2 from "./ExerciseTable2";

export default function BlocDetails({ blocKey, refetchBlocs }) {
  const { handleSubmit, control } = useForm();
  const [isAddExercise, setIsAddExercise] = useState(false);
  const { token } = useToken();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  function addExercise() {
    setIsAddExercise(true);
  }

  // URL to retrieve all exercises
  const allExerciseUrl = `${Constants.SERVER_URL}/exercises`;
  const {
    data: allExercises,
    isLoading: isExerciseLoading,
    isError: isExerciseLoadingError,
  } = useQuery(["all-exercises"], () => {
    return axios
      .get(allExerciseUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  /**
   * Opens modal to provide feedback to the user.
   * @param {*} message - feedback message
   * @param {*} isError - true if it is an error message
   */
  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

  /**
   * Close the modal
   */
  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  }

  // URL to retrieve bloc with their exercises
  const blocUrl = `${Constants.SERVER_URL}/bloc/${blocKey}`;
  console.log("The URL is ", blocUrl);
  const {
    data: bloc,
    isLoading: isBlocLoading,
    isError: isBlocLoadingError,
    refetch: refetchBloc,
  } = useQuery(["bloc-exercises"], () => {
    return axios
      .get(blocUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  //////////////////////////////////
  /// QUERY VALIDATIONS          ///
  //////////////////////////////////
  if (isBlocLoading) {
    return <h1>Bloc Loading...</h1>;
  }
  if (isBlocLoadingError) {
    return <h1>Sorry, an error occurred while loading the bloc</h1>;
  }

  if (isExerciseLoading) {
    return <h1>Exercises Loading...</h1>;
  }
  if (isExerciseLoadingError) {
    return <h1>Sorry, an error occurred while loading exercises</h1>;
  }

  /**
   * Update bloc details
   */
  const onSubmit = (data) => {
    axios
      .put(`${Constants.SERVER_URL}/update-bloc/${blocKey}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchBlocs();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="New Bloc Name">
            <Controller
              name="name"
              control={control}
              defaultValue={bloc.name}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Enter a new name for the bloc"
                  allowClear
                />
              )}
            />
          </Form.Item>

          <Form.Item label="New Description">
            <Controller
              name="description"
              control={control}
              defaultValue={bloc.description}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder="Enter a new description"
                  allowClear
                  rows={4}
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
              Update
            </Button>
          </Form.Item>
        </Form>

        <div>
          <ExerciseTable exercises={bloc?.Exercise_Blocs} />
          <Button
            type="primary"
            onClick={addExercise}
            icon={<PlusOutlined />}
            style={{ marginTop: '16px' }}
          >
            Add Exercise
          </Button>
        </div>

        {isAddExercise && (
          <AddExercise
            setIsAddExercise={setIsAddExercise}
            refetchBloc={refetchBloc}
            bloc={bloc}
            allExercises={allExercises}
          />
        )}

        {isOpenModal && (
          <Modal
            title="Notification"
            open={isOpenModal}
            onOk={closeModal}
            onCancel={closeModal}
          >
            <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
          </Modal>
        )}
      </Col>
    </Row>
  );
}
