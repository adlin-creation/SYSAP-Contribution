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

export default function BlocDetailsModal({ blocKey, refetchBlocs, isVisible, onClose }) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const [isAddExercise, setIsAddExercise] = useState(false);
  const { token } = useToken();

  const blocUrl = `${Constants.SERVER_URL}/bloc/${blocKey}`;
  const { data: bloc, isLoading, isError, refetch: refetchBloc } = useQuery(["bloc-exercises", blocKey], () =>
    axios.get(blocUrl, { headers: { Authorization: "Bearer " + token } }).then((res) => res.data)
  );

  if (isLoading) return null;
  if (isError) return <h1>{t("Blocs:loading_error")}</h1>;

  const onSubmit = (data) => {
    axios.put(`${Constants.SERVER_URL}/update-bloc/${blocKey}`, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(() => {
      refetchBlocs();
      refetchBloc();
      onClose();
    })
    .catch((err) => console.error("Update error:", err));
  };

  return (
    <Modal title={t("Blocs:details_title")} open={isVisible} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label={t("Blocs:new_bloc_name")}>
          <Controller
            name="name"
            control={control}
            defaultValue={bloc.name}
            render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} allowClear />}
          />
        </Form.Item>

        <Form.Item label={t("Blocs:new_description_label")} readonly>
          <Controller
            name="description"
            control={control}
            defaultValue={bloc.description}
            render={({ field: { onChange, value } }) => <Input.TextArea onChange={onChange} value={value} rows={4} allowClear />}
          />
        </Form.Item>

        <ExerciseTable exercises={bloc?.Exercise_Blocs} />

      </Form>

      {isAddExercise && <AddExercise setIsAddExercise={setIsAddExercise} refetchBloc={refetchBloc} bloc={bloc} />}
    </Modal>
  );
}


