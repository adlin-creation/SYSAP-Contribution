import React, { useState } from "react";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row, Button, Modal } from "antd";
import Constants from "../Utils/Constants";
import Bloc from "./Bloc";
import CreateBloc from "./CreateBloc";
// imports axios for fetching exercise data
import axios from "axios";
// import use query hook to allow us fetch from the server side.
import { useQuery } from "@tanstack/react-query";
import BlocDetails from "./BlocDetails";
import useToken from "../Authentication/useToken";
import { t } from "i18next";

export default function BlocMenu() {
  // tracks the state of two buttons: create a bloc and edit a bloc
  const [buttonState, setButtonState] = useState({
    isCreateBloc: false,
    isEditBloc: false,
  });
  // selected cycle to be edited
  const [selectedBloc, setSelectedBloc] = useState(null);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

  ///////////////////////////////
  // DATA QUERY FOR BLOCS ///
  ///////////////////////////////
  // url to retrieve all blocs
  const blocsUrl = `${Constants.SERVER_URL}/blocs`;
  console.log(blocsUrl);
  // blocs is a unique name for this query
  const { data: blocList, refetch: refetchBlocs } = useQuery(["blocs"], () => {
    return axios
      .get(blocsUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  /**
   * Handles button event, which represents either create a
   * session or edit a session.
   * @param {*} event - the triggered event of the button
   */
  function handleButtonState(action) {
    setButtonState(() => {
      if (action === "create-bloc") {
        return {
          isCreateBloc: true,
          isEditBloc: false,
        };
      } else if (action === "edit-bloc") {
        return {
          isCreateBloc: false,
          isEditBloc: true,
        };
      } else {
        return {
          isCreateBloc: false,
          isEditBloc: false,
        };
      }
    });
  }

  function handleSelectBloc(bloc) {
    setSelectedBloc(bloc);
  }

  /**
   * Opens modal to provide feedback to the user.
   * @param {*} message - feedback message
   * @param {*} isError - true if it is an error message
   */
  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError); // Set the error state here
    setIsOpenModal(true);
  }

  /**
   * Close the modal
   */
  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false); // Reset the error state on modal close
  }

  /**
   * Deletes a bloc
   */
  const deleteBloc = (bloc) => {
    axios
      .delete(`${Constants.SERVER_URL}/delete-bloc/${bloc.key}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchBlocs();
        openModal(res.data.message, false); // Pass false as it's a success
      })
      .catch((err) => openModal(err.response.data.message, true)); // Pass true as it's an error
  };

  return (
    <div>
      {/* display blocs when neither create nor edit day bloc is clicked */}
      {!buttonState.isCreateBloc && !buttonState.isEditBloc && (
        <div>
          {/* creates a bloc button */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleButtonState("create-bloc")}
          >
            {t("Blocs:create_bloc")}
          </Button>

          {/* Display exisitng blocs */}
          <Row gutter={[16, 16]}>
            {blocList?.map((bloc) => {
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={bloc.key}>
                  <Bloc
                    onClick={handleButtonState}
                    onSelect={handleSelectBloc}
                    bloc={bloc}
                    deleteBloc={deleteBloc}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {/* Shows the back button if create bloc button is clicked */}
      {(buttonState.isCreateBloc || buttonState.isEditBloc) && (
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={handleButtonState}
            >
              {t("Blocs:back_button")}
            </Button>
          </Col>
          <Col>
            <h2>
              {buttonState.isCreateBloc
                ? t("Blocs:create_new_bloc")
                : t("Blocs:edit_bloc")}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {/* shows create session input elements when create day session is clicked */}
      {buttonState.isCreateBloc && (
        <div>
          <CreateBloc refetchBlocs={refetchBlocs} />
        </div>
      )}

      {/* shows bloc details when edit bloc is clicked */}
      {buttonState.isEditBloc && (
        <BlocDetails blocKey={selectedBloc.key} refetchBlocs={refetchBlocs} />
      )}

      <Modal
        open={isOpenModal}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        {/* Display different messages based on whether it's an error or success */}
        <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
      </Modal>
    </div>
  );
}
