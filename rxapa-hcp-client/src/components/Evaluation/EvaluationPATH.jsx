import React from "react";
import { Row, Col, Input, Radio, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Evaluation from "./Evaluation";
import PropTypes from "prop-types";

function EvaluationPATH() {
  const getInitialFormData = () => ({
    // Section Cardio-musculaire
    chairTestSupport: true,
    chairTestCount: "",

    // Section Équilibre
    balanceFeetTogether: "",
    balanceSemiTandem: "",
    balanceTandem: "",

    // Section Objectif de marche
    canWalk: true, // Définir une valeur par défaut (true) au lieu de undefined
    walkingTime: "",
  });

  const calculateScores = (formData) => {
    const scoreCM = calculateChairTestScore(formData);
    const scoreBalance = calculateBalanceScore(formData, scoreCM);
    const programPath = scoreCM + "" + scoreBalance;

    return {
      cardioMusculaire: scoreCM,
      equilibre: scoreBalance,
      total: scoreCM + scoreBalance,
      program: programPath,
    };
  };

  const calculateChairTestScore = (formData) => {
    const count = parseInt(formData.chairTestCount);
    const withSupport = formData.chairTestSupport;

    if (isNaN(count) || count === 0) return 0;

    if (!withSupport) {
      // Sans appui
      if (count >= 10) return 5; // G ≥ 10 levers
      if (count >= 5 && count <= 9) return 4; // F 5-9 levers
      if (count >= 3 && count <= 4) return 3; // E 3 à 4 levers
      return 0;
    } else {
      // Avec appui
      if (count >= 10) return 3; // D ≥ 10 levers
      if (count >= 5 && count <= 9) return 2; // C 5-9 levers
      if (count < 5 && count > 0) return 1; // B < 5 levers
      return 0;
    }
  };

  const calculateBalanceScore = (formData, cardioScore) => {
    const feetTogether = parseFloat(formData.balanceFeetTogether || 0);
    const semiTandem = parseFloat(formData.balanceSemiTandem || 0);
    const tandem = parseFloat(formData.balanceTandem || 0);

    // Si le score cardio-musculaire est 0, seulement évaluer l'équilibre pieds joints
    if (cardioScore === 0) {
      return feetTogether >= 5 ? 1 : 0;
    }

    // Vérifier dans l'ordre selon le document
    if (tandem >= 3) return 4;
    if (semiTandem >= 5) return 3;
    if (semiTandem < 5 && semiTandem > 0) return 2;
    if (feetTogether >= 5) return 1;
    return 0;
  };

  const buildPayload = (formData, scores, patientId, isBalanceTestEnabled) => {
    return {
      idPatient: patientId,
      chairTestSupport: formData.chairTestSupport ? "with" : "without",
      chairTestCount: parseInt(formData.chairTestCount || 0, 10), // Ajouter || 0 pour éviter NaN
      balanceFeetTogether: parseInt(formData.balanceFeetTogether || 0, 10),
      balanceSemiTandem: isBalanceTestEnabled('balanceSemiTandem') ? 
                        parseInt(formData.balanceSemiTandem || 0, 10) : 0,
      balanceTandem: isBalanceTestEnabled('balanceTandem') ? 
                    parseInt(formData.balanceTandem || 0, 10) : 0,
      // Conditionnellement définir walkingTime en fonction de canWalk
      walkingTime: formData.canWalk
        ? parseFloat(formData.walkingTime || 0)
        : 0,
      canWalk: !!formData.canWalk, // S'assurer que la valeur est un booléen
      scores: {
        cardioMusculaire: scores.cardioMusculaire,
        equilibre: scores.equilibre,
        total: scores.total,
        program: scores.program,
      },
    };
  };

  const buildModalContent = (scores, formData) => {
    return (
      <div className="results-container">
        <h3
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Évaluation PATH
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>Scores individuels :</strong>
          <p>Cardio-musculaire : {scores.cardioMusculaire}/5</p>
          <p>Équilibre : {scores.equilibre}/4</p>
        </div>

        {/* Nouveau style avec fond grisé comme dans MATCH */}
        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Programme PATH : {scores.program}</strong>
          </p>
        </div>

        {/* Si canWalk === true ET walkingTime, on affiche la vitesse */}
        {formData.canWalk && formData.walkingTime && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "15px",
            }}
          >
            <p>
              Vitesse de marche :{" "}
              {calculateSpeed(formData.walkingTime)} m/s
            </p>
            <p>
              <strong>
                Objectif de marche / jour :{" "}
                {calculateWalkingObjective(formData.walkingTime)} minutes
              </strong>
            </p>
          </div>
        )}

        {/* Sinon, s'il ne peut pas marcher */}
        {formData.canWalk === false && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "15px",
            }}
          >
            <p>
              <strong>
                Capacité de marche à travailler (Objectif à réévaluer
                au cours du séjour)
              </strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  const calculateSpeed = (walkingTime) => {
    const time = parseFloat(walkingTime);
    if (isNaN(time) || time <= 0) return "0.00";
    return (4 / time).toFixed(2);
  };

  const calculateWalkingObjective = (walkingTime) => {
    const time = parseFloat(walkingTime);
    
    if (isNaN(time) || time < 0 || walkingTime === '') {
      return null;
    }
    
    if (time === 0) {
      return 10;
    }
    
    const speed = 4 / time;
    
    if (speed < 0.4) return 10;
    if (speed >= 0.4 && speed < 0.6) return 15;
    if (speed >= 0.6 && speed < 0.8) return 20;
    if (speed >= 0.8) return 30;
    
    return null;
  };

  const renderFormFields = (formData, handleChange, errors, isBalanceTestEnabled) => {
    return (
      <>
        {/* Section A: CARDIO-MUSCULAIRE */}
        <h2>CARDIO-MUSCULAIRE</h2>
        <Form.Item label="Test de la chaise en 30 secondes">
          <Radio.Group
            name="chairTestSupport"
            value={formData.chairTestSupport}
            onChange={(e) =>
              handleChange({
                target: { name: "chairTestSupport", value: e.target.value }
              })
            }
          >
            <Radio value={true}>Avec appui</Radio>
            <Radio value={false}>Sans appui</Radio>
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
        <h2>ÉQUILIBRE</h2>
        <div
          style={{ marginBottom: "15px", fontStyle: "italic", color: "#666" }}
        >
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          Si le patient ne peut pas se lever avec support, 
          seulement faire le test d'équilibre pieds joints
          <br/>
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          Si le patient n'arrive pas a garder un éuilibre dans une partie, entrer 0
        </div>
        <Row gutter={16}>
          <Col span={8}>
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
          <Col span={8}>
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
                disabled={!isBalanceTestEnabled('balanceSemiTandem')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
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
                disabled={!isBalanceTestEnabled('balanceTandem')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Section C: OBJECTIF DE MARCHE */}
        <h2>OBJECTIF DE MARCHE</h2>
        <Form.Item label="Test 4 mètres – vitesse de marche confortable">
          <Radio.Group
            name="canWalk" // Ajouter le nom pour le handleChange
            value={formData.canWalk}
            onChange={(e) =>
              handleChange({
                target: { name: "canWalk", value: e.target.value },
              })
            }
            style={{ marginBottom: "16px" }}
          >
            <Radio value={true}>Le patient peut marcher</Radio>
            <Radio value={false}>Le patient ne peut pas marcher</Radio>
          </Radio.Group>

          {formData.canWalk && (
            <Form.Item
              label="Temps nécessaire pour marcher 4 mètres (secondes)"
              validateStatus={errors.walkingTime ? "error" : ""}
              help={errors.walkingTime}
            >
              <Input
                name="walkingTime"
                value={formData.walkingTime}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                placeholder="Entrez le temps en secondes"
              />
              {formData.walkingTime && !errors.walkingTime && (
                <div style={{ marginTop: 8, color: "#666" }}>
                  Vitesse de marche :{" "}
                  {calculateSpeed(formData.walkingTime)} m/s
                  <div style={{ marginTop: 4 }}>
                    <strong>
                      Objectif de marche :{" "}
                      {calculateWalkingObjective(formData.walkingTime)} minutes
                      par jour
                    </strong>
                  </div>
                </div>
              )}
            </Form.Item>
          )}
        </Form.Item>
      </>
    );
  };

  return (
    <Evaluation
      evaluationType="PATH"
      getInitialFormData={getInitialFormData}
      calculateScores={calculateScores}
      renderFormFields={renderFormFields}
      buildPayload={buildPayload}
      buildModalContent={buildModalContent}
    />
  );
}
EvaluationPATH.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default EvaluationPATH;
