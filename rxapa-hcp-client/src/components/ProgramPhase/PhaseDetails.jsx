import { React, useState } from "react";
import { Row, Col, Input, Modal, Select } from "antd";
import { useForm } from "react-hook-form";
import axios from "axios";
import AppButton from "../Button/Button";
import { CheckOutlined } from "@ant-design/icons";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import "./Styles.css";
import { useTranslation } from "react-i18next";

export default function PhaseDetail({ programPhase, refetchPhases }) {
  const { handleSubmit } = useForm();
  const { t } = useTranslation();

  const [selectedStartConditionType, setselectedStartConditionType] =
    useState(null);

  const [selectedEndConditionType, setselectedEndConditionType] =
    useState(null);

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

  const [phaseAttributes, setPhaseAttributes] = useState({
    name: "",
    startConditionValue: "",
    endConditionValue: "",
    frequency: 0,
  });

  function setPhaseAttribute(attribute, value) {
    setPhaseAttributes((preValue) => {
      return {
        ...preValue,
        [attribute]: value,
      };
    });
  }

  /**
   *
   * updates program phase
   */
  const onSubmit = () => {
    const combinedData = {
      name: phaseAttributes.name,
      startConditionType: selectedStartConditionType,
      startConditionValue: phaseAttributes.startConditionValue,
      endConditionType: selectedEndConditionType,
      endConditionValue: phaseAttributes.endConditionValue,
      frequency: phaseAttributes.frequency,
    };
    axios
      .put(
        `${Constants.SERVER_URL}/update-phase/${programPhase.key}`,
        combinedData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        // update the list of exercises
        refetchPhases();
        openModal(res.data.message, false);
      })
      .catch((err) => {
        openModal(err.response?.data?.message, true);
      });
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
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        // display: "flex",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("Phases:phase_name_label")}</label>
              <h5>{programPhase.name}</h5>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("Phases:update_phase_name_title")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("name", event.target.value);
                }}
                placeholder={t("Phases:phase_name_placeholder")}
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("Phases:start_condition_type_label")}</label>
              <body>{programPhase.startConditionType}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("Phases:update_start_condition_type_title")}</h5>

              <Select
                value={selectedStartConditionType}
                onChange={(value) => {
                  setselectedStartConditionType(value);
                }}
                placeholder={t(
                  "Phases:select_start_condition_type_placeholder"
                )}
                options={[
                  { value: "TimeElapsed", label: "TimeElapsed" },
                  { value: "PerformanceGoal", label: "PerformanceGoal" },
                ]}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("Phases:start_condition_value_label")}</label>
              <body>{programPhase.startConditionValue}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("Phases:update_start_condition_value_title")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("startConditionValue", event.target.value);
                }}
                placeholder={t("Phases:start_condition_value_placeholder")}
                type="number"
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("Phases:end_condition_type_label")}</label>
              <h5>{programPhase.endConditionType}</h5>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("Phases:update_end_condition_type_title")}</h5>

              <Select
                value={selectedEndConditionType}
                onChange={(value) => {
                  setselectedEndConditionType(value);
                }}
                placeholder={t("Phases:select_end_condition_type_placeholder")}
                options={[
                  { value: "TimeElapsed", label: "TimeElapsed" },
                  { value: "PerformanceGoal", label: "PerformanceGoal" },
                ]}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("Phases:end_condition_value_label")}:</label>
              <body>{programPhase.endConditionValue}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("Phases:update_end_condition_value_title")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("endConditionValue", event.target.value);
                }}
                placeholder={t("Phases:end_condition_value_placeholder")}
                type="number"
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("Phases:frequency_label")}</label>
              <body>{programPhase.frequency}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className={"input-element"}>
              <h5>{t("Phases:update_frequency_title")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("frequency", event.target.value);
                }}
                placeholder={t("Phases:frequency_placeholder")}
                // required
              />

              <AppButton
                displayText={t("Phases:update_button")}
                variant={"contained"}
                endIcon={<CheckOutlined />}
                type={"submit"}
              />
            </div>
          </Col>
        </Row>
      </form>
      <Modal open={isOpenModal} onCancel={closeModal} footer={null}>
        <p>{message}</p>
      </Modal>
    </div>
  );
}
