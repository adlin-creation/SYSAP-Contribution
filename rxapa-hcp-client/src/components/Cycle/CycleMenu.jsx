import React, { useState } from "react";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row, Button } from "antd";
import Cycle from "./Cycle";
import CreateCycle from "./CreateCycle";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import Modal from "../Modal/Modal";
import CycleDetails from "./CycleDetails";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function CycleMenu() {
  const { t } = useTranslation();
  // tracks the state of two buttons: create a cycle and edit a cycle
  const [buttonState, setButtonState] = useState({
    isCreateCycle: false,
    isEditCycle: false,
  });
  // selected cycle to be edited
  const [selectedCycle, setSelectedCycle] = useState(null);

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

  ///////////////////////////////////
  // DATA QUERY FOR Cycles        ///
  //////////////////////////////////

  // url to retrieve all sessions
  const cycleUrl = `${Constants.SERVER_URL}/cycles`;
  // cycles is a unique name for this query
  const { data: cycleList, refetch: refetchCycles } = useQuery(
    ["cycles"],
    () => {
      return axios
        .get(cycleUrl, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          return res.data;
        });
    }
  );

  /**
   * Handles button event, which represents either create a
   * session or edit a session.
   * @param {*} event - the event object
   */
  function handleButtonState(event) {
    const { name } = event.currentTarget;
    setButtonState(() => {
      if (name === "create-cycle") {
        return {
          isCreateCycle: true,
          isEditCycle: false,
        };
      } else if (name === "edit-cycle") {
        return {
          isCreateCycle: false,
          isEditCycle: true,
        };
      } else {
        return {
          isCreateCycle: false,
          isEditCycle: false,
        };
      }
    });
  }

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

  function handleSelectCycle(cycle) {
    setSelectedCycle(cycle);
  }

  /**
   * Deletes a weekly cycle
   */
  const deleteCycle = (cycle) => {
    axios
      .delete(`${Constants.SERVER_URL}/delete-cycle/${cycle.key}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchCycles();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  return (
    <div>
      {/* display cycles when neither create nor edit day cycle is clicked */}
      {!buttonState.isCreateCycle && !buttonState.isEditCycle && (
        <div>
          {/* creates a session button */}
          <Button
            onClick={handleButtonState}
            name="create-cycle"
            type="primary"
            icon={<PlusOutlined />}
          >
            {t("create_cycle")}
          </Button>

          {/* Display exisitng cycles */}
          <Row gutter={[16, 16]}>
            {cycleList?.map((cycle) => {
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={cycle.key}>
                  <Cycle
                    onClick={handleButtonState}
                    onSelect={handleSelectCycle}
                    cycle={cycle}
                    deleteCycle={deleteCycle}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {/* Shows the back button if create cycle button is clicked */}
      {(buttonState.isCreateCycle || buttonState.isEditCycle) && (
        <Row align="middle" justify="space-between" style={{ marginBottom: '20px' }}>
          <Col>
            <Button
              onClick={handleButtonState}
              name="back"
              type="primary"
              icon={<ArrowLeftOutlined />}
            >
              {t("back")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: 0 }}>
              {buttonState.isCreateCycle 
                ? t("create_new_cycle")
                : `Edit ${selectedCycle?.name}`}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {/* show create session input elements when create day session is clicked */}
      {buttonState.isCreateCycle && (
        <div>
          <CreateCycle refetchCycles={refetchCycles} />
        </div>
      )}

      {/* shows day cycle details when edit day session is clicked */}
      {buttonState.isEditCycle && (
        <CycleDetails cycle={selectedCycle} refetchCycles={refetchCycles} />
      )}

      {isOpenModal && (
        <Modal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              {t("close")}
            </Button>,
          ]}
          style={{ 
            color: isErrorMessage ? '#ff4d4f' : '#52c41a'
          }}
        >
          <p>{message}</p>
        </Modal>
      )}
    </div>
  );
}
