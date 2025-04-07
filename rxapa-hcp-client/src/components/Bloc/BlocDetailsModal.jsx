import React, { useEffect, useState } from "react";
import { Modal, Typography, Alert, Spin } from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import ExerciseTable from "./ExerciseTable";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const BlocDetailsModal = ({ visible, onClose, bloc }) => {
  const { t } = useTranslation("Blocs");
  const { token } = useToken();

  // Requête pour charger le bloc avec ses exercices
  const blocUrl = `${Constants.SERVER_URL}/bloc/${bloc.key}`;
  const {
    data: updatedBloc,
    isLoading,
    isError,
  } = useQuery(
    ["bloc-exercises", bloc.key],
    () => {
      return axios
        .get(blocUrl, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => res.data);
    },
    { enabled: visible }
  ); // Exécuter seulement quand le modal s'ouvre

  return (
    <Modal
      title={
        <Title level={3}>
          {bloc.name} - {t("title_exercises")}
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Text>{bloc.description}</Text>

      {/* Affichage du chargement */}
      {isLoading && (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      )}

      {/* Affichage des erreurs */}
      {isError && (
        <Alert
          message={t("title_error_loading_exercises")}
          type="error"
          showIcon
        />
      )}

      {/* Affichage des exercices */}
      {!isLoading && !isError && updatedBloc?.Exercise_Blocs?.length > 0 ? (
        <ExerciseTable exercises={updatedBloc.Exercise_Blocs} />
      ) : (
        !isLoading &&
        !isError && (
          <Alert message={t("alert_no_exercise_found")} type="info" showIcon />
        )
      )}
    </Modal>
  );
};

BlocDetailsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bloc: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default BlocDetailsModal;
