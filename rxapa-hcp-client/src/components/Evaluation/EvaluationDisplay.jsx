import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Empty,
  Spin,
  Typography,
  Space,
  Result,
} from "antd";
import { LeftOutlined, LockOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";

const { Title, Text } = Typography;

function EvaluationDisplay() {
  const { t } = useTranslation("Evaluations");
  const { token, user } = useToken(); // Récupération du token d'authentification
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
  const [evaluations, setEvaluations] = useState([]); // Liste des évaluations récupérées
  const [patient, setPatient] = useState(null); // Informations du patient
  const navigate = useNavigate();
  const { patientId } = useParams(); // Récupère l'ID du patient depuis l'URL

  const hasAccess =
    user && (user.role === "kinesiologue" || user.role === "admin");

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (patientId) {
        const response = await fetch(`${Constants.SERVER_URL}/${patientId}`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du patient");
        }

        const patientData = await response.json();
        setPatient(patientData);
      }

      const endpoint = patientId
        ? `/afficher-evaluations/${patientId}`
        : "/evaluations";

      const evaluationsResponse = await fetch(
        `${Constants.SERVER_URL}${endpoint}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!evaluationsResponse.ok) {
        throw new Error("Erreur lors de la récupération des évaluations");
      }

      const evaluationsData = await evaluationsResponse.json();

      const sortedEvaluations = evaluationsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      sortedEvaluations(sortedEvaluations);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setErrorMessage(
        "Une erreur est survenue lors du chargement des données."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate(-1);
  };

  const renderSection = (title, content) => (
    <Col span={8}>
      <Title level={5}>{title}</Title>
      {content.map((item, index) => (
        <div
          key={index}
          style={{ marginBottom: index < content.length - 1 ? 16 : 0 }}
        >
          <Text>{item}</Text>
        </div>
      ))}
    </Col>
  );

  const renderEvaluation = (evaluation, index) => {
    // Déterminer le type d'évaluation et extraire les données
    let type = "Inconnu";
    let cardioData = [];
    let equilibreData = [];
    let mobiliteData = [];
    let scoreTotal = "";
    let programmeRecommande = "";
    let vitesseMarche = "";

    if (evaluation.Evaluation_PACE) {
      const pace = evaluation.Evaluation_PACE;
      type = "PACE";
      scoreTotal = `${pace.scoreTotal}/18`;
      programmeRecommande = evaluation.Program?.name;
      vitesseMarche = pace.vitesseDeMarche?.toFixed(2);

      cardioData = [
        pace.chairTestSupport ? "Avec appui" : "Sans appui",
        `Nombre de levers : ${pace.chairTestCount}`,
      ];

      equilibreData = [
        "Dernier test effectué : Unipodal",
        `Temps (seconde) : ${pace.BalanceOneFooted}`,
      ];

      mobiliteData = [
        pace.frtSitting ? "Assis" : "Debout",
        `Distance (cm) : ${pace.frtDistance}`,
      ];
    } else if (evaluation.Evaluation_PATH) {
      const path = evaluation.Evaluation_PATH;
      type = "PATH";
      scoreTotal = path.scoreTotal;
      programmeRecommande = evaluation.Program?.name;
      vitesseMarche = path.vitesseDeMarche?.toFixed(2);

      cardioData = [
        path.chairTestSupport ? "Avec appui" : "Sans appui",
        `Nombre de levers : ${path.chairTestCount}`,
      ];

      equilibreData = [
        "Dernier test effectué : Unipodal",
        `Temps (seconde) : ${path.balanceTandem}`,
      ];
    } else if (evaluation.Evaluation_MATCH) {
      const match = evaluation.Evaluation_MATCH;
      type = "MATCH";
      scoreTotal = `${match.scoreTotal}/9`;
      programmeRecommande = evaluation.Program?.name;
      vitesseMarche = match.vitesseDeMarche?.toFixed(2);

      cardioData = [
        match.chairTestSupport ? "Avec appui" : "Sans appui",
        `Nombre de levers : ${match.chairTestCount}`,
      ];

      equilibreData = [
        "Dernier test effectué : Unipodal",
        `Temps (seconde) : ${match.balanceTandem}`,
      ];
    }

    return (
      <Card key={evaluation.id} style={{ marginBottom: 20, borderRadius: 8 }}>
        <Row>
          <Col span={24}>
            <Title level={4} style={{ marginBottom: 4 }}>
              Évaluation {evaluations.length - index} :
            </Title>
            <Text strong>Type : {type}</Text>
            <br />
            <Text strong>Score total : {scoreTotal}</Text>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginTop: 20 }}>
          {renderSection("Cardio-musculaire :", cardioData)}
          {renderSection("Équilibre :", equilibreData)}
          {type === "PACE" && renderSection("Mobilité :", mobiliteData)}
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col span={24}>
            <Text strong>Programme recommandé : {programmeRecommande}</Text>
            <br />
            <Text strong>Vitesse de marche (m/s) : {vitesseMarche}</Text>
          </Col>
        </Row>
      </Card>
    );
  };

  // Rendu principal du composant
  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" icon={<LeftOutlined />} onClick={handleReturn}>
            Retourner
          </Button>
        </div>

        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20 }}
        >
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Version 1
            </Title>
          </Col>
          <Col>
            {patient && (
              <Title level={3} style={{ margin: 0 }}>
                {patient.firstname} {patient.lastname}
              </Title>
            )}
          </Col>
        </Row>

        <Title level={3}>Évaluations effectuées</Title>

        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : errorMessage ? (
          <div className="text-center py-8 text-red-500">{errorMessage}</div>
        ) : evaluations.length === 0 ? (
          <Empty description="Aucune évaluation trouvée" />
        ) : (
          evaluations.map((evaluation, index) =>
            renderEvaluation(evaluation, index)
          )
        )}
      </Card>
    </div>
  );
}

export default EvaluationDisplay;
