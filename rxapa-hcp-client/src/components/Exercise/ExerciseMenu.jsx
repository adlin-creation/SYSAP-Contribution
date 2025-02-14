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
  const { t } = useTranslation();
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
        openModal(err.response.data.message, true);
      });
  });

  if (isExerciseLoading) {
    return <h1>{t("Exercise Loading...")}</h1>;
  }
  if (isExerciseLoadingError) {
    return <h1>Sorry, an error occured while loading exercises</h1>;
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
        openModal(res.data.message, false);
      })
      .catch((err) => {
        openModal(err.response.data.message, true);
      });
  };

  const filteredExercises = exerciseList?.filter((exercise) => {
    if (
      attributes.fitnessLevel !== "ALL" &&
      attributes.fitnessLevel !== null &&
      attributes.fitnessLevel !== exercise.fitnessLevel
    ) {
      return false;
    }

    if (
      attributes.category !== "ALL" &&
      attributes.category !== null &&
      attributes.category !== exercise.category
    ) {
      return false;
    }

    if (
      attributes.ageRange !== "ALL" &&
      attributes.ageRange !== null &&
      attributes.ageRange !== exercise.targetAgeRange
    ) {
      return false;
    }

    return exercise;
  });

  return (
    <div>
      {!buttonState.isCreateExercise && !buttonState.isLearnMore && (
        <div>
          <div className="filter-button-container">
            <FilterExercise updateSelectedValues={updateSelectedValues} />
            <Button
              onClick={() => handleButtonState("create-exercise")}
              type="primary"
              icon={<PlusOutlined />}
            >
              {t("Create Exercise")}
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            {filteredExercises?.map((exercise) => {
              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={exercise.key}>
                  <Exercise
                    onClick={() => handleButtonState("learn-more")}
                    onSelect={handleSelectExercise}
                    exercise={exercise}
                    deleteExercise={deleteExercise}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {(buttonState.isCreateExercise || buttonState.isLearnMore) && (
        <Button
          onClick={() => handleButtonState("back")}
          type="primary"
          icon={<ArrowLeftOutlined />}
        >
          Back
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
