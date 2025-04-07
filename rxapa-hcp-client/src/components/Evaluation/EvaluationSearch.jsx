import React, { useState } from "react";
import { Input, Button, Table, Card, message } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

function EvaluationSearch() {
  const { t } = useTranslation("Evaluations");
  const { token } = useToken(); // Récupération du token d'authentification
  const [searchTerm, setSearchTerm] = useState(""); // Stocke la valeur de la recherche
  const [patients, setPatients] = useState([]); // Liste des patients récupérés
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur

  /**
   * Fonction pour naviguer vers la page d'affichage des évaluations
   */
  const navigateToEvaluations = (patientId) => {
    window.location.href = `/evaluations/patient/${patientId}`;
  };

  /**
   * Fonction pour effectue une recherche de patient par ID ou par nom
   */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Vérifie si l'entrée est vide
      message.warning(t("warn_missing_name_warning"));
      return;
    }

    setLoading(true);
    setPatients([]);
    setErrorMessage("");

    try {
      let endpoint;

      // Vérifie si l'entrée est un ID ( uniqument des chiffres)
      if (/^\d+$/.test(searchTerm)) {
        endpoint = `/patient/${searchTerm}`;
      } else {
        endpoint = `/patients/search?term=${searchTerm}`;
      }

      console.log(`Envoi de la requête: ${Constants.SERVER_URL}${endpoint}`);

      const response = await fetch(`${Constants.SERVER_URL}${endpoint}`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!response.ok) {
        throw new Error(t("error_getting_patients"));
      }

      const data = await response.json();
      console.log("Données reçues:", data); // Debug : afficher la réponse de l'API

      if (!data || (Array.isArray(data) && data.length === 0)) {
        setErrorMessage(t("error_no_patients")); // Message si aucun résultat
      } else {
        // Si l'API retourne un seul objet patient, on le convertit en tableau
        setPatients(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error(" Erreur lors de la recherche:", error);
      setErrorMessage(t("error_search"));
    } finally {
      setLoading(false); // Arrêter le chargement une fois la requête terminée
    }
  };

  /**
   * Fonction pour réinitialiser la recherche
   */
  const clearSearch = () => {
    setSearchTerm("");
    setPatients([]);
    setErrorMessage("");
  };

  /**
   * Définition des colonnes du tableau d'affichage des patients
   */
  const columns = [
    {
      title: t("title_table_column_lastname"),
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: t("title_table_column_firstname"),
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: t("title_table_column_birthday"),
      dataIndex: "birthday",
      key: "Birthday",
    },
    {
      title: t("title_actions"),
      key: "actions",
      render: (_, patient) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <Button
              type="primary"
              onClick={() =>
                (window.location.href = `/evaluation-pace/${patient.id}`)
              }
              disabled={!patient.id}
            >
              {t("button_pace")}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                (window.location.href = `/evaluation-path/${patient.id}`)
              }
              disabled={!patient.id}
            >
              {t("button_path")}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                (window.location.href = `/evaluation-match/${patient.id}`)
              }
              disabled={!patient.id}
            >
              {t("button_match")}
            </Button>
          </div>

          <Button
            type="primary"
            onClick={() => navigateToEvaluations(patient.id)}
          >
            {t("button_show_evaluations")}
          </Button>
        </div>
      ),
      width: "60%", // Assurer que la colonne est suffisamment large
    },
  ];

  return (
    <div className="p-6">
      <Card title={t("search_title")} className="shadow-sm">
        <div className="mb-6" style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Champs de recherche */}
            <div style={{ flex: 1, marginRight: "8px" }}>
              <Input
                placeholder={t("placeholder_search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                suffix={
                  searchTerm && (
                    <Button
                      onClick={clearSearch}
                      size="small"
                      icon={<CloseOutlined />}
                    />
                  )
                }
              />
            </div>
            {/* Bouton de recherche */}
            <Button type="primary" onClick={handleSearch} loading={loading}>
              Rechercher
            </Button>
          </div>
        </div>

        {/* Affichage messages d'erreur */}
        {errorMessage ? (
          <div className="text-center py-8 text-red-500">
            {errorMessage === "Aucun patient trouvé."
              ? t("error_no_patients")
              : t("error_search")}
          </div>
        ) : (
          // Tableau d'affichage des patients
          <Table
            columns={columns}
            dataSource={patients}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            bordered
          />
        )}
      </Card>
    </div>
  );
}

export default EvaluationSearch;
