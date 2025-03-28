import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Empty, Spin, Typography, Result } from "antd";
import { LeftOutlined, LockOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import { exportMatchPdf, exportPacePdf, exportPathPdf } from "./ExportEvaluationPdf";

const { Title, Text } = Typography;

function EvaluationDisplay() {
  const { t } = useTranslation("Evaluations");
  const { token } = useToken(); // Récupération du token d'authentification
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
  const [evaluations, setEvaluations] = useState([]); // Liste des évaluations récupérées
  const [patient, setPatient] = useState(null); // Informations du patient
  const navigate = useNavigate();
  const { patientId } = useParams(); // Récupère l'ID du patient depuis l'URL
  // version 2 a décommenter
  const [expandedEvaluation, setExpandedEvaluation] = useState(null); // ID de l'évaluation déployée

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // Récupération des informations du patient si un ID est fourni
      if (patientId) {
        try {
          console.log(
            `Récupération du patient: ${Constants.SERVER_URL}/patients/${patientId}`
          );
          const response = await fetch(
            `${Constants.SERVER_URL}/patients/${patientId}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          );

          if (!response.ok) {
            console.error(
              `Erreur patient: ${response.status} ${response.statusText}`
            );
            throw new Error(
              `Erreur ${response.status}: ${response.statusText}`
            );
          }

          const patientData = await response.json();
          setPatient(patientData);
          console.log("Patient récupéré:", patientData);
        } catch (patientError) {
          console.error("Erreur détaillée (patient):", patientError);
          // On continue même si la récupération du patient échoue
        }
      }

      // Récupération des évaluations
      const endpoint = patientId
        ? `evaluations/patient/${patientId}`
        : "evaluations";

      console.log(
        `Récupération des évaluations: ${Constants.SERVER_URL}/${endpoint}`
      );

      const evaluationsResponse = await fetch(
        `${Constants.SERVER_URL}/${endpoint}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!evaluationsResponse.ok) {
        console.error(
          `Erreur évaluations: ${evaluationsResponse.status} ${evaluationsResponse.statusText}`
        );
        throw new Error(
          `Erreur ${evaluationsResponse.status}: ${evaluationsResponse.statusText}`
        );
      }

      // Récupérer le texte brut pour le déboguer avant de le parser
      const responseText = await evaluationsResponse.text();
      console.log("Réponse brute:", responseText);

      // Vérifier si la réponse est vide ou non JSON
      if (!responseText || responseText.trim() === "") {
        throw new Error("La réponse du serveur est vide");
      }

      let evaluationsData;
      try {
        evaluationsData = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Erreur de parsing JSON:", jsonError);
        console.error("Contenu reçu:", responseText);
        throw new Error(`Erreur de format JSON: ${jsonError.message}`);
      }

      console.log("Évaluations récupérées:", evaluationsData);

      if (Array.isArray(evaluationsData)) {
        const sortedEvaluations = evaluationsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setEvaluations(sortedEvaluations);
      } else {
        console.error(
          "Les données d'évaluations ne sont pas un tableau:",
          evaluationsData
        );
        setErrorMessage("Format de données incorrect pour les évaluations");
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      setErrorMessage(
        `Erreur: ${
          error.message ||
          "Une erreur est survenue lors du chargement des données."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate(-1);
  };

  const handleExportPdf = async (evaluation, programmeRecommande) => {
    let matchPath = null;
    if (evaluation.Evaluation_MATCH) matchPath = evaluation.Evaluation_MATCH;
    if (evaluation.Evaluation_PATH) matchPath = evaluation.Evaluation_PATH;

    if (matchPath) {
      const payload = {
        date: matchPath.createdAt.split("T")[0],
        idPatient : patientId,
        chairTestSupport: matchPath.chairTestSupport === "true"? "without":"with",
        chairTestCount: matchPath.chairTestCount,
        balanceFeetTogether: matchPath.BalanceFeetTogether,
        balanceSemiTandem: matchPath.balanceSemiTandem,
        balanceTandem: matchPath.balanceTandem,
        walkingTime: matchPath.vitesseDeMarche != 0? 
          Math.round((4 / matchPath.vitesseDeMarche) * 100)/100:0,
        scores : {
          cardioMusculaire: matchPath.scoreCM,
          equilibre: matchPath.scoreBalance,
          total: matchPath.scoreTotal,
          program: programmeRecommande
        }
      }
      if (evaluation.Evaluation_MATCH) await exportMatchPdf(payload, token);
      if (evaluation.Evaluation_PATH) await exportPathPdf(payload, token);
    }

    if (evaluation.Evaluation_PACE) {
      const pace = evaluation.Evaluation_PACE;
      const payload = {
        date: pace.createdAt.split("T")[0],
        idPatient : patientId,
        chairTestSupport: pace.chairTestSupport === "true"? "without":"with",
        chairTestCount: pace.chairTestCount,
        balanceFeetTogether: pace.BalanceFeetTogether,
        balanceSemiTandem: pace.balanceSemiTandem,
        balanceTandem: pace.balanceTandem,
        balanceOneFooted: pace.balanceOneFooted,
        frtSitting: pace.frtSitting === "true"? "sitting":"standing",
        frtDistance: pace.frtDistance,
        walkingTime: pace.vitesseDeMarche != 0? 
          Math.round((4 / pace.vitesseDeMarche) * 100)/100:0,
        scores : {
          cardioMusculaire: pace.scoreA,
          equilibre: pace.scoreB,
          mobilite: pace.scoreC,
          color: programmeRecommande.split(" ")[0],
          level: programmeRecommande.split(" ")[1],
          program: programmeRecommande
        }
      }
      exportPacePdf(payload, token);
    }
  }


  // Version 2 avec toggle buttons a décommenter
  /*
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();

    // Liste des mois en français
    const months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const toggleEvaluation = (evaluationId) => {
    if (expandedEvaluation === evaluationId) {
      setExpandedEvaluation(null); // Fermer si déjà ouvert
    } else {
      setExpandedEvaluation(evaluationId); // Ouvrir sinon
    }
  };
*/
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

  // A commenter pour tester la version 2 (v1)

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
      programmeRecommande = evaluation.Program?.name || "";
      vitesseMarche = pace.vitesseDeMarche?.toFixed(2) || "0.00";

      cardioData = [
        pace.chairTestSupport ? "Avec appui" : "Sans appui",
        `Nombre de levers : ${pace.chairTestCount}`,
      ];

      equilibreData = [
        "Dernier test effectué : Unipodal",
        `Temps (seconde) : ${pace.balanceOneFooted}`,
      ];

      mobiliteData = [
        pace.frtSitting ? "Assis" : "Debout",
        `Distance (cm) : ${pace.frtDistance}`,
      ];
    } else if (evaluation.Evaluation_PATH) {
      const path = evaluation.Evaluation_PATH;
      type = "PATH";
      scoreTotal = path.scoreTotal;
      programmeRecommande = evaluation.Program?.name || "";
      vitesseMarche = path.vitesseDeMarche?.toFixed(2) || "0.00";

      cardioData = [
        path.chairTestSupport ? "Avec appui" : "Sans appui",
        `Nombre de levers : ${path.chairTestCount}`,
      ];

      equilibreData = [
        "Dernier test effectué : Tandem",
        `Temps (seconde) : ${path.balanceTandem}`,
      ];
    } else if (evaluation.Evaluation_MATCH) {
      const match = evaluation.Evaluation_MATCH;
      type = "MATCH";
      scoreTotal = `${match.scoreTotal}/9`;
      programmeRecommande = evaluation.Program?.name || "";
      vitesseMarche = match.vitesseDeMarche?.toFixed(2) || "0.00";

      cardioData = [
        match.chairTestSupport ? "Avec appui" : "Sans appui",
        `Nombre de levers : ${match.chairTestCount}`,
      ];

      equilibreData = [
        "Dernier test effectué : Tandem",
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
        <br />
        <Button key="export" onClick={() => handleExportPdf(evaluation, programmeRecommande)}>
          Télécharger PDF
        </Button>
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
          <Result
            status="error"
            title="Erreur de chargement"
            subTitle={errorMessage}
            extra={
              <Button type="primary" onClick={fetchData}>
                Réessayer
              </Button>
            }
          />
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

  // jusqu'ici (v1)**

  // version 2 a décommenter
  /*
  const renderEvaluation = (evaluation, index) => {
    // Déterminer le type d'évaluation et extraire les données
    let type = "Inconnu";
    let cardioData = {};
    let equilibreData = {};
    let mobiliteData = {};
    let scoreTotal = "";
    let programmeRecommande = "";
    let vitesseMarche = "";

    if (evaluation.Evaluation_PACE) {
      const pace = evaluation.Evaluation_PACE;
      type = "PACE";
      scoreTotal = `${pace.scoreTotal}/18`;
      programmeRecommande = evaluation.Program?.name || "";
      vitesseMarche = pace.vitesseDeMarche?.toFixed(2) || "0.00";

      cardioData = {
        support: pace.chairTestSupport ? "Avec appui" : "Sans appui",
        count: pace.chairTestCount || 0,
      };

      equilibreData = {
        test: "Unipodal",
        time: pace.balanceOneFooted || 0,
      };

      mobiliteData = {
        position: pace.frtSitting ? "Assis" : "Debout",
        distance: pace.frtDistance || 0,
      };
    } else if (evaluation.Evaluation_PATH) {
      const path = evaluation.Evaluation_PATH;
      type = "PATH";
      scoreTotal = path.scoreTotal;
      programmeRecommande = evaluation.Program?.name || "";
      vitesseMarche = path.vitesseDeMarche?.toFixed(2) || "0.00";

      cardioData = {
        support: path.chairTestSupport ? "Avec appui" : "Sans appui",
        count: path.chairTestCount || 0,
      };

      equilibreData = {
        test: "Tandem",
        time: path.balanceTandem || 0,
      };
    } else if (evaluation.Evaluation_MATCH) {
      const match = evaluation.Evaluation_MATCH;
      type = "MATCH";
      scoreTotal = `${match.scoreTotal}/9`;
      programmeRecommande = evaluation.Program?.name || "";
      vitesseMarche = match.vitesseDeMarche?.toFixed(2) || "0.00";

      cardioData = {
        support: match.chairTestSupport ? "Avec appui" : "Sans appui",
        count: match.chairTestCount || 0,
      };

      equilibreData = {
        test: "Tandem",
        time: match.balanceTandem || 0,
      };
    }

    const isExpanded = expandedEvaluation === evaluation.id;
    const evaluationNumber = evaluations.length - index;

    return (
      <div
        key={evaluation.id}
        style={{
          marginBottom: 20,
          borderRadius: 8,
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col span={8}>
            <Title level={4} style={{ margin: 0 }}>
              Évaluation {evaluationNumber} :
            </Title>
          </Col>

          <Col span={8}>
            <Text strong style={{ fontSize: "16px" }}>
              Date : {formatDate(evaluation.createdAt)}
            </Text>
          </Col>

          <Col span={6}>
            <Text strong style={{ fontSize: "16px" }}>
              Type : {type}
            </Text>
          </Col>

          <Col span={2} style={{ textAlign: "right" }}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              style={{ backgroundColor: "#1890ff" }}
              onClick={() => toggleEvaluation(evaluation.id)}
            />
          </Col>
        </Row>

        {isExpanded && (
          <div style={{ marginTop: 20 }}>
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <div>Score total : {scoreTotal}</div>
                <div>Programme recommandé : {programmeRecommande}</div>
                <div>Vitesse de marche (m/s) : {vitesseMarche}</div>
              </Col>

              <Col span={8}>
                <div>
                  <strong>Cardio-musculaire :</strong>
                  <div>{cardioData.support}</div>
                  <div>Nombre de levers : {cardioData.count}</div>
                </div>
              </Col>

              <Col span={8}>
                <div>
                  <strong>Équilibre :</strong>
                  <div>Dernier test effectué : {equilibreData.test}</div>
                  <div>Temps (seconde) : {equilibreData.time}</div>
                </div>
              </Col>

              {type === "PACE" && (
                <Col span={8} offset={8}>
                  <div>
                    <strong>Mobilité :</strong>
                    <div>{mobiliteData.position}</div>
                    <div>Distance (cm) : {mobiliteData.distance}</div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm" bodyStyle={{ padding: "24px" }}>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={handleReturn}
            >
              Retourner
            </Button>
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
            {patient && (
              <Title level={4} style={{ margin: 0 }}>
                {patient.firstname} {patient.lastname}
              </Title>
            )}
          </Col>
          <Col span={8}></Col>
        </Row>

        <Title level={3}>Évaluations effectuées</Title>

        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : errorMessage ? (
          <Result
            status="error"
            title="Erreur de chargement"
            subTitle={errorMessage}
            extra={
              <Button type="primary" onClick={fetchData}>
                Réessayer
              </Button>
            }
          />
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
  */
}

export default EvaluationDisplay;
