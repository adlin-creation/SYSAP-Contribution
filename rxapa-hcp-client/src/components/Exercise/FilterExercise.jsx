import React, { useState } from "react";
import PropTypes from "prop-types"; 
import { Row, Col, Select, Input } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function FilterExercise({ updateSelectedValues }) {
  const { t } = useTranslation();
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryChange = (newValue) => {
    setSelectedCategory(newValue);
    updateSelectedValues(newValue || "ALL", "category");
  };

  const handleFitnessLevelChange = (newValue) => {
    setSelectedFitnessLevel(newValue);
    updateSelectedValues(newValue || "ALL", "fitnessLevel");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    updateSelectedValues(e.target.value, "searchTerm"); // Envoie le mot-clé au parent
  };

  return (
    <div className="filter-container">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div className="filter-item">
            <Input
              placeholder={t("Exercises:search_placeholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              allowClear
              prefix={<SearchOutlined />}
            />
          </div>
        </Col>
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
              <Option value="Aérobique">{t("Exercises:aerobic")}</Option>
              <Option value="Endurance">{t("Exercises:endurance")}</Option>
              <Option value="Force">{t("Exercises:strength")}</Option>
              <Option value="Flexibilité">{t("Exercises:flexibility")}</Option>
              <Option value="Équilibre">{t("Exercises:balance")}</Option>
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
              <Option value="Facile">{t("Exercises:easy")}</Option>
              <Option value="Intermédiaire">{t("Exercises:intermediate")}</Option>
              <Option value="Avancé">{t("Exercises:advanced")}</Option>
            </Select>
          </div>
        </Col>
      </Row>
    </div>
  );
}

// Définition des PropTypes
FilterExercise.propTypes = {
  updateSelectedValues: PropTypes.func.isRequired,
};
