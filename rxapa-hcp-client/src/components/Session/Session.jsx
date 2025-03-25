import React from "react";
import AppButton from "../Button/Button";
import { List } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import "./Styles.css";
import { useState } from "react";
import Modal from "../Modal/Modal";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function Session({ onClick, onSelect, session, deleteSession }) {
  const { t } = useTranslation();
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
        <h3>
          {t("Sessions:session_name")}: {session.name}
        </h3>
        <br></br>
        <h5>
          {t("Sessions:session_description")}: {session.description}
        </h5>
        <br></br>
        <h5>
          {t("Sessions:session_constraints")}: {session.constraints}
        </h5>

        <div>
          <AppButton
            onClick={(event) => {
              // Calls parent onSelect function
              onSelect(session);
              // calls parent onClick function
              onClick(event);
            }}
            name={"edit-session"}
            displayText={t("Sessions:edit_button")}
            variant={"contained"}
            type={"button"}
            size={"medium"}
          />
          <AppButton
            onClick={() => {
              // calls parent function to delete the cycle
              deleteSession(session);
            }}
            displayText={t("Sessions:delete_button")}
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
Session.propTypes = {
  onClick: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  session: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    constraints: PropTypes.string,
  }).isRequired,
  deleteSession: PropTypes.func.isRequired,
};
