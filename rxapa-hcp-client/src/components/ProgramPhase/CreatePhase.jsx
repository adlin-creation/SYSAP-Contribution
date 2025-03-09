import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import AppButton from "../Button/Button";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import Modal from "../Modal/Modal";
import { useTranslation } from "react-i18next";

let cycleNames = [];

export default function CreatePhase(props) {
  const [selectedCycleName, setSelectedCycleName] = useState(null);
  const [displayedCycleName, setDisplayedCycleName] = useState("");
  const { t } = useTranslation();

  const [selectedStartConditionType, setselectedStartConditionType] =
    useState(null);
  const [displayedStartConditionType, setdisplayedStartConditionType] =
    useState("");

  const [selectedEndConditionType, setselectedEndConditionType] =
    useState(null);
  const [displayedEndConditionType, setdisplayedEndConditionType] =
    useState("");

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

  cycleNames = props.cycleList?.map((cycle) => cycle.name);

  const { handleSubmit, control } = useForm();

  /**
   * API function call when the submit to add a program phase is clicked.
   * @param {*} data  - contains start condition type, start condition value, end condition type,
   * end condition value, frequency, and order
   */
  const onSubmit = (data) => {
    // add program name and day session name to the data
    const { name, startConditionValue, endConditionValue, frequency } = data;
    const combinedData = {
      cycleName: selectedCycleName,
      startConditionType: selectedStartConditionType,
      startConditionValue: startConditionValue,
      endConditionType: selectedEndConditionType,
      endConditionValue: endConditionValue,
      frequency: Number(frequency),
      name: name,
    };
    axios
      .post(`${Constants.SERVER_URL}/create-phase`, combinedData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        props.refetchPhases();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
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
      <div className="input-element">
        <h5>{t("Phases:select_cycle")}</h5>

        <Autocomplete
          // className="input-element"
          value={selectedCycleName}
          onChange={(event, newValue) => {
            setSelectedCycleName(newValue);
          }}
          inputValue={displayedCycleName}
          onInputChange={(event, newInputValue) => {
            setDisplayedCycleName(newInputValue);
          }}
          options={cycleNames}
          // sx={{ width: 400 }}
          renderInput={(params) => (
            <TextField {...params} label={t("Phases:select_cycle_name")} />
          )}
        />
      </div>
      <div className="input-element">
        <h5>{t("Phases:select_start_condition_type")}</h5>

        <Autocomplete
          // className="input-element"
          value={selectedStartConditionType}
          onChange={(event, newValue) => {
            setselectedStartConditionType(newValue);
          }}
          inputValue={displayedStartConditionType}
          onInputChange={(event, newInputValue) => {
            setdisplayedStartConditionType(newInputValue);
          }}
          options={["TimeElapsed", "PerformanceGoal"]}
          // sx={{ width: 400 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("Phases:select_start_condition_type")}
            />
          )}
        />
      </div>

      <div className="input-element">
        <h5>{t("Phases:select_end_condition_type")}</h5>

        <Autocomplete
          value={selectedEndConditionType}
          onChange={(event, newValue) => {
            setselectedEndConditionType(newValue);
          }}
          inputValue={displayedEndConditionType}
          onInputChange={(event, newInputValue) => {
            setdisplayedEndConditionType(newInputValue);
          }}
          options={["TimeElapsed", "PerformanceGoal"]}
          // sx={{ width: 400 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("Phases:select_end_condition_type")}
            />
          )}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-element">
          <h5>{t("Phases:enter_program_phase_name")}</h5>
          <Controller
            name={"name"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                label={t("Phases:program_phase_name")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
                multiline
              />
            )}
          />
        </div>

        <div className="input-element">
          <h5>{t("Phases:enter_start_condition_value")}</h5>
          <Controller
            name={"startConditionValue"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                label={t("Phases:start_condition_value")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
                multiline
              />
            )}
          />
        </div>

        <div className="input-element">
          <h5>{t("Phases:enter_end_condition_value")}</h5>
          <Controller
            name={"endConditionValue"}
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                label={t("Phases:end_condition_value")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
              />
            )}
          />
        </div>

        <div className="input-element">
          <h5>{t("Phases:enter_frequency")}</h5>
          <Controller
            name={"frequency"}
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                label={t("Phases:frequency")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
              />
            )}
          />
        </div>

        <div className="input-element">
          <AppButton
            displayText={t("Phases:submit_button")}
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
