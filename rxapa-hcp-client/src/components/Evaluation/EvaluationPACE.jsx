import React, { useState } from "react";
import { Row, Col, Input, Button, Form, Radio, Modal } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { useTranslation } from "react-i18next";

function EvaluationPACE({ onSubmit }) {
  const { t } = useTranslation("Evaluations");
  const { patientId } = useParams(); // Récupère l'ID depuis l'URL
  const [formData, setFormData] = useState({
    // Section A
    chairTestSupport: true,
    chairTestCount: "",

    // Section B
    balanceFeetTogether: "",
    balanceSemiTandem: "",
    balanceTandem: "",
    balanceOneFooted: "",

    // Section C
    frtPosition: true,
    frtDistance: "",

    // Section D
    walkingTime: "",
  });
  const { token } = useToken();
  const [errors, setErrors] = useState({});
  const [submissionData, setSubmissionData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "frtPosition" && value === "armNotWorking") {
        return {
          ...prev,
          [name]: value,
          frtDistance: "",
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });

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

    [
      "balanceFeetTogether",
      "balanceSemiTandem",
      "balanceTandem",
      "balanceOneFooted",
    ].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = t("error_time_required");
      } else if (isNaN(formData[field]) || formData[field] < 0) {
        newErrors[field] = t("error_time_invalid");
      }
    });

    if (formData.frtPosition !== "armNotWorking") {
      // Seulement valider si ce n'est pas "Ne lève pas les bras"
      if (!formData.frtDistance) {
        newErrors.frtDistance = "La distance est requise";
      }
    }

    if (!formData.walkingTime) {
      newErrors.walkingTime = t("error_walktime_required");
    } else if (isNaN(formData.walkingTime) || formData.walkingTime <= 0) {
      newErrors.walkingTime = t("error_walktime_invalid");
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
          <p>{t("cardio_score")} : {scoreA}/6</p>
          <p>{t("balance_score")} : {scoreB}/6</p>
          <p>{t("mobility_score")}: {scoreC}/6</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>{t("total_score")} : {totalScore}/18</strong>
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
            <strong>{t("level")} : {level}</strong>
          </p>
          <p>
            <strong>
              {t("recommended_program")} : {color} {level}
            </strong>
          </p>
        </div>

        {formData.walkingTime && (
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "15px",
            }}
          >
            <p>
              {t("speed_calculation")} :{" "}
              {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
            </p>
            <p>
              <strong>
                {t("walk_objective")} :{" "}
                {calculateWalkingObjective(formData.walkingTime)} minutes
              </strong>
            </p>
          </div>
        )}
      </div>
    );

    setIsModalVisible(true);
    setIsModalVisible(true); // Ouvre la modale
  };

  const handleConfirm = async () => {
    // Créer directement le payload avant l'envoi

    const scoreA = calculateChairTestScore();
    const scoreB = calculateBalanceScore();
    const scoreC = calculateMobilityScore();
    const scoreTotal = scoreA + scoreB + scoreC;

    const payload = {
      idPatient: patientId,
      chairTestSupport: formData.chairTestSupport ? "with" : "without",
      chairTestCount: parseInt(formData.chairTestCount, 10),
      balanceFeetTogether: parseInt(formData.balanceFeetTogether, 10),
      balanceSemiTandem: parseInt(formData.balanceSemiTandem, 10),
      balanceTandem: parseInt(formData.balanceTandem, 10),
      balanceOneFooted: parseInt(formData.balanceOneFooted, 10),
      frtSitting: formData.frtPosition === true ? "sitting" : 
                  formData.frtPosition === false ? "standing" : 
                  "not_working",
      frtDistance: formData.frtPosition === "armNotWorking" ? 0 : parseInt(formData.frtDistance, 10),
      walkingTime: parseFloat(formData.walkingTime),
      scores: {
        cardioMusculaire: scoreA,
        equilibre: scoreB,
        mobilite: scoreC,
        total: scoreTotal,
        program: determineFrenchColor(scoreA, scoreB, scoreC) + " " + determineLevel(scoreTotal)
      }
    };
  
    if (!payload) {
      console.error("Aucune donnée à envoyer");
      return;
    }
    const endpoint = "/create-pace-evaluation";
    
    try {
      console.log("Payload envoyé :", JSON.stringify(payload, null, 2));
      
      const response = await axios.post(
        `${Constants.SERVER_URL}${endpoint}`, 
        payload, // Utilisez directement le payload ici
        {
          headers: { 
            Authorization: "Bearer " + token,
            'Content-Type': 'application/json'
          },
        }
      );
      
      // Gérer le succès 
      Modal.success({
        title: "Succès",
        content: "Évaluation enregistrée avec succès"
      });
      
      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error("Erreur détaillée :", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        payload: payload
      });
      
      Modal.error({
        title: "Erreur",
        content: error.response?.data?.message || 
                 error.response?.data || 
                 error.message || 
                 "Échec de l'enregistrement des données"
      });
    }
  };

  const calculateChairTestScore = () => {
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
    if (formData.frtPosition === "armNotWorking") return 0;

    const distance = parseFloat(formData.frtDistance);
    const isStanding = !formData.frtPosition; // false signifie debout
    const balanceScore = calculateBalanceScore();

    // Position debout (si B ≥ 5 OU Assis = 40 cm)
    if (isStanding && balanceScore >= 5) {
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

  // pour que le programme envoyé a la BD est francais
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

  const onClose = () => {
    window.location.reload();
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <h2>{t("sectionA_title")}</h2>
          <Form.Item label={t("chair_test_label")}>
            <Radio.Group
              name="chairTestSupport"
              value={formData.chairTestSupport}
              onChange={handleChange}
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

          <h2>{t("sectionB_title")}</h2>
          <div style={{ marginBottom: 16 }}>
            {t("balance_instructions")}
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {t("feet_together")}
                    <img 
                      src={require('./images/pace_balance_joint.png')}
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
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {t("feet_semi_tandem")}
                  <img 
                    src={require('./images/pace_balance_semi_tandem.png')}
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
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                  {t("feet_tandem")}
                    <img 
                      src={require('./images/pace_balance_tandem.png')}
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
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                  {t("feet_unipodal")}
                    <img 
                      src={require('./images/pace_balance_unipodal.png')}
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
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Section C: MOBILITÉ & STABILITÉ DU TRONC */}
          <h2>{t("sectionC_title")}</h2>
          <Form.Item label={t("frt_label")}>
            <Radio.Group
              name="frtPosition"
              value={formData.frtPosition}
              onChange={handleChange}
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

          {/* Section D: VITESSE DE MARCHE */}
          <h2>{t("sectionD_title")}</h2>
          <Form.Item
            label={t("walk_test_label")}
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
                {t("walk_speed")} :{" "}
                {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
              </div>
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
          <Button
            key="submit"
            type="primary"
            onClick={handleConfirm}
            disabled={false}
          >
            {t("button_confirm")}
          </Button>,
        ]}
      >
        {modalMessage}
      </Modal>
    </Row>
  );
}

export default EvaluationPACE;
