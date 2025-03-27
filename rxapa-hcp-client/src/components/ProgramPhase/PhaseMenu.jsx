import React, { useState } from "react";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row, Button, Modal } from "antd";
import Phase from "./Phase";
import CreatePhase from "./CreatePhase";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import "../MainMenu/MainMenu.css";
import PhaseDetails from "./PhaseDetails";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function PhaseMenu() {
  // tracks the state of two buttons: create a cycle and edit a cycle
  const [buttonState, setButtonState] = useState({
    isCreatePhase: false,
    isEditPhase: false,
  });

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();
  const { t } = useTranslation("Phases");

  // selected program phase to be edited
  const [selectedPhase, setSelectedPhase] = useState(null);

  ////////////////////////////////////
  // DATA QUERY FOR Program Phases ///
  ///////////////////////////////////

  // url to retrieve all phases
  const phaseUrl = `${Constants.SERVER_URL}/phases`;
  // phases is a unique name for this query
  const {
    data: phaseList,
    isLoading: isPhaseLoading,
    isError: isPhaseLoadingError,
    refetch: refetchPhases,
  } = useQuery(["phases"], () => {
    return axios
      .get(phaseUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  ///////////////////////////////////
  // DATA QUERY FOR Cycles        ///
  //////////////////////////////////
  // url to retrieve all sessions
  const cycleUrl = `${Constants.SERVER_URL}/cycles`;
  // cycles is a unique name for this query
  const { data: cycleList } = useQuery(["cycles"], () => {
    return axios
      .get(cycleUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  /////////////////////////////////////
  /// PROGRAM PHASE QUERY VALIDATIONS ///
  /////////////////////////////////////
  if (isPhaseLoading) {
    return <h1>{t("loading_program_phases")}</h1>;
  }
  if (isPhaseLoadingError) {
    return <h1>{t("error_loading_program_phases")}</h1>;
  }

  /**
   * Handles button event, which represents either create a
   * session or edit a session.
   * @param {*} event - the triggered event of the button
   */
  function handleButtonState(event) {
    const { name } = event.target;

    setButtonState(() => {
      if (name === "create-phase") {
        return {
          isCreatePhase: true,
          isEditPhase: false,
        };
      } else if (name === "edit-phase") {
        return {
          isCreatePhase: false,
          isEditPhase: true,
        };
      } else {
        return {
          isCreatePhase: false,
          isEditPhase: false,
        };
      }
    });
  }

  function handleSelectPhase(phase) {
    setSelectedPhase(phase);
  }

  const deletePhase = (phase) => {
    axios
      .delete(`${Constants.SERVER_URL}/delete-phase/${phase.key}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchPhases();
        openModal(t(`Backend:${res.data.message}`), false);
      })
      .catch((err) =>
        openModal(t(`Backend:${err.response.data.message}`), true)
      );
  };

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

  return (
    <div>
      {/* display phases when neither create nor edit day phase is clicked */}
      {!buttonState.isCreatePhase && !buttonState.isEditPhase && (
        <div>
          {/* creates a session button */}
          <Button
            onClick={handleButtonState}
            name={"create-phase"}
            type="primary"
            icon={<PlusOutlined />}
          >
            {t("create_phase")}
          </Button>

          {/* Display exisitng cycles */}
          <Row>
            {phaseList?.map((phase) => {
              return (
                <Col sm={6} md={4} lg={3}>
                  <Phase
                    onClick={handleButtonState}
                    onSelect={handleSelectPhase}
                    phase={phase}
                    deletePhase={deletePhase}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {/* Shows the back button if create cycle button is clicked */}
      {(buttonState.isCreatePhase || buttonState.isEditPhase) && (
        <Button
          onClick={handleButtonState}
          type="primary"
          icon={<ArrowLeftOutlined />}
        >
          {t("back_button")}
        </Button>
      )}

      {/* show create session input elements when create day session is clicked */}
      {buttonState.isCreatePhase && (
        <div>
          <h3>{t("enter_phase_details")}</h3>
          <CreatePhase refetchPhases={refetchPhases} cycleList={cycleList} />
        </div>
      )}

      {/* shows day cycle details when edit day session is clicked */}
      {buttonState.isEditPhase && (
        <PhaseDetails
          programPhase={selectedPhase}
          refetchPhases={refetchPhases}
        />
      )}
      <Modal open={isOpenModal} onCancel={closeModal} footer={null}>
        <p>{message}</p>
      </Modal>
    </div>
  );
}
