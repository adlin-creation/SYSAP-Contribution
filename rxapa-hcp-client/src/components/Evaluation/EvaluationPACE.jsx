<<<<<<< HEAD
import React from "react";
import { Row, Col, Input, Radio, Form, Modal } from "antd";
import Evaluation from "./Evaluation";
import { exportPacePdf } from "./ExportEvaluationPdf";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import i18next from "i18next";

// Fonction d'export PDF modifiée qui gère correctement le token
const handleExportPacePdf = async (payload, token) => {
  if (!payload || !token) {
    console.error("Données manquantes pour l'exportation PDF");
    Modal.error({
      title: i18next.t("title_error"),
      content: i18next.t("error_missing_data_for_pdf_export"),
    });
    return;
  }

  try {
    await exportPacePdf(payload, token);
  } catch (error) {
    console.error("Erreur lors de l'exportation PDF PACE:", error);
    if (error.response) {
      console.error(
        "Réponse du serveur:",
        error.response.status,
        error.response.data
      );
    }
    Modal.error({
      title: i18next.t("error_pdf_export"),
      content: i18next.t("error_pdf_export_connexion"),
    });
  }
};

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
    if (isStanding) {
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
      balanceOneFooted: isBalanceTestEnabled("balanceOneFooted")
        ? parseFloat(formData.balanceOneFooted || 0, 10)
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
          : parseFloat(formData.frtDistance, 10),

      // walkingTime = 0 si canWalk === false
      walkingTime: formData.canWalk ? parseFloat(formData.walkingTime || 0) : 0,
      canWalk: !!formData.canWalk, // S'assurer que la valeur est un booléen

      scores: {
        cardioMusculaire: scores.cardioMusculaire,
        equilibre: scores.equilibre,
        mobilite: scores.mobilite,
        total: scores.total,
        level: scores.level,
        color: scores.frenchColor,
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
          {t("title_results_eval_pace")}
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>{t("individual_scores")}</strong>
          <p>
            {t("text_cardio_score")} : {scores.cardioMusculaire}/6
          </p>
          <p>
            {t("text_balance_score")} : {scores.equilibre}/6
          </p>
          <p>
            {t("text_mobility_score")}: {scores.mobilite}/6
          </p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>
            {t("text_total_score")} : {scores.total}/18
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
              {t("text_level")} : {scores.level}
            </strong>
          </p>
          <p>
            <strong>
              {t("text_recommended_program")} : {scores.color} {scores.level}
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
              {t("text_walk_speed")} : {calculateSpeed(formData.walkingTime)}{" "}
              {t("text_speed_unit")}
            </p>
            <p>
              <strong>
                {t("title_walk_objective")} :{" "}
                {calculateWalkingObjective(formData.walkingTime)}{" "}
                {t("text_minutes_per_day")}
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
              <strong>{t("title_walking_ability_to_work")}</strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  // Fonction personnalisée de validation pour corriger le problème lié à la marche
  const validateForm = (formData, errors) => {
    const newErrors = { ...errors };

    // Validation qui ne rejettera pas la soumission si le patient ne peut pas marcher
    if (formData.canWalk === false) {
      // Si le patient ne peut pas marcher, on supprime l'erreur liée au temps de marche
      delete newErrors.walkingTime;
    } else if (formData.canWalk === true) {
      // Si le patient peut marcher, on vérifie que le temps est bien renseigné
      if (!formData.walkingTime) {
        newErrors.walkingTime = t("error_walk_time_required");
      } else if (
        isNaN(formData.walkingTime) ||
        parseFloat(formData.walkingTime) < 0
      ) {
        newErrors.walkingTime = t("error_walk_time_invalid");
      }
    }

    return newErrors;
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
        <h2>{t("title_sectionA")}</h2>
        <Form.Item label={t("label_chair_test")}>
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

        {/* Section B: ÉQUILIBRE (inchangée) */}
        <h2>{t("title_sectionB")}</h2>
        <div style={{ marginBottom: 16 }}>{t("text_balance_instructions")}</div>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("label_feet_together")}
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
                placeholder={t("placeholder_time")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("label_feet_semi_tandem")}
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
                placeholder={t("placeholder_time")}
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
                  {t("label_feet_tandem")}
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
                placeholder={t("placeholder_time")}
                disabled={!isBalanceTestEnabled("balanceTandem")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("label_feet_unipodal")}
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
                placeholder={t("placeholder_time")}
                disabled={!isBalanceTestEnabled("balanceOneFooted")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Section C: MOBILITÉ & STABILITÉ DU TRONC (inchangée) */}
        <h2>{t("title_sectionC")}</h2>
        <Form.Item label={t("label_functional_reach_test")}>
          <Radio.Group
            name="frtPosition"
            value={formData.frtPosition}
            onChange={(e) =>
              handleChange({
                target: { name: "frtPosition", value: e.target.value },
              })
            }
          >
            <Radio value={true}>{t("radio_sitting")}</Radio>
            <Radio value={false}>{t("radio_standing")}</Radio>
            <Radio value="armNotWorking">{t("radio_arms_not_working")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t("label_distance")}
          validateStatus={errors.frtDistance ? "error" : ""}
          help={errors.frtDistance}
        >
          <Input
            name="frtDistance"
            value={formData.frtDistance}
            onChange={handleChange}
            placeholder={t("placeholder_distance")}
            disabled={formData.frtPosition === "armNotWorking"}
          />
        </Form.Item>

        {/* SECTION D : OBJECTIF DE MARCHE  */}
        <h2>{t("title_sectionD")}</h2>
        <Form.Item label={t("label_walk_test")}>
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
      evaluationType="PACE"
      getInitialFormData={getInitialFormData}
      calculateScores={calculateScores}
      renderFormFields={renderFormFields}
      buildPayload={buildPayload}
      buildModalContent={buildModalContent}
      validateForm={validateForm}
      exportPdf={handleExportPacePdf}
    />
  );
}
EvaluationPACE.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default EvaluationPACE;
=======
import React from "react";
import { Row, Col, Input, Radio, Form, Modal } from "antd";
import Evaluation from "./Evaluation";
import { exportPacePdf } from "./ExportEvaluationPdf";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import i18next from "i18next";

