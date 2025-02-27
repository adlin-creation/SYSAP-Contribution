import React from "react";
import ReactPlayer from "react-player/lazy";
import { Card, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Constants from "../Utils/Constants";

import "./Styles.css";
import { useTranslation } from "react-i18next";

const { Meta } = Card;

export default function Exercise({
  exercise,
  onClick,
  onSelect,
  deleteExercise,
}) {
  const { t } = useTranslation();
  return (
    <>
      <Card
        hoverable
        className="exercise-card"
        cover={
          exercise.instructionalVideo ? (
            <ReactPlayer
              url={exercise.instructionalVideo}
              width="100%"
              height="90px"
            />
          ) : exercise.imageUrl ? (
            <img
              src={`${Constants.SERVER_URL}/${exercise.imageUrl}`}
              alt="Exercise"
              style={{ height: "90px", objectFit: "cover" }}
            />
          ) : null
        }
        actions={[
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteExercise(exercise)}
          >
            {t("Exercises:delete_button")}
          </Button>,
          <Button
            type="link"
            onClick={(event) => {
              onClick(event);
              onSelect(exercise);
            }}
          >
            {t("Exercises:learn_more_button")}
          </Button>,
        ]}
      >
        <Meta title={exercise.name} description={exercise.description} />
      </Card>
    </>
  );
}
