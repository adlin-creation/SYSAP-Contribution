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
  const { t } = useTranslation("Sessions");
  const [isOpenModal, setIsOpenModal] = useState(false);

  function openModal() {
    setIsOpenModal(true);
  }

  function closeModal() {
    setIsOpenModal(false);
  }

  // Extract day and clean description
  const match = session.description?.match(
    /^\[(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\] (.*)$/
  );
  const day = match ? match[1] : null;
  const cleanDescription = match ? match[2] : session.description;

  return (
    <div className="day-session">
      <List style={{ textAlign: "center" }}>
        <h5>{t("title_session_name")}</h5>
        <div>{session.name}</div>

        <h5>{t("title_session_description")}</h5>
        <div>{cleanDescription}</div>

        <h5>{t("title_day_of_week")}</h5>
        <div>
          {day ? day.charAt(0).toUpperCase() + day.slice(1) : "Non spécifié"}
        </div>

        <h5>{t("title_session_constraints")}</h5>
        <div>{session.constraints}</div>

        <div>
          <AppButton
            onClick={(event) => {
              // Calls parent onSelect function
              onSelect(session);
              // calls parent onClick function
              onClick(event);
            }}
            name={"edit-session"}
            displayText={t("button_edit")}
            variant={"contained"}
            type={"button"}
            size={"medium"}
          />
          <AppButton
            onClick={() => {
              // calls parent function to delete the cycle
              deleteSession(session);
            }}
            displayText={t("button_delete")}
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
