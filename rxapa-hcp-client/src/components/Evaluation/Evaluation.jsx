import React, { useState } from 'react';
import { Row, Col, Input, Button, Form, Radio, Modal } from "antd";



function Evaluation({ onSubmit}) {
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  const handleSubmit = () => {  // on utilise directement formData qui est dans l'état
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const scoreA = calculateChairTestScore();
    const scoreB = calculateBalanceScore();
    const scoreC = calculateMobilityScore();
    
    const totalScore = scoreA + scoreB + scoreC;
    const level = determineLevel(totalScore);
    const color = determineColor(scoreA, scoreB, scoreC);

    setModalMessage(
      <div className="results-container">
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          Résultats de l'évaluation
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Scores individuels :</strong>
          <p>A. Cardio-musculaire : {scoreA}/6</p>
          <p>B. Équilibre : {scoreB}/6</p>
          <p>C. Mobilité : {scoreC}/6</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Score Total : {totalScore}/18</strong>
        </div>

        <div style={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          <p><strong>Niveau : {level}</strong></p>
          <p><strong>Programme recommandé : {color} {level}</strong></p>
        </div>
      </div>
    );
    
    setIsModalVisible(true);

    onSubmit({
      ...formData,
      scores: {
        cardioMusculaire: scoreA,
        equilibre: scoreB,
        mobilite: scoreC,
        total: totalScore,
        niveau: level,
        couleur: color,
        programme: `${color} ${level}`
      }
      });
  };

const calculateChairTestScore = () => {
    const count = parseInt(formData.chairTestCount);
    const withSupport = formData.chairTestSupport === 'with';

    if (count === 0) return 0;
    if (withSupport && count >= 10) return 2;
    if (withSupport && count >= 1) return 1;
    if (!withSupport && count >= 16) return 6;
    if (!withSupport && count >= 13) return 5;
    if (!withSupport && count >= 10) return 4;
    if (!withSupport && count >= 5) return 3;
    if (!withSupport && count >= 1) return 2;
    return 0;
};

const calculateBalanceScore = () => {
    const feetTogether = parseFloat(formData.balanceFeetTogether);
    const semiTandem = parseFloat(formData.balanceSemiTandem);
    const tandem = parseFloat(formData.balanceTandem);
    const oneFooted = parseFloat(formData.balanceOneFooted);

    if (oneFooted >= 10) return 6;
    if (oneFooted >= 5) return 5;
    if (tandem >= 10) return 4;
    if (tandem >= 5) return 3;
    if (semiTandem >= 10) return 2;
    if (feetTogether >= 10) return 1;
    return 0;
};

const calculateMobilityScore = () => {
  if (formData.frtPosition === 'armNotWorking') return 0;
  
  const distance = parseFloat(formData.frtDistance);
  const isStanding = formData.frtPosition === 'standing';
  const balanceScore = calculateBalanceScore();
  
  // Position debout (si B ≥ 5 OU Assis = 40 cm)
  if (isStanding && (balanceScore >= 5)) {
      if (distance > 35) return 6;
      if (distance >= 27) return 5;
      if (distance >= 15) return 4;
      if (distance > 0) return 3;
      return 0;
  } 
  // Position assise
  else {
      if (distance > 35) return 4;
      if (distance >= 27) return 3;
      if (distance >= 15) return 2;
      if (distance < 15 && distance > 0) return 1;
      return 0;
  }
};

const determineLevel = (totalScore) => {
    if (totalScore >= 16) return 'V';
    if (totalScore >= 13) return 'IV';
    if (totalScore >= 9) return 'III';
    if (totalScore >= 5) return 'II';
    return 'I';
};

const determineColor = (scoreA, scoreB, scoreC) => {
    const min = Math.min(scoreA, scoreB, scoreC);
    
    // Si tous les scores sont égaux
    if (scoreA === scoreB && scoreB === scoreC) return 'MARRON';
    
    // Si deux scores sont égaux et minimum
    if (scoreA === scoreB && scoreA === min) return 'VERT';
    if (scoreB === scoreC && scoreB === min) return 'ORANGE';
    if (scoreC === scoreA && scoreC === min) return 'VIOLET';
    
    // Si un seul score est minimum
    if (scoreA === min) return 'BLEU';
    if (scoreB === min) return 'JAUNE';
    if (scoreC === min) return 'ROUGE';
    
    return 'MARRON'; // Cas par défaut
};

const onClose = () => {
  window.location.reload();
};

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={formData}>
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
            <Button onClick={() => onClose()} style={{ marginRight: 8 }}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit">
              Soumettre
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Modal
        title="Résultats"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Fermer
          </Button>
        ]}
      >
        {modalMessage}
      </Modal>
    </Row>
  );
}

export default Evaluation;