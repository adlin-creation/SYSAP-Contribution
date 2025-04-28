import React from "react";
import { Button, Popconfirm, message } from "antd";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { CheckOutlined, StopOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "./ProgramStyles.css";
import { useTranslation } from "react-i18next";

ToggleProgramButton.propTypes = {
  program: PropTypes.shape({
    actif: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default function ToggleProgramButton({ program, onToggle }) {
  const { token } = useToken();
  const { t } = useTranslation("Programs");
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
      message.success(t(`Backend:${res.data.message}`));
      onToggle(); // pour recharger la liste si nécessaire
    } catch (err) {
      message.error(
        t(`Backend:${err?.response?.data?.message}`) || t("error_server")
      );
    }
  };

  return (
    <Popconfirm
      title={
        program.actif
          ? t("title_deactivate_program")
          : t("title_activate_program")
      }
      onConfirm={toggleProgram}
      okText={t("button_yes")}
      cancelText={t("button_cancel")}
    >
      <Button
        icon={program.actif ? <StopOutlined /> : <CheckOutlined />}
        type={program.actif ? "default" : "primary"}
        danger={program.actif}
        className={`toggle-program-button ${
          program.actif ? "active" : "inactive"
        }`}
      >
        {program.actif ? t("button_disable") : t("button_enable")}
      </Button>
    </Popconfirm>
  );
}
