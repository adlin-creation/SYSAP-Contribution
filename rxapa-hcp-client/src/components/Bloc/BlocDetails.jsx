import React, { useState } from "react";
import { Button, Input, Modal, Form } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import ExerciseTable from "./ExerciseTable";
import AddExercise from "./AddExercise";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";



export default function BlocDetailsModal({
  blocKey,
  refetchBlocs,
  isVisible,
  onClose,
}) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const [isAddExercise, setIsAddExercise] = useState(false);
  const { token } = useToken();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  function addExercise() {
    setIsAddExercise(true);
  }

  const allExerciseUrl = `${Constants.SERVER_URL}/exercises`;
  const {
    data: allExercises,
  } = useQuery(["all-exercises"], () =>
    axios
      .get(allExerciseUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
  );

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

  const blocUrl = `${Constants.SERVER_URL}/bloc/${blocKey}`;
  const {
    data: bloc,
    isLoading,
    isError,
    refetch: refetchBloc,
  } = useQuery(["bloc-exercises", blocKey], () =>
    axios
      .get(blocUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
  );

  const onSubmit = (data) => {
    axios
      .put(`${Constants.SERVER_URL}/update-bloc/${blocKey}`, data, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        refetchBlocs();
        refetchBloc();
        openModal(res.data.message, false);
        onClose(); // Fermer la modal après la mise à jour
      })
      .catch((err) => openModal(err.response?.data?.message || "Error", true));
  };

  if (isLoading) return null;
  if (isError) return <h1>{t("Blocs:loading_error")}</h1>;

  return (
    <Modal
      title={t("Blocs:details_title")}
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label={t("Blocs:new_bloc_name")}>
          <Controller
            name="name"
            control={control}
            defaultValue={bloc.name}
            render={({ field: { onChange, value } }) => (
              <Input onChange={onChange} value={value} allowClear />
            )}
          />
        </Form.Item>

        <Form.Item label={t("Blocs:new_description_label")} readonly>
          <Controller
            name="description"
            control={control}
            defaultValue={bloc.description}
            render={({ field: { onChange, value } }) => (
              <Input.TextArea
                onChange={onChange}
                value={value}
                rows={4}
                allowClear
              />
            )}
          />
        </Form.Item>
        <div>
          <ExerciseTable exercises={bloc?.Exercise_Blocs} />
          <Button
            type="primary"
            onClick={addExercise}
            icon={<PlusOutlined />}
            style={{ marginTop: "16px" }}
          >
            {t("Blocs:add_exercise_button")}
          </Button>
        </div>

        <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
          {t("Blocs:update_button")}
        </Button>

        <Button
          type="primary"
          onClick={() => setIsAddExercise(true)}
          icon={<PlusOutlined />}
          style={{ marginLeft: 8 }}
        >
          {t("Blocs:add_exercise_button")}
        </Button>
      </Form>

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
    </Modal>
  );
}
