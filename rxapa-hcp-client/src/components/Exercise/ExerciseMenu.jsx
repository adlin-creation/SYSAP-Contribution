import React, { useState } from "react";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import Exercise from "./Exercise";
import CreateExercise from "./CreateExercise";
import Constants from "../Utils/Constants";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ExerciseDetail from "./ExerciseDetail";
import useToken from "../Authentication/useToken";
import Modal from "../Modal/Modal";
import FilterExercise from "./FilterExercise";
import { useTranslation } from "react-i18next";

export default function ExerciseMenu() {
  const { t } = useTranslation("Exercises");
  const [buttonState, setButtonState] = useState({
    isCreateExercise: false,
    isLearnMore: false,
  });
  const [selectedExercise, setSelectedExercise] = useState(null);

  const { token } = useToken();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const [attributes, setAttributes] = useState({
    fitnessLevel: "ALL",
    category: "ALL",
    ageRange: "ALL",
    status: "ALL",
  });

  const exerciseUrl = `${Constants.SERVER_URL}/exercises`;
  const {
    data: exerciseList,
    isLoading: isExerciseLoading,
    isError: isExerciseLoadingError,
    refetch: refetchExercises,
  } = useQuery(["exercises"], () => {
    return axios
      .get(exerciseUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        openModal(t(`Backend:${err.response.data.message}`), true);
      });
  });

  if (isExerciseLoading) {
    return <h1>{t("title_exercise_loading")}</h1>;
  }
  if (isExerciseLoadingError) {
    return <h1>{t("error_exercise_loading")}</h1>;
  }

  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  }

  function updateSelectedValues(value, attributeName) {
    setAttributes((preVal) => {
      return {
        ...preVal,
        [attributeName]: value,
      };
    });
  }

  function handleButtonState(buttonType) {
    setButtonState(() => {
      if (buttonType === "create-exercise") {
        return {
          isCreateExercise: true,
          isLearnMore: false,
        };
      } else if (buttonType === "learn-more") {
        return {
          isCreateExercise: false,
          isLearnMore: true,
        };
      } else {
        return {
          isCreateExercise: false,
          isLearnMore: false,
        };
      }
    });
  }

  function handleSelectExercise(exercise) {
    setSelectedExercise(exercise);
  }

  const deleteExercise = (exercise) => {
    axios
      .delete(`${Constants.SERVER_URL}/delete-exercise/${exercise.key}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchExercises();
        openModal(t(`Backend:${res.data.message}`), false);
      })
      .catch((err) => {
        openModal(
          t(`Backend:${err.response?.data?.message}`) || t("error_unknown"),
          true
        );
      });
  };

  const normalizeStatus = (status) => {
    if (!status) return "";
    const lower = status.toLowerCase();
    if (["actif", "active"].includes(lower)) return "active";
    if (["inactif", "inactive", "désactivé", "desactiver"].includes(lower))
      return "inactive";
    return status;
  };

  const filteredExercises = exerciseList?.filter((exercise) => {
    if (
      attributes.fitnessLevel !== "ALL" &&
      attributes.fitnessLevel !== exercise.fitnessLevel
    ) {
      return false;
    }

    if (
      attributes.category !== "ALL" &&
      attributes.category !== exercise.category
    ) {
      return false;
    }

    if (
      attributes.status !== "ALL" &&
      normalizeStatus(attributes.status) !== normalizeStatus(exercise.status)
    ) {
      return false;
    }

    if (attributes.searchTerm) {
      const searchTermLower = attributes.searchTerm.toLowerCase();
      const nameMatch = exercise.name.toLowerCase().includes(searchTermLower);
      const descriptionMatch = exercise.description
        .toLowerCase()
        .includes(searchTermLower);

      if (!nameMatch && !descriptionMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      {!buttonState.isCreateExercise && !buttonState.isLearnMore && (
        <div>
          <Row className="filter-button-row" gutter={16} align="middle">
            <Col flex={1} style={{ display: 'flex', overflow: 'hidden' }}>
              <FilterExercise updateSelectedValues={updateSelectedValues} />
            </Col>
            <Col style={{ flexShrink: 0 }}>
              <Button
                onClick={() => handleButtonState("create-exercise")}
                type="primary"
                icon={<PlusOutlined />}
              >
                {t("button_create_exercise")}
              </Button>
            </Col>
          </Row>
          <div className="exercise-container">
            {filteredExercises?.map((exercise) => (
              <Exercise
                key={exercise.id}
                exercise={exercise}
                onClick={() => handleButtonState("learn-more")}
                onSelect={handleSelectExercise}
                deleteExercise={deleteExercise}
              />
            ))}
          </div>
        </div>
      )}

      {(buttonState.isCreateExercise || buttonState.isLearnMore) && (
        <Button
          onClick={() => handleButtonState("back")}
          type="primary"
          icon={<ArrowLeftOutlined />}
        >
          {t("button_back")}
        </Button>
      )}

      {buttonState.isCreateExercise && (
        <CreateExercise refetchExercises={refetchExercises} />
      )}

      {buttonState.isLearnMore && (
        <ExerciseDetail
          exercise={selectedExercise}
          refetchExercises={refetchExercises}
        />
      )}
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