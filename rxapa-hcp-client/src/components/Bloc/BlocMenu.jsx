import React, { useState } from "react";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row, Button, Modal } from "antd";
import Constants from "../Utils/Constants";
import Bloc from "./Bloc";
import CreateBloc from "./CreateBloc";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BlocDetails from "./BlocDetails";
import useToken from "../Authentication/useToken";
import { t } from "i18next";

export default function BlocMenu() {
  const [buttonState, setButtonState] = useState({
    isCreateBloc: false,
    isEditBloc: false,
    isViewBloc: false,
  });

  const [selectedBloc, setSelectedBloc] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

  const blocsUrl = `${Constants.SERVER_URL}/blocs`;
  console.log(blocsUrl);

  const { data: blocList, refetch: refetchBlocs } = useQuery(["blocs"], () => {
    return axios
      .get(blocsUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res.data);
  });

  function handleButtonState(action) {
    setButtonState(() => {
      if (action === "create-bloc") {
        return { isCreateBloc: true, isEditBloc: false, isViewBloc: false };
      } else if (action === "edit-bloc") {
        return { isCreateBloc: false, isEditBloc: true, isViewBloc: false };
      } else if (action === "view-bloc") {
        return { isCreateBloc: false, isEditBloc: false, isViewBloc: true };
      } else {
        return { isCreateBloc: false, isEditBloc: false, isViewBloc: false };
      }
    });
  }

  function handleSelectBloc(bloc) {
    setSelectedBloc(bloc);
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

  function toggleBlocDetails(bloc) {
    if (selectedBloc?.key === bloc.key) {
      setSelectedBloc(null);
      setButtonState({ isCreateBloc: false, isEditBloc: false, isViewBloc: false });
    } else {
      setSelectedBloc(bloc);
      setButtonState({ isCreateBloc: false, isEditBloc: false, isViewBloc: true });
    }
  }

  const deleteBloc = (bloc) => {
    axios
      .delete(`${Constants.SERVER_URL}/delete-bloc/${bloc.key}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        refetchBlocs();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  return (
    <div>
      {!buttonState.isCreateBloc && !buttonState.isEditBloc && (
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleButtonState("create-bloc")}
          >
            {t("Blocs:create_bloc")}
          </Button>

          <Row gutter={[16, 16]}>
            {blocList?.map((bloc) => (
              <Col xs={24} sm={12} md={8} lg={6} key={bloc.key}>
                <Bloc
                  onClick={handleButtonState}
                  onSelect={handleSelectBloc}
                  bloc={bloc}
                  deleteBloc={deleteBloc}
                  selectedBloc={selectedBloc}
                  showBlocDetails={toggleBlocDetails}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {(buttonState.isCreateBloc || buttonState.isEditBloc) && (
        <Row align="middle" justify="space-between" style={{ marginBottom: "20px" }}>
          <Col>
            <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => handleButtonState("")}>
              {t("Blocs:back_button")}
            </Button>
          </Col>
          <Col>
            <h2>
              {buttonState.isCreateBloc ? t("Blocs:create_new_bloc") : t("Blocs:edit_bloc")}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {buttonState.isCreateBloc && <CreateBloc refetchBlocs={refetchBlocs} />}

      {buttonState.isEditBloc && <BlocDetails blocKey={selectedBloc?.key} refetchBlocs={refetchBlocs} />}

      {buttonState.isViewBloc && selectedBloc && <BlocDetails blocKey={selectedBloc.key} refetchBlocs={refetchBlocs} />}

      <Modal
        open={isOpenModal}
        onCancel={closeModal}
        footer={[<Button key="close" onClick={closeModal}>Close</Button>]}
      >
        <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
      </Modal>
    </div>
  );
}