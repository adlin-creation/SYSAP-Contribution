import React from "react";
import { Row, Col, Input, Radio, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { exportMatchPdf } from "./ExportEvaluationPdf";
import Evaluation from "./Evaluation";

function EvaluationMATCH() {
  const getInitialFormData = () => ({
    // Section Cardio-musculaire
    chairTestSupport: true,
    chairTestCount: "",

    // Section Équilibre
    balanceFeetTogether: "",
    balanceSemiTandem: "",
    balanceTandem: "",

    // Section Objectif de marche
    canWalk: undefined,
    walkingTime: "",
  });

  const calculateScores = (formData) => {
    const scoreCM = calculateChairTestScore(formData);
    const scoreBalance = calculateBalanceScore(formData);
    const totalScore = scoreCM + scoreBalance;
    const programColor = getProgramColor(totalScore);

    return {
      cardioMusculaire: scoreCM,
      equilibre: scoreBalance,
      total: totalScore,
      program: programColor,
    };
  };

  const calculateChairTestScore = (formData) => {
    const count = parseInt(formData.chairTestCount);
    const withSupport = formData.chairTestSupport;

    if (isNaN(count) || count === 0) return 0;

    if (withSupport) {
      // Avec appui
      if (count < 5) return 1; // B < 5 levers
      if (count >= 5 && count <= 9) return 2; // C 5-9 levers
      if (count >= 10) return 3; // D ≥ 10 levers
    } else {
      // Sans appui
      if (count >= 3 && count <= 5) return 3; // E 3 à 5 levers
      if (count < 3) return 2; // Si E < 3, accorder le score C (2)
      if (count >= 5 && count <= 9) return 4; // F 5-9 levers
      if (count >= 10) return 5; // G ≥ 10 levers
    }

    return 0;
  };

  const calculateBalanceScore = (formData) => {
    const feetTogether = parseFloat(formData.balanceFeetTogether || 0);
    const semiTandem = parseFloat(formData.balanceSemiTandem || 0);
    const tandem = parseFloat(formData.balanceTandem || 0);

    // Vérifier dans l'ordre selon le document
    if (tandem >= 3) return 4;
    if (semiTandem >= 10) return 3;
    if (semiTandem < 10 && semiTandem > 0) return 2;
    if (feetTogether >= 10) return 1;
    return 0;
  };

  const getProgramColor = (totalScore) => {
    if (totalScore <= 1) return "ROUGE";
    if (totalScore <= 3) return "JAUNE";
    if (totalScore <= 5) return "ORANGE";
    if (totalScore <= 7) return "VERT";
    return "BLEU";
  };

  const buildPayload = (formData, scores, patientId, isBalanceTestEnabled) => {
    return {
      idPatient: patientId,
      chairTestSupport: formData.chairTestSupport ? "with" : "without",
      chairTestCount: parseInt(formData.chairTestCount, 10),
      balanceFeetTogether: parseInt(formData.balanceFeetTogether, 10),
      balanceSemiTandem: isBalanceTestEnabled('balanceSemiTandem') ? 
                        parseInt(formData.balanceSemiTandem || 0, 10) : 0,
      balanceTandem: isBalanceTestEnabled('balanceTandem') ? 
                    parseInt(formData.balanceTandem || 0, 10) : 0,
      walkingTime: formData.canWalk ? parseFloat(formData.walkingTime || 0) : 0,
      scores: {
        cardioMusculaire: scores.cardioMusculaire,
        equilibre: scores.equilibre,
        total: scores.total,
        program: scores.program,
      }
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
          Évaluation MATCH
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>Scores individuels :</strong>
          <p>Cardio-musculaire : {scores.cardioMusculaire}/5</p>
          <p>Équilibre : {scores.equilibre}/4</p>
          <p>
            <strong>SCORE TOTAL : {scores.total}/9</strong>
          </p>
        </div>

        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Programme MATCH recommandé : </strong>
            <span style={{ fontWeight: "bold" }}> {scores.program}</span>
          </p>
        </div>

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
              {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
            </p>
            <p>
              <strong>
                Objectif de marche / jour :{" "}
                {calculateWalkingObjective(formData.walkingTime)} minutes
              </strong>
            </p>
          </div>
        )}

        {!formData.canWalk && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "15px",
            }}
          >
            <p>
              <strong>
                Capacité de marche à travailler (Objectif à réévaluer au cours
                du séjour)
              </strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  const calculateWalkingObjective = (walkingTime) => {
    if (!walkingTime || walkingTime <= 0) return null;

    const speed = 4 / parseFloat(walkingTime);

    if (speed < 0.4) return 10;
    if (speed >= 0.4 && speed < 0.6) return 15;
    if (speed >= 0.6 && speed < 0.8) return 20;
    if (speed >= 0.8) return 30;

    return null;
  };

  const renderFormFields = (formData, handleChange, errors, isBalanceTestEnabled, calculateWalkingObjective) => {
    return (
      <>
        {/* Section A: CARDIO-MUSCULAIRE */}
        <h2>CARDIO-MUSCULAIRE</h2>
        <Form.Item label="Test de la chaise en 30 secondes">
          <div
            style={{ marginBottom: "15px", fontStyle: "italic", color: "#666" }}
          >
            <InfoCircleOutlined style={{ marginRight: "5px" }} />
            Commencer avec support. Si le patient réussi a faire 5 levers ou plus, 
            refaire le test sans support
          </div>
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
        <h2>ÉQUILIBRE (Debout, sans aide)</h2>
        <div
          style={{ marginBottom: "15px", fontStyle: "italic", color: "#666" }}
        >
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          Si le patient ne peut pas accomplir 5 levers avec support, 
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
              tooltip="< 10 secondes = Score 0, ≥ 10 secondes = Score 1"
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
              tooltip="< 10 secondes = Score 2, ≥ 10 secondes = Score 3"
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
              tooltip="≥ 3 secondes = Score 4"
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

        {/* Section C: VITESSE DE MARCHE */}
        <h2>OBJECTIF DE MARCHE</h2>
        <Form.Item label="Test 4 mètres – vitesse de marche confortable">
          <Radio.Group
            value={formData.canWalk}
            onChange={(e) =>
              handleChange({
                target: { name: "canWalk", value: e.target.value }
              })
            }
            style={{ marginBottom: "16px" }}
          >
            <Radio value={true}>Le patient peut marcher</Radio>
            <Radio value={false}>
              Le patient ne peut pas marcher
            </Radio>
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
                  {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
                  <div style={{ marginTop: 4 }}>
                    <strong>
                      Objectif de marche :{" "}
                      {calculateWalkingObjective(formData.walkingTime)}{" "}
                      minutes par jour
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
      evaluationType="MATCH"
      getInitialFormData={getInitialFormData}
      calculateScores={calculateScores}
      renderFormFields={renderFormFields}
      buildPayload={buildPayload}
      buildModalContent={buildModalContent}
      exportPdf={exportMatchPdf}
    />
  );
}

export default EvaluationMATCH;
