<<<<<<< HEAD
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "react-hook-form";
// import * as yup from "yup";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import AppButton from "../Button/Button";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import Modal from "../Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

let blocNames = [];

export default function AddBloc({
  session,
  blocList,
  setIsAddBloc,
  refetchSession,
}) {
  const [isBlocRequired, setIsBlocRequired] = React.useState(false);
  const [selectedBlocName, setSelectedBlocName] = React.useState(null);
  const [displayedBlocName, setDisplayedBlocName] = React.useState("");
  const [dayTime, setDayTime] = React.useState(null);
  const [displayedDayTime, setDisplayedDayTime] = React.useState("");

  // feedback message states
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const { token } = useToken();

  const handleChange = (event) => {
    setIsBlocRequired(event.target.checked);
  };

  function cancelAddBloc() {
    setIsAddBloc(false);
  }

  blocNames = blocList?.map((bloc) => bloc.name);

  const { handleSubmit } = useForm();
  const { t } = useTranslation("Sessions");
  /**
   * API function call when the submit to add a bloc is clicked.
   * @param {*} data  - contains start parameter values to add a bloc
   * to a session
   */
  const onSubmit = () => {
    const data = {
      blocName: selectedBlocName,
      required: isBlocRequired,
      dayTime: dayTime,
    };
    axios
      .post(`${Constants.SERVER_URL}/${session.key}/add-bloc`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchSession();
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
      {/* Dropdown menu to select an exercise to be used in the day session */}
      <div className="input-element">
        <h5>{t("title_select_a_bloc")}</h5>

        <Autocomplete
          value={selectedBlocName}
          onChange={(event, newValue) => {
            setSelectedBlocName(newValue);
          }}
          inputValue={displayedBlocName}
          onInputChange={(event, newInputValue) => {
            setDisplayedBlocName(newInputValue);
          }}
          options={blocNames}
          // sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label={t("label_select_a_bloc")} />
          )}
        />
      </div>

      <div className="input-element">
        <h5>{t("title_select_day_time")}</h5>

        <Autocomplete
          // className="input-element"
          value={dayTime}
          onChange={(event, newValue) => {
            setDayTime(newValue);
          }}
          inputValue={displayedDayTime}
          onInputChange={(event, newInputValue) => {
            setDisplayedDayTime(newInputValue);
          }}
          options={[
            "MORNING",
            "AFTERNOON",
            "EVENING",
            "NIGHT",
            "NOT APPLICABLE",
          ]}
          // sx={{ width: 400 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("label_select_start_condition_type")}
            />
          )}
        />
      </div>

      <div className="input-element">
        <FormControlLabel
          control={
            <Switch
              checked={isBlocRequired}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
              color={"secondary"}
              size={"large"}
            />
          }
          label="Required"
          labelPlacement="end"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-element">
          <AppButton
            displayText={"CANCEL"}
            variant={"contained"}
            endIcon={<ClearSharpIcon />}
            color={"secondary"}
            onClick={cancelAddBloc}
            type={"button"}
          />

          <AppButton
            displayText={"SUBMIT"}
            variant={"contained"}
            endIcon={<SendIcon />}
            type={"submit"}
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
AddBloc.propTypes = {
  session: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  blocList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setIsAddBloc: PropTypes.func.isRequired,
  refetchSession: PropTypes.func.isRequired,
};
=======
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "react-hook-form";
// import * as yup from "yup";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import AppButton from "../Button/Button";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import Modal from "../Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

let blocNames = [];

export default function AddBloc({
  session,
  blocList,
  setIsAddBloc,
  refetchSession,
}) {
  const [isBlocRequired, setIsBlocRequired] = React.useState(false);
  const [selectedBlocName, setSelectedBlocName] = React.useState(null);
  const [displayedBlocName, setDisplayedBlocName] = React.useState("");
  const [dayTime, setDayTime] = React.useState(null);
  const [displayedDayTime, setDisplayedDayTime] = React.useState("");

  // feedback message states
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isErrorMessage, setIsErrorMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const { token } = useToken();

  const handleChange = (event) => {
    setIsBlocRequired(event.target.checked);
  };

  function cancelAddBloc() {
    setIsAddBloc(false);
  }

  blocNames = blocList?.map((bloc) => bloc.name);

  const { handleSubmit } = useForm();
  const { t } = useTranslation("Sessions");
  /**
   * API function call when the submit to add a bloc is clicked.
   * @param {*} data  - contains start parameter values to add a bloc
   * to a session
   */
  const onSubmit = () => {
    const data = {
      blocName: selectedBlocName,
      required: isBlocRequired,
      dayTime: dayTime,
    };
    axios
      .post(`${Constants.SERVER_URL}/${session.key}/add-bloc`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchSession();
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
      {/* Dropdown menu to select an exercise to be used in the day session */}
      <div className="input-element">
        <h5>{t("title_select_a_bloc")}</h5>

        <Autocomplete
          value={selectedBlocName}
          onChange={(event, newValue) => {
            setSelectedBlocName(newValue);
          }}
          inputValue={displayedBlocName}
          onInputChange={(event, newInputValue) => {
            setDisplayedBlocName(newInputValue);
          }}
          options={blocNames}
          // sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label={t("label_select_a_bloc")} />
          )}
        />
      </div>

      <div className="input-element">
        <h5>{t("title_select_day_time")}</h5>

        <Autocomplete
          // className="input-element"
          value={dayTime}
          onChange={(event, newValue) => {
            setDayTime(newValue);
          }}
          inputValue={displayedDayTime}
          onInputChange={(event, newInputValue) => {
            setDisplayedDayTime(newInputValue);
          }}
          options={[
            "MORNING",
            "AFTERNOON",
            "EVENING",
            "NIGHT",
            "NOT APPLICABLE",
          ]}
          // sx={{ width: 400 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("label_select_start_condition_type")}
            />
          )}
        />
      </div>

      <div className="input-element">
        <FormControlLabel
          control={
            <Switch
              checked={isBlocRequired}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
              color={"secondary"}
              size={"large"}
            />
          }
          label="Required"
          labelPlacement="end"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-element">
          <AppButton
            displayText={"CANCEL"}
            variant={"contained"}
            endIcon={<ClearSharpIcon />}
            color={"secondary"}
            onClick={cancelAddBloc}
            type={"button"}
          />

          <AppButton
            displayText={"SUBMIT"}
            variant={"contained"}
            endIcon={<SendIcon />}
            type={"submit"}
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
AddBloc.propTypes = {
  session: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  blocList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setIsAddBloc: PropTypes.func.isRequired,
  refetchSession: PropTypes.func.isRequired,
};
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
