import React from "react";
import { Button, Popconfirm, message } from "antd";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { CheckOutlined, StopOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "./ProgramStyles.css";


ToggleProgramButton.propTypes = {
  program: PropTypes.shape({
    actif: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default function ToggleProgramButton({ program, onToggle }) {
  const { token } = useToken();

  const toggleProgram = async () => {
    try {
      const res = await axios.patch(
        `${Constants.SERVER_URL}/programs/${program.key}/toggle`,
        { actif: !program.actif },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      message.success(res.data.message);
      onToggle(); // pour recharger la liste si nécessaire
    } catch (err) {
      message.error(err?.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <Popconfirm
      title={
        program.actif
          ? "Voulez-vous désactiver ce programme ?"
          : "Voulez-vous activer ce programme ?"
      }
      onConfirm={toggleProgram}
      okText="Oui"
      cancelText="Annuler"
    >
      <Button
      icon={program.actif ? <StopOutlined /> : <CheckOutlined />}
      type={program.actif ? "default" : "primary"}
      danger={program.actif}
      className={`toggle-program-button ${program.actif ? "active" : "inactive"}`}
    >
      {program.actif ? "Désactiver" : "Activer"}
      </Button>

    </Popconfirm>
  );
}





