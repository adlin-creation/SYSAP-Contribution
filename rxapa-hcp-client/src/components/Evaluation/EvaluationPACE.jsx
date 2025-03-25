import React from "react";
import { Row, Col, Input, Radio, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Evaluation from "./Evaluation";
import { useTranslation } from "react-i18next";

function EvaluationPACE() {
  const { t } = useTranslation("Evaluations");

  const getInitialFormData = () => ({
    // Section A - Cardio-musculaire
    chairTestSupport: true,
    chairTestCount: "",

    // Section B - Équilibre
    balanceFeetTogether: "",
    balanceSemiTandem: "",
    balanceTandem: "",
    balanceOneFooted: "",

    // Section C - Mobilité
    frtPosition: true,
    frtDistance: "",

    // Section D - Vitesse de marche
    canWalk: undefined, // Ajouté pour le choix "peut marcher" ou "ne peut pas marcher"
    walkingTime: "",
  });

  const calculateScores = (formData) => {
    const scoreA = calculateChairTestScore(formData);
    const scoreB = calculateBalanceScore(formData);
    const scoreC = calculateMobilityScore(formData);
    const totalScore = scoreA + scoreB + scoreC;
    const level = determineLevel(totalScore);
    const color = determineColor(scoreA, scoreB, scoreC);
    const frenchColor = determineFrenchColor(scoreA, scoreB, scoreC);

    return {
      cardioMusculaire: scoreA,
      equilibre: scoreB,
      mobilite: scoreC,
      total: totalScore,
      level,
      color,
      frenchColor,
      program: frenchColor + " " + level,
    };
  };

  const calculateChairTestScore = (formData) => {
    const count = parseInt(formData.chairTestCount);
    const withSupport = formData.chairTestSupport;

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

  const calculateBalanceScore = (formData) => {
    const feetTogether = parseFloat(formData.balanceFeetTogether || 0);
    const semiTandem = parseFloat(formData.balanceSemiTandem || 0);
    const tandem = parseFloat(formData.balanceTandem || 0);
    const oneFooted = parseFloat(formData.balanceOneFooted || 0);

    if (oneFooted >= 10) return 6;
    if (oneFooted >= 5) return 5;
    if (tandem >= 10) return 4;
    if (tandem >= 5) return 3;
    if (semiTandem >= 10) return 2;
    if (feetTogether >= 10) return 1;
    return 0;
  };

  const calculateMobilityScore = (formData) => {
    if (formData.frtPosition === "armNotWorking") return 0;

    const distance = parseFloat(formData.frtDistance);
    const isStanding = !formData.frtPosition; // false signifie debout
    const balanceScore = calculateBalanceScore(formData);

    // Position debout (si B ≥ 5 OU Assis = 40 cm)
    if (isStanding && balanceScore >= 5) {
      if (distance > 35) return 6;
      if (distance >= 27) return 5;
      if (distance >= 15) return 4;
      if (distance > 0) return 3;
      return 0;
    } else {
      // Position assise
      if (distance > 35) return 4;
      if (distance >= 27) return 3;
      if (distance >= 15) return 2;
      if (distance < 15 && distance > 0) return 1;
      return 0;
    }
  };

  const determineLevel = (totalScore) => {
    if (totalScore >= 16) return "V";
    if (totalScore >= 13) return "IV";
    if (totalScore >= 9) return "III";
    if (totalScore >= 5) return "II";
    return "I";
  };

  const determineColor = (scoreA, scoreB, scoreC) => {
    const min = Math.min(scoreA, scoreB, scoreC);

    // Si tous les scores sont égaux
    if (scoreA === scoreB && scoreB === scoreC) return t("color_brown");

    // Si deux scores sont égaux et minimum
    if (scoreA === scoreB && scoreA === min) return t("color_green");
    if (scoreB === scoreC && scoreB === min) return t("color_orange");
    if (scoreC === scoreA && scoreC === min) return t("color_purple");

    // Si un seul score est minimum
    if (scoreA === min) return t("color_blue");
    if (scoreB === min) return t("color_yellow");
    if (scoreC === min) return t("color_red");

    return t("color_brown"); // Cas par défaut
  };

  // Pour que le programme envoyé à la BD soit en français
  const determineFrenchColor = (scoreA, scoreB, scoreC) => {
    const min = Math.min(scoreA, scoreB, scoreC);
    if (scoreA === scoreB && scoreB === scoreC) return "MARRON";
    if (scoreA === scoreB && scoreA === min) return "VERT";
    if (scoreB === scoreC && scoreB === min) return "ORANGE";
    if (scoreC === scoreA && scoreC === min) return "VIOLET";
    if (scoreA === min) return "BLEU";
    if (scoreB === min) return "JAUNE";
    if (scoreC === min) return "ROUGE";
    return "MARRON";
  };

  const calculateWalkingObjective = (walkingTime) => {
    if (!walkingTime || walkingTime <= 0) return null;

    const speed = 4 / parseFloat(walkingTime);

    if (speed < 0.4) return 10;
    if (speed >= 0.4 && speed < 0.59) return 15;
    if (speed >= 0.6 && speed < 0.79) return 20;
    if (speed >= 0.8) return 30;

    return null;
  };

  const buildPayload = (formData, scores, patientId, isBalanceTestEnabled) => {
    return {
      idPatient: patientId,
      chairTestSupport: formData.chairTestSupport ? "with" : "without",
      chairTestCount: parseInt(formData.chairTestCount, 10),
      balanceFeetTogether: parseInt(formData.balanceFeetTogether, 10),
      balanceSemiTandem: isBalanceTestEnabled("balanceSemiTandem")
        ? parseInt(formData.balanceSemiTandem || 0, 10)
        : 0,
      balanceTandem: isBalanceTestEnabled("balanceTandem")
        ? parseInt(formData.balanceTandem || 0, 10)
        : 0,
      balanceOneFooted: isBalanceTestEnabled("balanceOneFooted")
        ? parseInt(formData.balanceOneFooted || 0, 10)
        : 0,
      frtSitting:
        formData.frtPosition === true
          ? "sitting"
          : formData.frtPosition === false
          ? "standing"
          : "not_working",
      frtDistance:
        formData.frtPosition === "armNotWorking"
          ? 0
          : parseInt(formData.frtDistance, 10),

      // walkingTime = 0 si canWalk === false
      walkingTime: formData.canWalk ? parseFloat(formData.walkingTime || 0) : 0,

      scores: {
        cardioMusculaire: scores.cardioMusculaire,
        equilibre: scores.equilibre,
        mobilite: scores.mobilite,
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
          {t("modal_results_eval")}
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>{t("individual_scores")}</strong>
          <p>
            {t("cardio_score")} : {scores.cardioMusculaire}/6
          </p>
          <p>
            {t("balance_score")} : {scores.equilibre}/6
          </p>
          <p>
            {t("mobility_score")}: {scores.mobilite}/6
          </p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>
            {t("total_score")} : {scores.total}/18
          </strong>
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
            <strong>
              {t("level")} : {scores.level}
            </strong>
          </p>
          <p>
            <strong>
              {t("recommended_program")} : {scores.color} {scores.level}
            </strong>
          </p>
        </div>

        {/* si canWalk === true ET walkingTime, on affiche la vitesse */}
        {formData.canWalk && formData.walkingTime && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "15px",
            }}
          >
            <p>
              {t("walking_speed")} :{" "}
              {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
            </p>
            <p>
              <strong>
                {t("walking_objective")} :{" "}
                {calculateWalkingObjective(formData.walkingTime)}{" "}
                {t("minutes_per_day")}
              </strong>
            </p>
          </div>
        )}

        {/* Sinon, s'il ne peut pas marcher */}
        {!formData.canWalk && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "15px",
            }}
          >
            <p>
              <strong>{t("walking_ability_to_work")}</strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFormFields = (
    formData,
    handleChange,
    errors,
    isBalanceTestEnabled
  ) => {
    return (
      <>
        {/* Section A: CARDIO-MUSCULAIRE (inchangée) */}
        <h2>{t("sectionA_title")}</h2>
        <Form.Item label={t("chair_test_label")}>
          <Radio.Group
            name="chairTestSupport"
            value={formData.chairTestSupport}
            onChange={(e) =>
              handleChange({
                target: { name: "chairTestSupport", value: e.target.value },
              })
            }
          >
            <Radio value={true}>{t("with_support")}</Radio>
            <Radio value={false}>{t("without_support")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t("stand_count")}
          validateStatus={errors.chairTestCount ? "error" : ""}
          help={errors.chairTestCount}
        >
          <Input
            name="chairTestCount"
            value={formData.chairTestCount}
            onChange={handleChange}
            placeholder={t("stand_count_placeholder")}
          />
        </Form.Item>

        {/* Section B: ÉQUILIBRE (inchangée) */}
        <h2>{t("sectionB_title")}</h2>
        <div style={{ marginBottom: 16 }}>{t("balance_instructions")}</div>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("feet_together")}
                  <img
                    src={require("./images/pace_balance_joint.png")}
                    alt="Joint Feet"
                    style={{ marginLeft: 8, height: 24 }}
                  />
                </span>
              }
              validateStatus={errors.balanceFeetTogether ? "error" : ""}
              help={errors.balanceFeetTogether}
            >
              <Input
                name="balanceFeetTogether"
                value={formData.balanceFeetTogether}
                onChange={handleChange}
                placeholder={t("time_placeholder")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("feet_semi_tandem")}
                  <img
                    src={require("./images/pace_balance_semi_tandem.png")}
                    alt="Semi tandem Feet"
                    style={{ marginLeft: 8, height: 24 }}
                  />
                </span>
              }
              validateStatus={errors.balanceSemiTandem ? "error" : ""}
              help={errors.balanceSemiTandem}
            >
              <Input
                name="balanceSemiTandem"
                value={formData.balanceSemiTandem}
                onChange={handleChange}
                placeholder={t("time_placeholder")}
                disabled={!isBalanceTestEnabled("balanceSemiTandem")}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("feet_tandem")}
                  <img
                    src={require("./images/pace_balance_tandem.png")}
                    alt="Tandem Feet"
                    style={{ marginLeft: 8, height: 24 }}
                  />
                </span>
              }
              validateStatus={errors.balanceTandem ? "error" : ""}
              help={errors.balanceTandem}
            >
              <Input
                name="balanceTandem"
                value={formData.balanceTandem}
                onChange={handleChange}
                placeholder={t("time_placeholder")}
                disabled={!isBalanceTestEnabled("balanceTandem")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("feet_unipodal")}
                  <img
                    src={require("./images/pace_balance_unipodal.png")}
                    alt="Unipodal Foot"
                    style={{ marginLeft: 8, height: 24 }}
                  />
                </span>
              }
              validateStatus={errors.balanceOneFooted ? "error" : ""}
              help={errors.balanceOneFooted}
            >
              <Input
                name="balanceOneFooted"
                value={formData.balanceOneFooted}
                onChange={handleChange}
                placeholder={t("time_placeholder")}
                disabled={!isBalanceTestEnabled("balanceOneFooted")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Section C: MOBILITÉ & STABILITÉ DU TRONC (inchangée) */}
        <h2>{t("sectionC_title")}</h2>
        <Form.Item label={t("frt_label")}>
          <Radio.Group
            name="frtPosition"
            value={formData.frtPosition}
            onChange={(e) =>
              handleChange({
                target: { name: "frtPosition", value: e.target.value },
              })
            }
          >
            <Radio value={true}>{t("sitting")}</Radio>
            <Radio value={false}>{t("standing")}</Radio>
            <Radio value="armNotWorking">{t("arms_not_working")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t("distance_label")}
          validateStatus={errors.frtDistance ? "error" : ""}
          help={errors.frtDistance}
        >
          <Input
            name="frtDistance"
            value={formData.frtDistance}
            onChange={handleChange}
            placeholder={t("distance_placeholder")}
            disabled={formData.frtPosition === "armNotWorking"}
          />
        </Form.Item>

        {/* SECTION D : OBJECTIF DE MARCHE  */}
        <h2>{t("sectionD_title")}</h2>
        <Form.Item label={t("walk_test_label")}>
          <Radio.Group
            value={formData.canWalk}
            onChange={(e) =>
              handleChange({
                target: { name: "canWalk", value: e.target.value },
              })
            }
            style={{ marginBottom: "16px" }}
          >
            <Radio value={true}>{t("patient_can_walk")}</Radio>
            <Radio value={false}>{t("patient_cannot_walk")}</Radio>
          </Radio.Group>

          {formData.canWalk && (
            <Form.Item
              label={t("walking_time_label")}
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
                placeholder={t("walktime_placeholder")}
              />
              {formData.walkingTime && !errors.walkingTime && (
                <div style={{ marginTop: 8, color: "#666" }}>
                  {t("walking_speed")} :{" "}
                  {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
                  <div style={{ marginTop: 4 }}>
                    <strong>
                      {t("walking_objective")} :{" "}
                      {calculateWalkingObjective(formData.walkingTime)}{" "}
                      {t("minutes_per_day")}
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
      evaluationType="PACE"
      getInitialFormData={getInitialFormData}
      calculateScores={calculateScores}
      renderFormFields={renderFormFields}
      buildPayload={buildPayload}
      buildModalContent={buildModalContent}
    />
  );
}

export default EvaluationPACE;
