import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useForm } from "react-hook-form";
// import * as yup from "yup";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import AppButton from "../Button/Button";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import FilterExercise from "../Exercise/FilterExercise";
import Modal from "../Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Modal as AntdModal } from "antd";


let exerciseNames = [];

export default function AddExercise({
  setIsAddExercise,
  refetchBloc,
  bloc,
  allExercises,
}) {
  const [isExerciseRequired, setIsExerciseRequired] = useState(false);
  const [selectedExerciseName, setSelectedExerciseName] = useState(null);
  const [displayedExerciseName, setDisplayedExerciseName] = useState("");
  const { token } = useToken();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  // Validation before submitting the exercise
  const [pendingExerciseData, setPendingExerciseData] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleChange = (event) => {
    setIsExerciseRequired(event.target.checked);
  };

  // filtering values for exercise list
  const [exerciseAttributes, setExerciseAttributes] = useState({
    fitnessLevel: "ALL",
    category: "ALL",
    ageRange: "ALL",
  });

  function cancelAddExercise() {
    setIsAddExercise(false);
  }

  const {
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm();

  // Intermediate function to validate before submission
  const handleValidationBeforeSubmit = (data) => {
    const { numberOfSeries, numberOfRepetition, restingInstruction, minutes } = data;

    const combinedData = {
      numberOfSeries: Number(numberOfSeries),
      numberOfRepetition: Number(numberOfRepetition),
      restingInstruction: restingInstruction,
      minutes: minutes,
      required: isExerciseRequired,
      exerciseName: selectedExerciseName,
    };

    setPendingExerciseData(combinedData);
    setIsConfirmModalOpen(true);
  };

  const confirmExerciseSubmission = () => {
    onSubmit(pendingExerciseData);
    setIsConfirmModalOpen(false);
    setPendingExerciseData(null);
  };


  // data contains rank and number of series
  const onSubmit = (data) => {
    // add exercise name and day session name to the data
    const { numberOfSeries, numberOfRepetition, restingInstruction, minutes } =
      data;
    const combinedData = {
      numberOfSeries: Number(numberOfSeries),
      numberOfRepetition: Number(numberOfRepetition),
      restingInstruction: restingInstruction,
      minutes: minutes,
      required: isExerciseRequired,
      exerciseName: selectedExerciseName,
    };
    axios
      .post(`${Constants.SERVER_URL}/${bloc.key}/add-exercise`, combinedData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchBloc();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  /**
   * Updates the attribute values for filtering exercises.
   * @param {*} value
   * @param {*} attributeName
   */
  function updateSelectedExercises(value, attributeName) {
    setExerciseAttributes((preVal) => {
      return {
        ...preVal,
        [attributeName]: value,
      };
    });
  }

  // filtered exercise list
  const filteredExercises = allExercises.filter((exercise) => {
    if (
      exerciseAttributes.fitnessLevel !== "ALL" &&
      exerciseAttributes.fitnessLevel !== null &&
      exerciseAttributes.fitnessLevel !== exercise.fitnessLevel
    ) {
      return false;
    }

    if (
      exerciseAttributes.category !== "ALL" &&
      exerciseAttributes.category !== null &&
      exerciseAttributes.category !== exercise.category
    ) {
      return false;
    }

    if (
      exerciseAttributes.ageRange !== "ALL" &&
      exerciseAttributes.ageRange !== null &&
      exerciseAttributes.ageRange !== exercise.targetAgeRange
    ) {
      return false;
    }

    return exercise;
  });

  exerciseNames = filteredExercises?.map((exercise) => exercise.name);

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
      <FilterExercise
        updateSelectedValues={updateSelectedExercises}
      ></FilterExercise>
      {/* Dropdown menu to select an exercise to be used in the bloc */}
      <div className="input-element">
        <h5>{t("Blocs:please_select_exercise")}</h5>

        <Autocomplete
          value={selectedExerciseName}
          onChange={(event, newValue) => {
            setSelectedExerciseName(newValue);
          }}
          inputValue={displayedExerciseName}
          onInputChange={(event, newInputValue) => {
            setDisplayedExerciseName(newInputValue);
          }}
          options={exerciseNames}
          // sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Exercises" />}
        />
      </div>

      <form onSubmit={handleSubmit(handleValidationBeforeSubmit)}>
        <div className="input-element">
          <h5>{t("Blocs:please_enter_number_of_series")}</h5>
          <Controller
            name={"numberOfSeries"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                type="number"
                label={t("Blocs:number_of_series_label")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
              />
            )}
          />
        </div>

        <div className="input-element">
          <h5>{t("Blocs:please_enter_number_of_repetitions")}</h5>
          <Controller
            name={"numberOfRepetition"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                type="number"
                label={t("Blocs:number_of_repetitions_label")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
              />
            )}
          />
        </div>

        <div className="input-element">
          <h5>{t("Blocs:please_enter_number_of_minutes")}</h5>
          <Controller
            name={"minutes"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                type="number"
                label={t("Blocs:number_of_minutes_label")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
              />
            )}
          />
        </div>

        <div className="input-element">
          <h5>{t("Blocs:describe_resting_instruction")}</h5>
          <Controller
            name={"restingInstruction"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                type="string"
                label={t("Blocs:describe_resting_instruction_label")}
                variant="outlined"
                color="secondary"
                fullWidth
                required
              />
            )}
          />
        </div>

        <div className="input-element">
          <FormControlLabel
            control={
              <Switch
                checked={isExerciseRequired}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
                color={"secondary"}
                size={"large"}
              />
            }
            label={t("Blocs:required_label")}
            labelPlacement="end"
          />
        </div>
        <div className="input-element">
          <AppButton
            displayText={t("Blocs:cancel_button")}
            variant={"contained"}
            endIcon={<ClearSharpIcon />}
            color={"secondary"}
            onClick={cancelAddExercise}
            type={"button"}
          />

          <AppButton
            displayText={t("Blocs:submit_button")}
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
      
      <AntdModal // Confirmation modal before submitting the exercise
        title={t("Blocs:confirm_add_exercise_title")}
        open={isConfirmModalOpen}
        onOk={confirmExerciseSubmission}
        onCancel={() => setIsConfirmModalOpen(false)}
        cancelText={t("Blocs:cancel_button")}
      >
        <p>{t("Blocs:confirm_add_exercise_message")}</p>
        <ul>
          <li><strong>{t("Blocs:name_label")}:</strong> {pendingExerciseData?.exerciseName}</li>
          <li><strong>{t("Blocs:number_of_series_label")}:</strong> {pendingExerciseData?.numberOfSeries}</li>
          <li><strong>{t("Blocs:number_of_repetitions_label")}:</strong> {pendingExerciseData?.numberOfRepetition}</li>
          <li><strong>{t("Blocs:number_of_minutes_label")}:</strong> {pendingExerciseData?.minutes}</li>
          <li><strong>{t("Blocs:resting_instruction_label")}:</strong> {pendingExerciseData?.restingInstruction}</li>
        </ul>
      </AntdModal>
    </div>
  );
  
}
AddExercise.propTypes = {
  setIsAddExercise: PropTypes.func.isRequired,
  refetchBloc: PropTypes.func.isRequired,
  bloc: PropTypes.object.isRequired,
  allExercises: PropTypes.array.isRequired,
};
