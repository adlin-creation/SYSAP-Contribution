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
              placeholder="Category"
              allowClear
            >
              <Option value="ALL">{t("ALL")}</Option>
              <Option value="AEROBIC">{t("aerobic")}</Option>
              <Option value="STRENGTH">{t("strength")}</Option>
              <Option value="ENDURANCE">{t("endurance")}</Option>
              <Option value="FLEXIBILITY">{t("flexibility")}</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className="filter-item">
            <Select
              value={selectedFitnessLevel}
              onChange={handleFitnessLevelChange}
              className="select-wide"
              placeholder="Fitness Level"
              allowClear
            >
              <Option value="ALL">{t("all")}</Option>
              <Option value="LOW">{t("low")}</Option>
              <Option value="BELOW_AVERAGE">{t("below_average")}</Option>
              <Option value="AVERAGE">{t("average")}</Option>
              <Option value="ABOVE_AVERAGE">{t("above_average")}</Option>
              <Option value="HIGH">{t("high")}</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className="filter-item">
            <Select
              value={selectedAgeGroup}
              onChange={handleAgeGroupChange}
              className="select-wide"
              placeholder="Age Group"
              allowClear
            >
              <Option value="ALL">{t("all")}</Option>
              <Option value="FIFTY_TO_FIFTY_NINE">
                {t("fifty_to_fifty_nine")}
              </Option>
              <Option value="SIXTY_TO_SIXTY_NINE">
                {t("sixty_to_sixty_nine")}
              </Option>
              <Option value="SEVENTY_TO_SEVENTY_NINE">
                {t("seventy_to_seventy_nine")}
              </Option>
              <Option value="EIGHTY_TO_EIGHTY_NINE">
                {t("eighty_to_eighty_nine")}
              </Option>
            </Select>
          </div>
        </Col>
      </Row>
    </div>
  );
}
