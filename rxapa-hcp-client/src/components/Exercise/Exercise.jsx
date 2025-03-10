import React from "react";
import { Card } from "antd";
import Constants from "../Utils/Constants";
import { useTranslation } from "react-i18next";
import "./Styles.css";

const { Meta } = Card;

export default function Exercise({ exercise, onClick, onSelect }) {
  const { t } = useTranslation();
  const imageUrl = exercise.imageUrl ? `${Constants.SERVER_URL}/${exercise.imageUrl}` : null;
  const { name, fitnessLevel, category } = exercise;

  const handleCardClick = (event) => {
    onClick(event);
    onSelect(exercise);
  };

  return (
    <Card
      hoverable
      className="exercise-card"
      onClick={handleCardClick}
    >
      <div
        className="exercise-background"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="exercise-info">
        <Meta title={name} description={`${fitnessLevel} | ${category}`} />
      </div>
      
    </Card>
  );
}
