import React, { useState } from "react";
import { Row, Col, Input, Button, Form, Radio, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { InfoCircleOutlined } from "@ant-design/icons";

/**
 * Classe abstraite pour les composants d'évaluation
 * Cette classe contient les fonctionnalités communes aux évaluations MATCH, PACE et PATH
 */
function Evaluation({ 
  evaluationType, 
  getInitialFormData, 
  calculateScores, 
  renderFormFields, 
  buildPayload, 
  buildModalContent,
  exportPdf,  // Nouvelle prop pour la fonction d'exportation PDF
  validateForm // Prop facultative pour la validation personnalisée
}) {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData());
  const { token } = useToken();
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [scores, setScores] = useState(null);

  // Fonction pour déterminer si un test d'équilibre doit être activé
  const isBalanceTestEnabled = (testName) => {
    // Définir le seuil selon le type d'évaluation
    const threshold = evaluationType === "PATH" ? 5 : 10;
    
    switch (testName) {
      case 'balanceFeetTogether':
        return true; // Toujours activé
      case 'balanceSemiTandem':
        return parseFloat(formData.balanceFeetTogether || 0) >= threshold;
      case 'balanceTandem':
        return parseFloat(formData.balanceSemiTandem || 0) >= threshold;
      case 'balanceOneFooted':
        return parseFloat(formData.balanceTandem || 0) >= threshold;
      default:
        return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      if (name === 'balanceFeetTogether') {
        // Si pieds joints < 10 ou vide, réinitialiser les tests suivants
        if (value === "" || parseFloat(value) < 10) {
          const updatedForm = {
            ...prev,
            [name]: value,
            balanceSemiTandem: "",
            balanceTandem: "",
          };
          
          // Seulement pour PACE qui a un test d'équilibre supplémentaire
          if ('balanceOneFooted' in prev) {
            updatedForm.balanceOneFooted = "";
          }
          
          return updatedForm;
        }
      } else if (name === 'balanceSemiTandem') {
        // Si semi-tandem < 10 ou vide, réinitialiser les tests suivants
        if (value === "" || parseFloat(value) < 10) {
          const updatedForm = {
            ...prev,
            [name]: value,
            balanceTandem: "",
          };
          
          // Seulement pour PACE
          if ('balanceOneFooted' in prev) {
            updatedForm.balanceOneFooted = "";
          }
          
          return updatedForm;
        }
      } else if (name === 'balanceTandem' && 'balanceOneFooted' in prev) {
        // Uniquement pour PACE - si tandem < 10, réinitialiser one-footed
        if (value === "" || parseFloat(value) < 10) {
          return {
            ...prev,
            [name]: value,
            balanceOneFooted: "",
          };
        }
      } else if (name === "frtPosition" && value === "armNotWorking") {
        // Spécifique à PACE
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

    // Réinitialiser les erreurs pour le champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const defaultValidateForm = () => {
    const newErrors = {};

    // Validation commune
    if (!formData.chairTestCount) {
      newErrors.chairTestCount = "Le nombre de levers est requis";
    } else if (isNaN(formData.chairTestCount) || formData.chairTestCount < 0) {
      newErrors.chairTestCount = "Veuillez entrer un nombre valide";
    }

    // Valider seulement le test d'équilibre "pieds joints", qui est toujours obligatoire
    if (!formData.balanceFeetTogether) {
      newErrors.balanceFeetTogether = "Le temps est requis";
    } else if (isNaN(formData.balanceFeetTogether) || formData.balanceFeetTogether < 0) {
      newErrors.balanceFeetTogether = "Veuillez entrer un temps valide";
    }
    
    // Valider les autres tests d'équilibre s'ils contiennent des valeurs
    const balanceTests = ['balanceSemiTandem', 'balanceTandem', 'balanceOneFooted'];
    balanceTests.forEach(test => {
      if (formData[test] !== undefined && formData[test] && 
          (isNaN(formData[test]) || formData[test] < 0)) {
        newErrors[test] = "Veuillez entrer un temps valide";
      }
    });

    // Validation spécifique à PACE pour FRT
    if (formData.frtPosition !== undefined && formData.frtPosition !== "armNotWorking") {
      if (!formData.frtDistance) {
        newErrors.frtDistance = "La distance est requise";
      } else if (isNaN(formData.frtDistance) || formData.frtDistance < 0) {
        newErrors.frtDistance = "Veuillez entrer une distance valide";
      }
    }

    if (formData.canWalk === true) {
      if (!formData.walkingTime) {
        newErrors.walkingTime = "Le temps de marche est requis";
      } else if (isNaN(formData.walkingTime) || formData.walkingTime < 0) {
        newErrors.walkingTime = "Veuillez entrer un temps de marche valide";
      }
    }

    return newErrors;
  };

  const handleSubmit = () => {
    let newErrors = defaultValidateForm();
    
    if (validateForm) {
      newErrors = validateForm(formData, newErrors);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calculer les scores en utilisant la fonction fournie par la classe fille
    const calculatedScores = calculateScores(formData, isBalanceTestEnabled);
    setScores(calculatedScores);
    
    // Construire le contenu de la modale en utilisant la fonction fournie par la classe fille
    setModalMessage(buildModalContent(calculatedScores, formData));
    
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    // Calculer les scores à nouveau si nécessaire, ou utiliser ceux déjà calculés
    const currentScores = scores || calculateScores(formData, isBalanceTestEnabled);
    
    // Construire le payload en utilisant la fonction fournie par la classe fille
    const payload = buildPayload(formData, currentScores, patientId, isBalanceTestEnabled);

    if (!payload) {
      console.error("Aucune donnée à envoyer");
      return;
    }
    
    const endpoint = `/create-${evaluationType.toLowerCase()}-evaluation`;

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

      // Fermer la modale des résultats
      setIsModalVisible(false);

      // Afficher un message de succès
      Modal.success({
        title: "Succès",
        content: "Évaluation enregistrée avec succès",
        onOk: () => {
          // Rediriger vers la page des évaluations après confirmation
          navigate('/evaluations');
        }
      });
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

  // Fonction pour gérer l'export PDF
  const handleExportPdf = async () => {
    if (!exportPdf || !scores) return;
    
    try {
      const date = new Date().toISOString().split("T")[0];
      const payload = {
        date: date,
        ...buildPayload(formData, scores, patientId, isBalanceTestEnabled)
      };
      
      await exportPdf(payload, token);
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      Modal.error({
        title: "Erreur",
        content: "Échec de l'exportation du PDF"
      });
    }
  }

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

  const onClose = () => {
    navigate('/evaluations');
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={formData}
        >
          {/* Rendu des champs de formulaire spécifiques à chaque évaluation */}
          {renderFormFields(formData, handleChange, errors, isBalanceTestEnabled, calculateWalkingObjective)}

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
          exportPdf && (
            <Button key="export" onClick={handleExportPdf}>
              Télécharger PDF
            </Button>
          ),
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Fermer
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirm}>
            Confirmer
          </Button>,
        ]}
      >
        {modalMessage}
      </Modal>
    </Row>
  );
}

export default Evaluation;