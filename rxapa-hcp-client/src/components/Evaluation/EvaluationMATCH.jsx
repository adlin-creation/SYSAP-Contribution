import React, { useState } from "react";
import { Row, Col, Input, Button, Form, Radio, Modal } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function EvaluationMATCH({ onSubmit }) {
  const { patientId } = useParams();
  const [formData, setFormData] = useState({
    // Section Cardio-musculaire
    chairTestSupport: true,
    chairTestCount: "",

    // Section Équilibre
    balanceFeetTogether: "",
    balanceSemiTandem: "",
    balanceTandem: "",

    // Section Objectif de marche
    walkingTime: "",
  });
  const { token } = useToken();
  const [errors, setErrors] = useState({});
  const [submissionData, setSubmissionData] = useState(null);
  const { t } = useTranslation("Evaluations");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  const handleSubmit = () => {
    const newErrors = {};

    // Validation
    if (!formData.chairTestCount) {
      newErrors.chairTestCount = t("error_stand_required");
    } else if (isNaN(formData.chairTestCount) || formData.chairTestCount < 0) {
      newErrors.chairTestCount = t("error_stand_invalid");
    }

    ["balanceFeetTogether", "balanceSemiTandem", "balanceTandem"].forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] = t("error_time_required");
        } else if (isNaN(formData[field]) || formData[field] < 0) {
          newErrors[field] = t("error_time_invalid");
        }
      }
    );

    if (formData.canWalk) {
      if (!formData.walkingTime) {
        newErrors.walkingTime = t("error_walktime_required");
      } else if (isNaN(formData.walkingTime) || formData.walkingTime <= 0) {
        newErrors.walkingTime = t("error_walktime_invalid");
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const scoreCM = calculateChairTestScore();
    const scoreBalance = calculateBalanceScore();

    const totalScore = scoreCM + scoreBalance;
    const programColor = getProgramColor(totalScore);

    setModalMessage(
      <div className="results-container">
        <h3
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          {t("modal_results_eval_match")}
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>{t("individual_scores")} :</strong>
          <p>
            {t("cardio_score")} : {scoreCM}/5
          </p>
          <p>
            {t("balance_score")} : {scoreBalance}/4
          </p>
          <p>
            <strong>
              {t("total_score")} : {totalScore}/9
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
            <strong>{t("recommended_match_program")} : </strong>
            <span style={{ fontWeight: "bold" }}> {programColor}</span>
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
              {t("walk_speed")} :{" "}
              {(4 / parseFloat(formData.walkingTime)).toFixed(2)}{" "}
              {t("speed_unit")}
            </p>
            <p>
              <strong>
                {t("daily_walking_goal")} :{" "}
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
              <strong>{t("walking_capacity_to_improve")}</strong>
            </p>
          </div>
        )}
      </div>
    );

    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    const scoreCM = calculateChairTestScore();
    const scoreBalance = calculateBalanceScore();
    const scoreTotal = scoreCM + scoreBalance; // Assurez-vous de calculer le score total
    const programMatch = getProgramColor(scoreTotal);

    const payload = {
      idPatient: patientId,
      chairTestSupport: formData.chairTestSupport ? "with" : "without",
      chairTestCount: parseInt(formData.chairTestCount, 10),
      balanceFeetTogether: parseInt(formData.balanceFeetTogether, 10),
      balanceSemiTandem: parseInt(formData.balanceSemiTandem, 10),
      balanceTandem: parseInt(formData.balanceTandem, 10),
      walkingTime: parseFloat(formData.walkingTime),
      scores: {
        cardioMusculaire: scoreCM,
        equilibre: scoreBalance,
        total: scoreTotal, // Ajout du score total
        program: programMatch,
      },
    };

    if (!payload) {
      console.error("Aucune donnée à envoyer");
      return;
    }
    const endpoint = "/create-match-evaluation";

    try {
      console.log("Payload envoyé :", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${Constants.SERVER_URL}${endpoint}`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      // Gérer le succès
      Modal.success({
        title: "Succès",
        content: "Évaluation enregistrée avec succès",
      });

      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error("Erreur détaillée :", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        payload: payload,
      });

      Modal.error({
        title: "Erreur",
        content:
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Échec de l'enregistrement des données",
      });
    }
  };

  const calculateChairTestScore = () => {
    const count = parseInt(formData.chairTestCount);
    const withSupport = formData.chairTestSupport;

    if (count === 0) return 0;

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

  const calculateBalanceScore = () => {
    const feetTogether = parseFloat(formData.balanceFeetTogether);
    const semiTandem = parseFloat(formData.balanceSemiTandem);
    const tandem = parseFloat(formData.balanceTandem);

    // Si le score cardio-musculaire est 0, seulement évaluer l'équilibre pieds joints
    const cardioScore = calculateChairTestScore();
    if (cardioScore <= 1) {
      return feetTogether >= 10 ? 1 : 0;
    }

    // Vérifier dans l'ordre selon le document
    if (tandem >= 3) return 4;
    if (semiTandem >= 10) return 3;
    if (semiTandem < 10 && semiTandem > 0) return 2;
    if (feetTogether >= 10) return 1;
    return 0;
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

  const getProgramColor = (totalScore) => {
    if (totalScore <= 1) return t("color_red");
    if (totalScore <= 3) return t("color_yellow");
    if (totalScore <= 5) return t("color_orange");
    if (totalScore <= 7) return t("color_green");
    return "BLEU";
  };

  const onClose = () => {
    window.location.reload();
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={formData}
        >
          {/* Section A: CARDIO-MUSCULAIRE */}
          <h2>{t("sectionA_title")}</h2>
          <Form.Item label={t("chair_test_label")}>
            <div
              style={{
                marginBottom: "15px",
                fontStyle: "italic",
                color: "#666",
              }}
            >
              <InfoCircleOutlined style={{ marginRight: "5px" }} />
              {t("start_with_support")}
            </div>
            <Radio.Group
              name="chairTestSupport"
              value={formData.chairTestSupport}
              onChange={(e) =>
                setFormData({ ...formData, chairTestSupport: e.target.value })
              }
            >
              <Radio value={true}>{t("with_support")}</Radio>
              <Radio value={false}>{t("without_support")}</Radio>
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
          <h2>{t("SectionB_match_evaluation_title")}</h2>
          <div
            style={{ marginBottom: "15px", fontStyle: "italic", color: "#666" }}
          >
            <InfoCircleOutlined style={{ marginRight: "5px" }} />
            {t("match_evaluation_information_1")}
            <br />
            <InfoCircleOutlined style={{ marginRight: "5px" }} />
            {t("match_evaluation_information_2")}
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={t("feet_together")}
                validateStatus={errors.balanceFeetTogether ? "error" : ""}
                help={errors.balanceFeetTogether}
                tooltip="< 10 secondes = Score 0, ≥ 10 secondes = Score 1"
              >
                <Input
                  name="balanceFeetTogether"
                  value={formData.balanceFeetTogether}
                  onChange={handleChange}
                  placeholder={t("time_placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t("feet_semi_tandem")}
                validateStatus={errors.balanceSemiTandem ? "error" : ""}
                help={errors.balanceSemiTandem}
                tooltip="< 10 secondes = Score 2, ≥ 10 secondes = Score 3"
              >
                <Input
                  name="balanceSemiTandem"
                  value={formData.balanceSemiTandem}
                  onChange={handleChange}
                  placeholder={t("time_placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t("feet_tandem")}
                validateStatus={errors.balanceTandem ? "error" : ""}
                help={errors.balanceTandem}
                tooltip="≥ 3 secondes = Score 4"
              >
                <Input
                  name="balanceTandem"
                  value={formData.balanceTandem}
                  onChange={handleChange}
                  placeholder={t("time_placeholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Section C: VITESSE DE MARCHE */}
          <h2>{t("walk_objective")}</h2>
          <Form.Item label={t("match_walk_objective")}>
            <Radio.Group
              value={formData.canWalk}
              onChange={(e) =>
                setFormData({ ...formData, canWalk: e.target.value })
              }
              style={{ marginBottom: "16px" }}
            >
              <Radio value={true}>{t("patient_can_walk")}</Radio>
              <Radio value={false}>{t("patient_cannot_walk")}</Radio>
            </Radio.Group>

            {formData.canWalk && (
              <Form.Item
                label={t("time_needed_walk_4m")}
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
                  placeholder={t("time_placeholder")}
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

          <Form.Item>
            <Button onClick={() => onClose()} style={{ marginRight: 8 }}>
              {t("button_cancel")}
            </Button>
            <Button type="primary" htmlType="submit">
              {t("button_submit")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Modal
        title={t("modal_results_title")}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            {t("button_close")}
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirm}>
            {t("button_confirm")}
          </Button>,
        ]}
      >
        {modalMessage}
      </Modal>
    </Row>
  );
}

export default EvaluationMATCH;
