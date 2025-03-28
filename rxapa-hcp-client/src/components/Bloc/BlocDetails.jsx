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
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
// import ExerciseTable2 from "./ExerciseTable2";


export default function BlocDetails({ blocKey, refetchBlocs }) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const [isAddExercise, setIsAddExercise] = useState(false);
  const { token } = useToken();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  // State to manage confirmation modal before saving
  const [pendingData, setPendingData] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


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

  // Function to validate before saving updates
  const handleValidationBeforeSubmit = (data) => {
    setPendingData(data);
    setIsConfirmModalOpen(true);
  };

  const confirmUpdate = () => {
    onSubmit(pendingData);
    setIsConfirmModalOpen(false);
    setPendingData(null);
  };

  // function to delete an exercise from a bloc
  const handleDeleteExercise = (exerciseId) => {
    axios
      .delete(`${Constants.SERVER_URL}/remove-exercise-from-bloc`, {
        data: {
          blocId: bloc.id,
          exerciseId: exerciseId,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        refetchBloc();
      })
      .catch((err) => {
        openModal(t("Blocs:delete_exercise_error") || "Erreur de suppression", true);
      });
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(handleValidationBeforeSubmit)}>
          <Form.Item label={t("Blocs:new_bloc_name")}>
            <Controller
              name="name"
              control={control}
              defaultValue={bloc.name}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Blocs:enter_new_bloc_name")}
                  allowClear
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("Blocs:new_description_label")}>
            <Controller
              name="description"
              control={control}
              defaultValue={bloc.description}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("Blocs:enter_new_description_placeholder")}
                  allowClear
                  rows={4}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
              {t("Blocs:update_button")}
            </Button>
          </Form.Item>
        </Form>

        <div>
          <ExerciseTable
            exercises={bloc?.Exercise_Blocs}
            onDelete={handleDeleteExercise}
          />
          <Button
            type="primary"
            onClick={addExercise}
            icon={<PlusOutlined />}
            style={{ marginTop: "16px" }}
          >
            {t("Blocs:add_exercise_button")}
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

        <Modal // Confirmation modal before saving bloc changes
          title={t("Blocs:confirm_changes_title")}
          open={isConfirmModalOpen}
          onOk={confirmUpdate}
          onCancel={() => setIsConfirmModalOpen(false)}
          cancelText={t("Blocs:cancel_button")}
        >
          <p>{t("Blocs:confirm_changes_message")}</p>
          <ul>
            <li>
              <strong>{t("Blocs:name_label")}:</strong> {pendingData?.name}
            </li>
            <li>
              <strong>{t("Blocs:description_label")}:</strong> {pendingData?.description}
            </li>
          </ul>
        </Modal>

      </Col>
    </Row>
  );
}

BlocDetails.propTypes = {
  blocKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refetchBlocs: PropTypes.func.isRequired,
};
