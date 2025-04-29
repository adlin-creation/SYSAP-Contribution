<<<<<<< HEAD
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
import PropTypes from "prop-types";

export default function PhaseDetail({ programPhase, refetchPhases }) {
  const { t } = useTranslation("Phases");
  const { handleSubmit } = useForm();

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
        openModal(t(`Backend:${res.data.message}`), false);
      })
      .catch((err) => {
        openModal(t(`Backend:${err.response.data.message}`), true);
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
              <label>{t("label_phase_name")}</label>
              <h5>{programPhase.name}</h5>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_phase_name")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("name", event.target.value);
                }}
                placeholder={t("placeholder_phase_name")}
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("label_start_condition_type")}</label>
              <body>{programPhase.startConditionType}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_start_condition_type")}</h5>

              <Select
                value={selectedStartConditionType}
                onChange={(value) => {
                  setselectedStartConditionType(value);
                }}
                placeholder={t("placeholder_select_start_condition_type")}
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
              <label>{t("label_start_condition_value")}</label>
              <body>{programPhase.startConditionValue}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_start_condition_value")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("startConditionValue", event.target.value);
                }}
                placeholder={t("placeholder_start_condition_value")}
                type="number"
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("label_end_condition_type")}</label>
              <h5>{programPhase.endConditionType}</h5>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_end_condition_type")}</h5>

              <Select
                value={selectedEndConditionType}
                onChange={(value) => {
                  setselectedEndConditionType(value);
                }}
                placeholder={t("placeholder_select_end_condition_type")}
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
              <label>{t("label_end_condition_value")}:</label>
              <body>{programPhase.endConditionValue}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_end_condition_value")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("endConditionValue", event.target.value);
                }}
                placeholder={t("placeholder_end_condition_value")}
                type="number"
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("label_frequency")}</label>
              <body>{programPhase.frequency}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className={"input-element"}>
              <h5>{t("title_update_frequency")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("frequency", event.target.value);
                }}
                placeholder={t("placeholder_frequency")}
                // required
              />

              <AppButton
                displayText={t("button_update")}
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
PhaseDetail.propTypes = {
  refetchPhases: PropTypes.func.isRequired,
  programPhase: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    startConditionType: PropTypes.string,
    startConditionValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    endConditionType: PropTypes.string,
    endConditionValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    frequency: PropTypes.number,
  }).isRequired,
};
=======
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
import PropTypes from "prop-types";

export default function PhaseDetail({ programPhase, refetchPhases }) {
  const { t } = useTranslation("Phases");
  const { handleSubmit } = useForm();

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
        openModal(t(`Backend:${res.data.message}`), false);
      })
      .catch((err) => {
        openModal(t(`Backend:${err.response.data.message}`), true);
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
              <label>{t("label_phase_name")}</label>
              <h5>{programPhase.name}</h5>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_phase_name")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("name", event.target.value);
                }}
                placeholder={t("placeholder_phase_name")}
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("label_start_condition_type")}</label>
              <body>{programPhase.startConditionType}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_start_condition_type")}</h5>

              <Select
                value={selectedStartConditionType}
                onChange={(value) => {
                  setselectedStartConditionType(value);
                }}
                placeholder={t("placeholder_select_start_condition_type")}
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
              <label>{t("label_start_condition_value")}</label>
              <body>{programPhase.startConditionValue}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_start_condition_value")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("startConditionValue", event.target.value);
                }}
                placeholder={t("placeholder_start_condition_value")}
                type="number"
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("label_end_condition_type")}</label>
              <h5>{programPhase.endConditionType}</h5>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_end_condition_type")}</h5>

              <Select
                value={selectedEndConditionType}
                onChange={(value) => {
                  setselectedEndConditionType(value);
                }}
                placeholder={t("placeholder_select_end_condition_type")}
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
              <label>{t("label_end_condition_value")}:</label>
              <body>{programPhase.endConditionValue}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className="input-element">
              <h5>{t("title_update_end_condition_value")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("endConditionValue", event.target.value);
                }}
                placeholder={t("placeholder_end_condition_value")}
                type="number"
                // required
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className={"input-element"}>
              <label>{t("label_frequency")}</label>
              <body>{programPhase.frequency}</body>
            </div>
          </Col>
          <Col span={16}>
            <div className={"input-element"}>
              <h5>{t("title_update_frequency")}</h5>

              <Input
                onChange={async (event) => {
                  setPhaseAttribute("frequency", event.target.value);
                }}
                placeholder={t("placeholder_frequency")}
                // required
              />

              <AppButton
                displayText={t("button_update")}
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
PhaseDetail.propTypes = {
  refetchPhases: PropTypes.func.isRequired,
  programPhase: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    startConditionType: PropTypes.string,
    startConditionValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    endConditionType: PropTypes.string,
    endConditionValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    frequency: PropTypes.number,
  }).isRequired,
};
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
