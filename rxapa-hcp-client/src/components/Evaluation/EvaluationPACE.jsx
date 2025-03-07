import React, { useState } from "react";
import { Row, Col, Input, Button, Form, Radio, Modal } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";

function EvaluationPACE({ onSubmit }) {
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
      newErrors.chairTestCount = "Le nombre de levers est requis";
    } else if (isNaN(formData.chairTestCount) || formData.chairTestCount < 0) {
      newErrors.chairTestCount = "Veuillez entrer un nombre valide";
    }

    [
      "balanceFeetTogether",
      "balanceSemiTandem",
      "balanceTandem",
      "balanceOneFooted",
    ].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Le temps est requis";
      } else if (isNaN(formData[field]) || formData[field] < 0) {
        newErrors[field] = "Veuillez entrer un temps valide";
      }
    });

    if (formData.frtPosition !== "armNotWorking") {
      // Seulement valider si ce n'est pas "Ne lève pas les bras"
      if (!formData.frtDistance) {
        newErrors.frtDistance = "La distance est requise";
      }
    }

    if (!formData.walkingTime) {
      newErrors.walkingTime = "Le temps de marche est requis";
    } else if (isNaN(formData.walkingTime) || formData.walkingTime <= 0) {
      newErrors.walkingTime = "Veuillez entrer un temps de marche valide";
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
          Résultats de l'évaluation
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>Scores individuels :</strong>
          <p>A. Cardio-musculaire : {scoreA}/6</p>
          <p>B. Équilibre : {scoreB}/6</p>
          <p>C. Mobilité : {scoreC}/6</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Score Total : {totalScore}/18</strong>
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
            <strong>Niveau : {level}</strong>
          </p>
          <p>
            <strong>
              Programme recommandé : {color} {level}
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
              Vitesse de marche :{" "}
              {(4 / parseFloat(formData.walkingTime)).toFixed(2)} m/s
            </p>
            <p>
              <strong>
                Objectif de marche :{" "}
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
        program: determineColor(scoreA, scoreB, scoreC) + " " + determineLevel(scoreTotal)
      }
    };
  
    if (!payload) {
      console.error("Aucune donnée à envoyer");
      return;
    }
    const endpoint = "/create-evaluation";
    
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
    if (scoreA === scoreB && scoreB === scoreC) return "MARRON";

    // Si deux scores sont égaux et minimum
    if (scoreA === scoreB && scoreA === min) return "VERT";
    if (scoreB === scoreC && scoreB === min) return "ORANGE";
    if (scoreC === scoreA && scoreC === min) return "VIOLET";

    // Si un seul score est minimum
    if (scoreA === min) return "BLEU";
    if (scoreB === min) return "JAUNE";
    if (scoreC === min) return "ROUGE";

    return "MARRON"; // Cas par défaut
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
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={formData}
        >
          {/* Section A: CARDIO-MUSCULAIRE */}
          <h2>A. CARDIO-MUSCULAIRE</h2>
          <Form.Item label="Test de la chaise en 30 secondes">
            <Radio.Group
              name="chairTestSupport"
              value={formData.chairTestSupport}
              onChange={handleChange}
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
              <Radio value={true}>Assis</Radio>
              <Radio value={false}>Debout</Radio>
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
              disabled={formData.frtPosition === "armNotWorking"}
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
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleConfirm}
            disabled={false}
          >
            Confirmer
          </Button>,
        ]}
      >
        {modalMessage}
      </Modal>
    </Row>
  );
}

export default EvaluationPACE;
