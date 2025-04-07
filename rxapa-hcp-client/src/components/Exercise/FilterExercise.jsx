import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, Input } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function FilterExercise({ updateSelectedValues }) {
  const { t } = useTranslation("Exercises");
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

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

  const handleStatusChange = (newValue) => {
    setSelectedStatus(newValue);
    updateSelectedValues(newValue || "ALL", "status");
  };

  return (
    <div className="filter-container">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div className="filter-item">
            <Input
              placeholder={t("placeholder_search")}
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
              placeholder={t("placeholder_category")}
              allowClear
            >
              <Option value="ALL">{t("option_all")}</Option>
              <Option value="Aérobique">{t("option_aerobic")}</Option>
              <Option value="Endurance">{t("option_endurance")}</Option>
              <Option value="Force">{t("option_strength")}</Option>
              <Option value="Flexibilité">{t("option_flexibility")}</Option>
              <Option value="Équilibre">{t("option_balance")}</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className="filter-item">
            <Select
              value={selectedFitnessLevel}
              onChange={handleFitnessLevelChange}
              className="select-wide"
              placeholder={t("fitness_level_placeholder")}
              allowClear
            >
              <Option value="ALL">{t("option_all")}</Option>
              <Option value="Facile">{t("option_easy")}</Option>
              <Option value="Intermédiaire">{t("option_intermediate")}</Option>
              <Option value="Avancé">{t("option_advanced")}</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className="filter-item">
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder={t("placeholder_exercise_status")}
              allowClear
              className="select-wide"
            >
              <Option value="ALL">{t("all")}</Option>
              <Option value="active">{t("option_active")}</Option>
              <Option value="inactive">{t("option_inactive")}</Option>
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
