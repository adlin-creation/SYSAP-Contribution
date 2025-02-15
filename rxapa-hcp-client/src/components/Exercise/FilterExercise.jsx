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
              <Option value="AEROBIC">{t("AEROBIC")}</Option>
              <Option value="STRENGHT">{t("STRENGHT")}</Option>
              <Option value="ENDURANCE">{t("ENDURANCE")}</Option>
              <Option value="FLEXIBILITY">{t("FLEXIBILITY")}</Option>
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
              <Option value="ALL">{t("ALL")}</Option>
              <Option value="LOW">{t("LOW")}</Option>
              <Option value="BELOW_AVERAGE">{t("BELOW_AVERAGE")}</Option>
              <Option value="AVERAGE">{t("AVERAGE")}</Option>
              <Option value="ABOVE_AVERAGE">{t("ABOVE_AVERAGE")}</Option>
              <Option value="HIGH">{t("HIGH")}</Option>
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
              <Option value="ALL">ALL</Option>
              <Option value="FIFTY_TO_FIFTY_NINE">
                {t("FIFTY_TO_FIFTY_NINE")}
              </Option>
              <Option value="SIXTY_TO_SIXTY_NINE">
                {t("SIXTY_TO_SIXTY_NINE")}
              </Option>
              <Option value="SEVENTY_TO_SEVENTY_NINE">
                {t("SEVENTY_TO_SEVENTY_NINE")}
              </Option>
              <Option value="EIGHTY_TO_EIGHTY_NINE">
                {t("EIGHTY_TO_EIGHTY_NINE")}
              </Option>
            </Select>
          </div>
        </Col>
      </Row>
    </div>
  );
}
