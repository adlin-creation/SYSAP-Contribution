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
   * Fonction pour effectue une recherche de patient par ID ou par nom
   */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Vérifie si l'entrée est vide
      message.warning("Veuillez entrer un nom.");
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
        throw new Error("Erreur lors de la récupération des patients");
      }

      const data = await response.json();
      console.log("Données reçues:", data); // Debug : afficher la réponse de l'API

      if (!data || (Array.isArray(data) && data.length === 0)) {
        setErrorMessage("Aucun patient trouvé."); // Message si aucun résultat
      } else {
        // Si l'API retourne un seul objet patient, on le convertit en tableau
        setPatients(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error(" Erreur lors de la recherche:", error);
      setErrorMessage("Erreur lors de la recherche. Veuillez réessayer.");
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
      title: t("table_column_lastname"),
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: t("table_column_firstname"),
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: t("table_column_birthday"),
      dataIndex: "birthday",
      key: "Birthday",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, patient) => (
        <div className="space-x-2">
          {/* Bouton pour accéder à l'évaluation du patient */}
          <Button
            type="primary"
            onClick={() =>
              (window.location.href = `/evaluation-pace/${patient.id}`)
            }
            disabled={!patient.id}
          >
            Évaluation PACE
          </Button>
          {/* Bouton pour l'évaluation PATH */}
          <Button
            type="primary"
            onClick={() =>
              (window.location.href = `/evaluation-path/${patient.id}`)
            }
            disabled={!patient.id}
          >
            Évaluation PATH
          </Button>
          <Button type="dashed" disabled>
            Évaluation MATCH
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card title={t("search_title")} className="shadow-sm">
        <div className="mb-6">
          <div className="flex gap-4">
            {/* Champs de recherche*/}
            <Input
              placeholder={t("search_placeholder")}
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
              className="flex-grow"
            />
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
          // Tableau d'affichage des patientss
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
