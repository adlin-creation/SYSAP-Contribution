import React from "react";
import { Row, Col, Input, Radio, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Evaluation from "./Evaluation";
import { exportMatchPdf } from "./ExportEvaluationPdf";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function EvaluationMATCH() {
  const { t } = useTranslation("Evaluations");
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
      balanceFeetTogether: parseFloat(formData.balanceFeetTogether, 10),
      balanceSemiTandem: isBalanceTestEnabled("balanceSemiTandem")
        ? parseFloat(formData.balanceSemiTandem || 0, 10)
        : 0,
      balanceTandem: isBalanceTestEnabled("balanceTandem")
        ? parseFloat(formData.balanceTandem || 0, 10)
        : 0,
      walkingTime: formData.canWalk ? parseFloat(formData.walkingTime || 0) : 0,
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
          {t("title_results_eval_match")}
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>{t("text_individual_scores")} :</strong>
          <p>
            {t("text_cardio_score")} : {scores.cardioMusculaire}/5
          </p>
          <p>
            {t("text_balance_score")} : {scores.equilibre}/4
          </p>
          <p>
            <strong>
              {t("text_total_score")} : {scores.total}/9
            </strong>
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
            <strong>{t("text_recommended_match_program")} : </strong>
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
              {t("text_walk_speed")} : {calculateSpeed(formData.walkingTime)}{" "}
              {t("text_speed_unit")}
            </p>
            <p>
              <strong>
                {t("text_daily_walking_goal")} :{" "}
                {calculateWalkingObjective(formData.walkingTime)} {t("minutes")}
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
              <strong>{t("text_walking_capacity_to_improve")}</strong>
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

    if (isNaN(time) || time < 0 || walkingTime === "") {
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

  const renderFormFields = (
    formData,
    handleChange,
    errors,
    isBalanceTestEnabled,
    calculateWalkingObjective
  ) => {
    return (
      <>
        {/* Section A: CARDIO-MUSCULAIRE */}
        <h2>{t("title_sectionA")}</h2>
        <Form.Item label={t("label_chair_test")}>
          <div
            style={{ marginBottom: "15px", fontStyle: "italic", color: "#666" }}
          >
            <InfoCircleOutlined style={{ marginRight: "5px" }} />
            {t("info_start_with_support")}
          </div>
          <Radio.Group
            name="chairTestSupport"
            value={formData.chairTestSupport}
            onChange={(e) =>
              handleChange({
                target: { name: "chairTestSupport", value: e.target.value },
              })
            }
          >
            <Radio value={true}>{t("radio_with_support")}</Radio>
            <Radio value={false}>{t("radio_without_support")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t("label_stand_count")}
          validateStatus={errors.chairTestCount ? "error" : ""}
          help={errors.chairTestCount}
        >
          <Input
            name="chairTestCount"
            value={formData.chairTestCount}
            onChange={handleChange}
            placeholder={t("placeholder_stand_count")}
          />
        </Form.Item>

        {/* Section B: ÉQUILIBRE */}
        <h2>{t("title_SectionB_match_evaluation")}</h2>
        <div
          style={{ marginBottom: "15px", fontStyle: "italic", color: "#666" }}
        >
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          {t("info_match_evaluation_1")}
          <br />
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          {t("info_match_evaluation_2")}
        </div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t("label_feet_together")}
              validateStatus={errors.balanceFeetTogether ? "error" : ""}
              help={errors.balanceFeetTogether}
              tooltip="< 10 secondes = Score 0, ≥ 10 secondes = Score 1"
            >
              <Input
                name="balanceFeetTogether"
                value={formData.balanceFeetTogether}
                onChange={handleChange}
                placeholder={t("placeholder_time")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t("label_feet_semi_tandem")}
              validateStatus={errors.balanceSemiTandem ? "error" : ""}
              help={errors.balanceSemiTandem}
              tooltip="< 10 secondes = Score 2, ≥ 10 secondes = Score 3"
            >
              <Input
                name="balanceSemiTandem"
                value={formData.balanceSemiTandem}
                onChange={handleChange}
                placeholder={t("placeholder_time")}
                disabled={!isBalanceTestEnabled("balanceSemiTandem")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t("label_feet_tandem")}
              validateStatus={errors.balanceTandem ? "error" : ""}
              help={errors.balanceTandem}
              tooltip="≥ 3 secondes = Score 4"
            >
              <Input
                name="balanceTandem"
                value={formData.balanceTandem}
                onChange={handleChange}
                placeholder={t("placeholder_time")}
                disabled={!isBalanceTestEnabled("balanceTandem")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Section C: VITESSE DE MARCHE */}
        <h2>{t("title_SectionC_path_match_evaluation")}</h2>
        <Form.Item label={t("label_match_walk_objective")}>
          <Radio.Group
            value={formData.canWalk}
            onChange={(e) =>
              handleChange({
                target: { name: "canWalk", value: e.target.value },
              })
            }
            style={{ marginBottom: "16px" }}
          >
            <Radio value={true}>{t("radio_patient_can_walk")}</Radio>
            <Radio value={false}>{t("radio_patient_cannot_walk")}</Radio>
          </Radio.Group>

          {formData.canWalk && (
            <Form.Item
              label={t("label_time_needed_walk_4m")}
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
                  {t("text_walk_speed")} :{" "}
                  {calculateSpeed(formData.walkingTime)} {t("text_speed_unit")}
                  <div style={{ marginTop: 4 }}>
                    <strong>
                      {t("title_walk_objective")} :{" "}
                      {calculateWalkingObjective(formData.walkingTime)}{" "}
                      {t("text_minutes_per_day")}
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
EvaluationMATCH.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
