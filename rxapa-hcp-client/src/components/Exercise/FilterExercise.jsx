import React, { useState } from "react";
import { Row, Col, Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

export default function FilterExercise({ updateSelectedValues }) {
  const { t } = useTranslation();
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);

  const handleCategoryChange = (newValue) => {
    setSelectedCategory(newValue);
    updateSelectedValues(newValue || "ALL", "category");
  };

  const handleFitnessLevelChange = (newValue) => {
    setSelectedFitnessLevel(newValue);
    updateSelectedValues(newValue || "ALL", "fitnessLevel");
  };

  const handleAgeGroupChange = (newValue) => {
    setSelectedAgeGroup(newValue);
    updateSelectedValues(newValue || "ALL", "ageRange");
  };

  return (
    <div className="filter-container">
      <Row gutter={24}>
        <Col span={8}>
          <div className="filter-item">
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="select-wide"
              placeholder={t("Exercises:category_placeholder")}
              allowClear
            >
              <Option value="ALL">{t("Exercises:all")}</Option>
              <Option value="AEROBIC">{t("Exercises:aerobic")}</Option>
              <Option value="STRENGTH">{t("Exercises:strength")}</Option>
              <Option value="ENDURANCE">{t("Exercises:endurance")}</Option>
              <Option value="FLEXIBILITY">{t("Exercises:flexibility")}</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className="filter-item">
            <Select
              value={selectedFitnessLevel}
              onChange={handleFitnessLevelChange}
              className="select-wide"
              placeholder={t("Exercises:fitness_level_placeholder")}
              allowClear
            >
              <Option value="ALL">{t("Exercises:all")}</Option>
              <Option value="LOW">{t("Exercises:low")}</Option>
              <Option value="BELOW_AVERAGE">
                {t("Exercises:below_average")}
              </Option>
              <Option value="AVERAGE">{t("Exercises:average")}</Option>
              <Option value="ABOVE_AVERAGE">
                {t("Exercises:above_average")}
              </Option>
              <Option value="HIGH">{t("Exercises:high")}</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className="filter-item">
            <Select
              value={selectedAgeGroup}
              onChange={handleAgeGroupChange}
              className="select-wide"
              placeholder={t("Exercises:age_groupe_placeholder")}
              allowClear
            >
              <Option value="ALL">{t("Exercises:all")}</Option>
              <Option value="FIFTY_TO_FIFTY_NINE">
                {t("Exercises:fifty_to_fifty_nine")}
              </Option>
              <Option value="SIXTY_TO_SIXTY_NINE">
                {t("Exercises:sixty_to_sixty_nine")}
              </Option>
              <Option value="SEVENTY_TO_SEVENTY_NINE">
                {t("Exercises:seventy_to_seventy_nine")}
              </Option>
              <Option value="EIGHTY_TO_EIGHTY_NINE">
                {t("Exercises:eighty_to_eighty_nine")}
              </Option>
            </Select>
          </div>
        </Col>
      </Row>
    </div>
  );
}
