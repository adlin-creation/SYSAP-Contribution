import React from "react";
import { Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons"; // Import des icônes Ant Design
import Constants from "../Utils/Constants";

import "./ProgramStyles.css";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ToggleProgramButton from "../Program/ToggleProgramButton";


export default function Program({ onClick, onSelect, program, deleteProgram, refetchPrograms }) {
  const { t } = useTranslation();
  return (
    <div className="program">
      <List style={{ textAlign: "center" }}>
        <img
          src={`${Constants.SERVER_URL}${program.image}`}
          alt={program.name}
          style={{ width: "100%", height: "auto", marginBottom: "20px" }}
        />

        <h3>
          {t("Programs:name_title")}: {program.name}
        </h3>
        <br />
        <h5>
          {t("Programs:description_title")}: {program.description}
        </h5>
        <br />
        <h5>
          {t("Programs:duration_title")}: {program.duration}{" "}
          {program.duration_unit}
        </h5>

        <div className="espace-boutton">
          <Button
            onClick={(event) => {
              // calls parent onClick function
              onClick(event);
              // Calls parent onSelect function
              onSelect(program);
            }}
            name="edit-program"
            type="primary"
          >
            {t("Programs:edit_button")}
          </Button>
          <Button
            onClick={() => {
              // calls parent function to delete the cycle
              deleteProgram(program);
            }}
            name="delete-program"
            type="primary"
            danger
            icon={<DeleteOutlined />}
          >
            {t("Programs:delete_button")}
          </Button>

          <ToggleProgramButton program={program} onToggle={refetchPrograms} />

        </div>
      </List>
    </div>
  );
}

Program.propTypes = {
  onClick: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  deleteProgram: PropTypes.func.isRequired,
  refetchPrograms: PropTypes.func.isRequired,
  program: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    duration_unit: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired, // aussi important a cause de .key dans le composant
    actif: PropTypes.bool.isRequired, // aussi nécessaire pour le bouton Activer/Désactiver
  }).isRequired,
};

