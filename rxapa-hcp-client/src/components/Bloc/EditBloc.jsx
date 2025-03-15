
import { Button, Input, Form, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";
import BlocDetails from "./BlocDetails"; 
import { Modal } from "antd";



import React, { useState } from "react";

import ExerciseTable from "./ExerciseTable";
import AddExercise from "./AddExercise";

const { Title } = Typography;

export default function EditBloc() {
  const { t } = useTranslation();
  const { blocKey } = useParams(); // Récupère l'ID du bloc depuis l'URL
  const { handleSubmit, control } = useForm();
  const { token } = useToken();
  const navigate = useNavigate();
  const [isAddExercise, setIsAddExercise] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  function addExercise() {
    setIsAddExercise(true);
  }

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
  

  const allExerciseUrl = `${Constants.SERVER_URL}/exercises`;
  const {
    data: allExercises,
    isLoading: isExerciseLoading,
    isError: isExerciseLoadingError,
  } = useQuery(["all-exercises"], () =>
    axios
      .get(allExerciseUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
  );

  const blocUrl = `${Constants.SERVER_URL}/bloc/${blocKey}`;
  const { data: bloc, isLoading, isError, refetch: refetchBloc, } = useQuery(["bloc", blocKey], () =>
    axios.get(blocUrl, {
      headers: { Authorization: "Bearer " + token },
    }).then((res) => res.data)
  );

  if (isLoading) return <h1>{t("Blocs:loading")}</h1>;
  if (isError) return <h1>{t("Blocs:loading_error")}</h1>;

  const onSubmit = (data) => {
    axios.put(`${Constants.SERVER_URL}/update-bloc/${blocKey}`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      refetchBloc();
      navigate("/blocs"); // Retourner à la liste des blocs après l'édition
    })
    .catch((err) => console.error("Update error:", err));
  };



  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Title level={3}>{t("Blocs:edit_bloc")}</Title>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label={t("Blocs:new_bloc_name")}>
          <Controller
            name="name"
            control={control}
            defaultValue={bloc.name}
            render={({ field }) => <Input {...field} allowClear />}
          />
        </Form.Item>

        <Form.Item label={t("Blocs:new_description_label")}>
          <Controller
            name="description"
            control={control}
            defaultValue={bloc.description}
            render={({ field }) => <Input.TextArea {...field} rows={4} allowClear />}
          />
        </Form.Item>

        <Form.Item>
        <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
          {t("Blocs:update_button")}
        </Button>
        </Form.Item>
        
        <Form.Item>
        <Button type="default" onClick={() => navigate("/blocs")} style={{ marginLeft: 8 }}>
          {t("Blocs:cancel_button")}
        </Button>
        </Form.Item>
        </Form>
        
        <div>
        <ExerciseTable exercises={bloc?.Exercise_Blocs} />
        <Button
            type="primary"
            onClick={addExercise}
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
      

    </div>
 
    



  
  );
}