// Fonction d'export PDF modifiée qui gère correctement le token
const handleExportPacePdf = async (payload, token) => {
  if (!payload || !token) {
    console.error("Données manquantes pour l'exportation PDF");
    Modal.error({
      title: i18next.t("title_error"),
      content: i18next.t("error_missing_data_for_pdf_export"),
    });
    return;
  }

  try {
    await exportPacePdf(payload, token);
  } catch (error) {
    console.error("Erreur lors de l'exportation PDF PACE:", error);
    if (error.response) {
      console.error(
        "Réponse du serveur:",
        error.response.status,
        error.response.data
      );
    }
    Modal.error({
      title: i18next.t("error_pdf_export"),
      content: i18next.t("error_pdf_export_connexion"),
    });
  }
};

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
    if (isStanding) {
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
      balanceOneFooted: isBalanceTestEnabled("balanceOneFooted")
        ? parseFloat(formData.balanceOneFooted || 0, 10)
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
          : parseFloat(formData.frtDistance, 10),

      // walkingTime = 0 si canWalk === false
      walkingTime: formData.canWalk ? parseFloat(formData.walkingTime || 0) : 0,
      canWalk: !!formData.canWalk, // S'assurer que la valeur est un booléen

      scores: {
        cardioMusculaire: scores.cardioMusculaire,
        equilibre: scores.equilibre,
        mobilite: scores.mobilite,
        total: scores.total,
        level: scores.level,
        color: scores.frenchColor,
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
          {t("title_results_eval_pace")}
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>{t("individual_scores")}</strong>
          <p>
            {t("text_cardio_score")} : {scores.cardioMusculaire}/6
          </p>
          <p>
            {t("text_balance_score")} : {scores.equilibre}/6
          </p>
          <p>
            {t("text_mobility_score")}: {scores.mobilite}/6
          </p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>
            {t("text_total_score")} : {scores.total}/18
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
              {t("text_level")} : {scores.level}
            </strong>
          </p>
          <p>
            <strong>
              {t("text_recommended_program")} : {scores.color} {scores.level}
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
              {t("text_walk_speed")} : {calculateSpeed(formData.walkingTime)}{" "}
              {t("text_speed_unit")}
            </p>
            <p>
              <strong>
                {t("title_walk_objective")} :{" "}
                {calculateWalkingObjective(formData.walkingTime)}{" "}
                {t("text_minutes_per_day")}
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
              <strong>{t("title_walking_ability_to_work")}</strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  // Fonction personnalisée de validation pour corriger le problème lié à la marche
  const validateForm = (formData, errors) => {
    const newErrors = { ...errors };

    // Validation qui ne rejettera pas la soumission si le patient ne peut pas marcher
    if (formData.canWalk === false) {
      // Si le patient ne peut pas marcher, on supprime l'erreur liée au temps de marche
      delete newErrors.walkingTime;
    } else if (formData.canWalk === true) {
      // Si le patient peut marcher, on vérifie que le temps est bien renseigné
      if (!formData.walkingTime) {
        newErrors.walkingTime = t("error_walk_time_required");
      } else if (
        isNaN(formData.walkingTime) ||
        parseFloat(formData.walkingTime) < 0
      ) {
        newErrors.walkingTime = t("error_walk_time_invalid");
      }
    }

    return newErrors;
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
        <h2>{t("title_sectionA")}</h2>
        <Form.Item label={t("label_chair_test")}>
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

        {/* Section B: ÉQUILIBRE (inchangée) */}
        <h2>{t("title_sectionB")}</h2>
        <div style={{ marginBottom: 16 }}>{t("text_balance_instructions")}</div>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("label_feet_together")}
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
                placeholder={t("placeholder_time")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("label_feet_semi_tandem")}
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
                placeholder={t("placeholder_time")}
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
                  {t("label_feet_tandem")}
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
                placeholder={t("placeholder_time")}
                disabled={!isBalanceTestEnabled("balanceTandem")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {t("label_feet_unipodal")}
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
                placeholder={t("placeholder_time")}
                disabled={!isBalanceTestEnabled("balanceOneFooted")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Section C: MOBILITÉ & STABILITÉ DU TRONC (inchangée) */}
        <h2>{t("title_sectionC")}</h2>
        <Form.Item label={t("label_functional_reach_test")}>
          <Radio.Group
            name="frtPosition"
            value={formData.frtPosition}
            onChange={(e) =>
              handleChange({
                target: { name: "frtPosition", value: e.target.value },
              })
            }
          >
            <Radio value={true}>{t("radio_sitting")}</Radio>
            <Radio value={false}>{t("radio_standing")}</Radio>
            <Radio value="armNotWorking">{t("radio_arms_not_working")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t("label_distance")}
          validateStatus={errors.frtDistance ? "error" : ""}
          help={errors.frtDistance}
        >
          <Input
            name="frtDistance"
            value={formData.frtDistance}
            onChange={handleChange}
            placeholder={t("placeholder_distance")}
            disabled={formData.frtPosition === "armNotWorking"}
          />
        </Form.Item>

        {/* SECTION D : OBJECTIF DE MARCHE  */}
        <h2>{t("title_sectionD")}</h2>
        <Form.Item label={t("label_walk_test")}>
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
      evaluationType="PACE"
      getInitialFormData={getInitialFormData}
      calculateScores={calculateScores}
      renderFormFields={renderFormFields}
      buildPayload={buildPayload}
      buildModalContent={buildModalContent}
      validateForm={validateForm}
      exportPdf={handleExportPacePdf}
    />
  );
}
EvaluationPACE.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default EvaluationPACE;
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
