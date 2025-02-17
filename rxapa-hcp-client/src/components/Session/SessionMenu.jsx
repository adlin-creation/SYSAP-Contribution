import React, { useState } from "react";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row, Button, Modal } from "antd";
import Session from "./Session";
import CreateSession from "./CreateSession";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import "../MainMenu/MainMenu.css";
import SessionDetails from "./SessionDetails";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function SessionList(props) {
  const { t } = useTranslation();
  // tracks the state of two buttons: create a session and edit a day session
  const [buttonState, setButtonState] = useState({
    isCreateSession: false,
    isEditSession: false,
  });

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  // selected session to be edited
  const [selectedSession, setSelectedSession] = useState(null);

  const { token } = useToken();

  //////////////////////////////////
  // DATA QUERY FOR DAY SESSIONS ///
  //////////////////////////////////

  // url to retrieve all sessions
  const sessionUrl = `${Constants.SERVER_URL}/sessions`;
  // sessions is a unique name for this query
  const {
    data: sessionList,
    isLoading: isSessionLoading,
    isError: isSessionLoadingError,
    refetch: refetchSessions,
  } = useQuery(["sessions"], () => {
    return axios
      .get(sessionUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  /////////////////////////////////////
  /// SESSION QUERY VALIDATIONS ///
  /////////////////////////////////////
  if (isSessionLoading) {
    return <h1>Sessions Loading...</h1>;
  }
  if (isSessionLoadingError) {
    return <h1>Sorry, an error occured while loading sessions</h1>;
  }

  /**
   * Handles button event, which represents either create a
   * session or edit a session.
   * @param {*} event - the triggered event of the button
   */
  function handleButtonState(event) {
    const { name } = event.target;

    setButtonState(() => {
      if (name === "create-session") {
        return {
          isCreateSession: true,
          isEditSession: false,
        };
      } else if (name === "edit-session") {
        return {
          isCreateSession: false,
          isEditSession: true,
        };
      } else {
        return {
          isCreateSession: false,
          isEditSession: false,
        };
      }
    });
  }

  /**
   * Opens modal to provide feedback to the user.
   * @param {*} message - feedback message
   * @param {*} isError - true if it is an error meesage
   */
  function openModal(message, isError) {
    setMessage(message);
    setIsOpenModal(true);
  }

  /**
   * Close the modal
   */
  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
  }

  function handleSelectSession(session) {
    setSelectedSession(session);
  }

  const deleteSession = (session) => {
    axios
      .delete(`${Constants.SERVER_URL}/delete-session/${session.key}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchSessions();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  return (
    <div>
      {/* display sessions when neither create nor edit day session is clicked */}
      {!buttonState.isCreateSession && !buttonState.isEditSession && (
        <div>
          {/* creates a session button */}
          <Button
            onClick={handleButtonState}
            name={"create-session"}
            type="primary"
            icon={<PlusOutlined />}
          >
            {t("create_session")}
          </Button>

          {/* Display exisitng sessions */}
          <Row>
            {sessionList?.map((session) => {
              return (
                <Col sm={6} md={4} lg={3}>
                  <Session
                    onClick={handleButtonState}
                    onSelect={handleSelectSession}
                    session={session}
                    deleteSession={deleteSession}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {/* Shows the back button if create session button is clicked */}
      {(buttonState.isCreateSession || buttonState.isEditSession) && (
        <Button
          onClick={handleButtonState}
          type="primary"
          icon={<ArrowLeftOutlined />}
        >
          {t("back")}
        </Button>
      )}

      {/* show create session input elements when create day session is clicked */}
      {buttonState.isCreateSession && (
        <div>
          <h3>{t("session_details_title")}</h3>
          <CreateSession refetchSessions={refetchSessions} />
        </div>
      )}

      {/* shows day session details when edit day session is clicked */}
      {buttonState.isEditSession && (
        <SessionDetails sessionKey={selectedSession.key} />
      )}
      <Modal open={isOpenModal} onCancel={closeModal} footer={null}>
        <p>{message}</p>
      </Modal>
    </div>
  );
}
