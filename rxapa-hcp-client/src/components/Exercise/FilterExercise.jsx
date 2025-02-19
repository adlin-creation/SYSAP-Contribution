import React, { useState } from "react";
import { Row, Col, Select } from "antd";

const { Option } = Select;

export default function FilterExercise({ updateSelectedValues }) {
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (newValue) => {
    setSelectedCategory(newValue);
    updateSelectedValues(newValue || "Tout", "category");
  };

  const handleFitnessLevelChange = (newValue) => {
    setSelectedFitnessLevel(newValue);
    updateSelectedValues(newValue || "Tout", "fitnessLevel");
  };

  return (
    <div className="filter-container">
      <Row gutter={16}>
        <Col span={12}>
          <div className="filter-item">
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="select-wide"
              placeholder="Catégorie"
              allowClear
            >
              <Option value="ALL">Tout</Option> , 
              <Option value="Aérobic">Aérobic</Option>
              <Option value="Endurance">Endurance</Option>
              <Option value="Force">Force</Option>
              <Option value="Flexibilité">Flexibilié</Option>
              <Option value="Équilibre">Équilibre</Option>
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className="filter-item">
            <Select
              value={selectedFitnessLevel}
              onChange={handleFitnessLevelChange}
              className="select-wide"
              placeholder="Difficulté"
              allowClear
            >
              <Option value="ALL">Tout</Option>
              <Option value="Facile">Facile</Option>
              <Option value="Intermédiaire">Intermédiaire</Option>
              <Option value="Avancé">Avancé</Option>
            </Select>
          </div>
        </Col>
      </Row>
    </div>
  );
}