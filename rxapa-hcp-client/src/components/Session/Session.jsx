import React from "react";
import AppButton from "../Button/Button";
import { List } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import "./Styles.css";
import { useState } from "react";
import Modal from "../Modal/Modal";

export default function Session({ onClick, onSelect, session, deleteSession }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  function openModal() {
    setIsOpenModal(true);
  }

  function closeModal() {
    setIsOpenModal(false);
  }

  return (
    <div className="day-session">
      <List style={{ textAlign: "center" }}>
        <h3>Name: {session.name}</h3>
        <br></br>
        <h5>Description: {session.description}</h5>
        <br></br>
        <h5>Constraints: {session.constraints}</h5>

        <div>
          <AppButton
            onClick={(event) => {
              // Calls parent onSelect function
              onSelect(session);
              // calls parent onClick function
              onClick(event);
            }}
            name={"edit-session"}
            displayText={"EDIT"}
            variant={"contained"}
            type={"button"}
            size={"medium"}
          />
          <AppButton
            onClick={() => {
              // calls parent function to delete the cycle
              deleteSession(session);
            }}
            displayText={"DELETE"}
            variant={"contained"}
            type={"button"}
            color={"error"}
            startIcon={<DeleteIcon />}
          />
        </div>
      </List>
      {isOpenModal && <Modal closeModal={closeModal} openModal={openModal} />}
    </div>
  );
}
