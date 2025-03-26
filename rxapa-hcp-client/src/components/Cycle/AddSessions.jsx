import { React, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import AppButton from "../Button/Button";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import Constants from "../Utils/Constants";
import AddSession from "./AddSession";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import useToken from "../Authentication/useToken";
import Modal from "../Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

let sessionNames = [];

/**
 * Adds sessions to a weekly cycle.
 * @param {*} param0
 * @returns
 */
export default function AddSessions({
  setIsAddSession,
  refetchSessions,
  cycle,
  allSessions,
}) {
  const { t } = useTranslation();
  const [selectedSessionNames, setSelectedSessionNames] = useState({
    sessionName1: "",
    sessionName2: "",
    sessionName3: "",
    sessionName4: "",
    sessionName5: "",
    sessionName6: "",
    sessionName7: "",
  });
  const [isSessionsFlexible, setIsSessionFlexible] = useState(false);

  // feedback messga states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const handleChangeIsSessionFlexible = (event) => {
    setIsSessionFlexible(event.target.checked);
  };

  const { token } = useToken();

  sessionNames = allSessions?.map((session) => session.name);

  function getSessionName(day) {
    const { SessionDays } = cycle;
    console.log("THE SESSION DAYS IS ", SessionDays);
    for (let i = 0; i < SessionDays.length; i++) {
      let weekDay = SessionDays[i].weekDay;
      if (weekDay === day) {
        return SessionDays[i].Session.name;
      }
    }
    return "";
  }

  const { handleSubmit } = useForm();

  /**
   * API function call when the submit to add a session is clicked.
   * @param {*} data  - contains start parameter values to add a session
   * to a weekly cycle
   */
  const onSubmit = () => {
    const data = { ...selectedSessionNames, isSessionsFlexible };
    axios
      .post(`${Constants.SERVER_URL}/${cycle.key}/add-session`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // setIsAddSession(false);
        refetchSessions();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  function cancelAddSession() {
    setIsAddSession(false);
  }

  function setSelectedSessionName(sessionName, day) {
    setSelectedSessionNames((preValue) => {
      return {
        ...preValue,
        [day]: sessionName,
      };
    });
  }

  /**
   * Opens modal to provide feedback to the user.
   * @param {*} message - feedback message
   * @param {*} isError - true if it is an error meesage
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

  return (
    <div>
      {/* Dropdown menu to select a day session to be used in the program phase */}
      <div className="input-element">
        <h5>Please select or update Sessions</h5>
      </div>

      {/* Day 1 session */}
      <AddSession
        sessionNames={sessionNames}
        setSelectedSessionName={setSelectedSessionName}
        sessionDayName={getSessionName("DAY_ONE")}
        day={"sessionName1"}
        label={"Select a session for day one"}
      />

      {/* Day 2 session */}
      <AddSession
        sessionNames={sessionNames}
        setSelectedSessionName={setSelectedSessionName}
        sessionDayName={getSessionName("DAY_TWO")}
        day={"sessionName2"}
        label={"Select a session for day two"}
      />

      {/* Day 3 session */}
      <AddSession
        sessionNames={sessionNames}
        setSelectedSessionName={setSelectedSessionName}
        sessionDayName={getSessionName("DAY_THREE")}
        day={"sessionName3"}
        label={"Select a session for day three"}
      />

      {/* Day 4 session */}
      <AddSession
        sessionNames={sessionNames}
        setSelectedSessionName={setSelectedSessionName}
        sessionDayName={getSessionName("DAY_FOUR")}
        day={"sessionName4"}
        label={"Select a session for day four"}
      />

      {/* Day 5 session */}
      <AddSession
        sessionNames={sessionNames}
        setSelectedSessionName={setSelectedSessionName}
        sessionDayName={getSessionName("DAY_FIVE")}
        day={"sessionName5"}
        label={"Select a session for day five"}
      />

      {/* Day 6 session */}
      <AddSession
        sessionNames={sessionNames}
        setSelectedSessionName={setSelectedSessionName}
        sessionDayName={getSessionName("DAY_SIX")}
        day={"sessionName6"}
        label={"Select a session for day six"}
      />

      {/* Day 7 session */}
      <AddSession
        sessionNames={sessionNames}
        setSelectedSessionName={setSelectedSessionName}
        sessionDayName={getSessionName("DAY_SEVEN")}
        day={"sessionName7"}
        label={"Select a session for day seven"}
      />

      <form
        onSubmit={handleSubmit(() => {
          onSubmit();
        })}
      >
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={isSessionsFlexible}
                onChange={handleChangeIsSessionFlexible}
                inputProps={{ "aria-label": "controlled" }}
                color={"secondary"}
                size={"large"}
              />
            }
            label="Flexible"
            labelPlacement="end"
          />
          {"  "}
          <AppButton
            displayText={"SUBMIT"}
            variant={"contained"}
            endIcon={<SendIcon />}
            type={"submit"}
          />
          <AppButton
            displayText={"CLOSE"}
            variant={"contained"}
            endIcon={<ClearSharpIcon />}
            color={"secondary"}
            onClick={cancelAddSession}
            type={"button"}
          />
        </div>
      </form>
      {isOpenModal && (
        <Modal
          closeModal={closeModal}
          message={message}
          isErrorMessage={isErrorMessage}
        />
      )}
    </div>
  );
}
AddSessions.propTypes = {
  setIsAddSession: PropTypes.func.isRequired,
  refetchSessions: PropTypes.func.isRequired,
  cycle: PropTypes.object.isRequired,
  allSessions: PropTypes.array.isRequired,
};
