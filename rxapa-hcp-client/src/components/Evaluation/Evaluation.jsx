import React, { useState } from 'react';
import { Row, Col, Input, Button, Form, Radio } from "antd";



function Evaluation({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    // Section A
    chairTestSupport: 'with',
    chairTestCount: '',
    
    // Section B
    balanceFeetTogether: '',
    balanceSemiTandem: '',
    balanceTandem: '',
    balanceOneFooted: '',
    
    // Section C
    frtPosition: 'sitting',
    frtDistance: '',

    // Section D
    walkingTime: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validation
    if (!formData.chairTestCount) {
      newErrors.chairTestCount = "Le nombre de levers est requis";
    } else if (isNaN(formData.chairTestCount) || formData.chairTestCount < 0) {
      newErrors.chairTestCount = "Veuillez entrer un nombre valide";
    }

    ['balanceFeetTogether', 'balanceSemiTandem', 'balanceTandem', 'balanceOneFooted'].forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "Le temps est requis";
      } else if (isNaN(formData[field]) || formData[field] < 0) {
        newErrors[field] = "Veuillez entrer un temps valide";
      }
    });

    if (!formData.frtDistance) {
      newErrors.frtDistance = "La distance est requise";
    }

    if (!formData.walkingTime) {
      newErrors.walkingTime = "Le temps de marche est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Section A: CARDIO-MUSCULAIRE */}
          <h2>A. CARDIO-MUSCULAIRE</h2>
          <Form.Item label="Test de la chaise en 30 secondes">
            <Radio.Group
              name="chairTestSupport"
              value={formData.chairTestSupport}
              onChange={handleChange}
            >
              <Radio value="with">Avec appui</Radio>
              <Radio value="without">Sans appui</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item 
            label="Nombre de levers"
            validateStatus={errors.chairTestCount ? "error" : ""}
            help={errors.chairTestCount}
          >
            <Input
              name="chairTestCount"
              value={formData.chairTestCount}
              onChange={handleChange}
              placeholder="Entrez le nombre"
            />
          </Form.Item>

          {/* Section B: ÉQUILIBRE */}
          <h2>B. ÉQUILIBRE</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Temps Pieds joints (secondes)"
                validateStatus={errors.balanceFeetTogether ? "error" : ""}
                help={errors.balanceFeetTogether}
              >
                <Input
                  name="balanceFeetTogether"
                  value={formData.balanceFeetTogether}
                  onChange={handleChange}
                  placeholder="Entrez le temps"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Temps Semi-tandem (secondes)"
                validateStatus={errors.balanceSemiTandem ? "error" : ""}
                help={errors.balanceSemiTandem}
              >
                <Input
                  name="balanceSemiTandem"
                  value={formData.balanceSemiTandem}
                  onChange={handleChange}
                  placeholder="Entrez le temps"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Temps Tandem (secondes)"
                validateStatus={errors.balanceTandem ? "error" : ""}
                help={errors.balanceTandem}
              >
                <Input
                  name="balanceTandem"
                  value={formData.balanceTandem}
                  onChange={handleChange}
                  placeholder="Entrez le temps"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Temps Unipodal (secondes)"
                validateStatus={errors.balanceOneFooted ? "error" : ""}
                help={errors.balanceOneFooted}
              >
                <Input
                  name="balanceOneFooted"
                  value={formData.balanceOneFooted}
                  onChange={handleChange}
                  placeholder="Entrez le temps"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Section C: MOBILITÉ & STABILITÉ DU TRONC */}
          <h2>C. MOBILITÉ & STABILITÉ DU TRONC</h2>
          <Form.Item label="Functional Reach Test (FRT)">
            <Radio.Group
              name="frtPosition"
              value={formData.frtPosition}
              onChange={handleChange}
            >
              <Radio value="sitting">Assis</Radio>
              <Radio value="standing">Debout</Radio>
              <Radio value="armNotWorking">Ne lève pas les bras</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item 
            label="Distance (cm)"
            validateStatus={errors.frtDistance ? "error" : ""}
            help={errors.frtDistance}
          >
            <Input
              name="frtDistance"
              value={formData.frtDistance}
              onChange={handleChange}
              placeholder="Entrez la distance"
            />
          </Form.Item>

          {/* Section D: VITESSE DE MARCHE */}
          <h2>VITESSE DE MARCHE</h2>
          <Form.Item 
            label="Test 4 mètres - Temps nécessaire pour marcher 4-mètres (secondes)"
            validateStatus={errors.walkingTime ? "error" : ""}
            help={errors.walkingTime}
          >
            <Input
              name="walkingTime"
              value={formData.walkingTime}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleChange(e);
                }
              }}
              placeholder="Entrez le temps en secondes"
            />
            {formData.walkingTime && !errors.walkingTime && (
              <div style={{ marginTop: 8, color: '#666' }}>
                Vitesse de marche : {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit">
              Soumettre
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default Evaluation;