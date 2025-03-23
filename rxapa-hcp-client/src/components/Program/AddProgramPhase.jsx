import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "react-hook-form";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import AppButton from "../Button/Button";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import Modal from "../Modal/Modal";

let phaseNames = [];

export default function AddProgramPhase(props) {
  const [selectedPhaseName, setSelectedPhaseName] = useState(null);
  const [displayedPhaseName, setDisplayedPhaseName] = useState("");
  const { token } = useToken();

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  phaseNames = props.allProgramPhases?.map((phase) => phase.name);

  const { handleSubmit } = useForm();

  /**
   * API function call when the submit to add a program phase is clicked.
   * @param {*} data  -
   */
  const onSubmit = () => {
    const data = {
      phaseName: selectedPhaseName,
    };
    axios
      .post(`${Constants.SERVER_URL}/${props.program.key}/add-phase`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // props.setIsAddProgramPhase(false);
        props.refetchProgramPhases();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response?.data?.message, true));
  };

  function cancelAddPhase() {
    props.setIsAddProgramPhase(false);
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
        <h5>Please select a program phase</h5>

        <Autocomplete
          value={selectedPhaseName}
          onChange={(event, newValue) => {
            setSelectedPhaseName(newValue);
          }}
          inputValue={displayedPhaseName}
          onInputChange={(event, newInputValue) => {
            setDisplayedPhaseName(newInputValue);
          }}
          options={phaseNames}
          // sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label=" Select a Program Phase" />
          )}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-element">
          <AppButton
            displayText={"CLOSE"}
            variant={"contained"}
            endIcon={<ClearSharpIcon />}
            color={"secondary"}
            onClick={cancelAddPhase}
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

      <div style={{ height: "2rem" }}></div>

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
