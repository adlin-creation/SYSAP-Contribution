import React, { useState } from "react";
import { Input, Button, Table, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";


function EvaluationSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleSearch = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/patients/search?term=${searchTerm}`);
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      }
      setLoading(false);
    };
  
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Nom",
        dataIndex: "lastname",
        key: "lastname",
      },
      {
        title: "Prénom",
        dataIndex: "firstname",
        key: "firstname",
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, patient) => (
          <div className="space-x-2">
            <Button 
              type="primary"
              onClick={() => window.location.href = `/evaluation-pace/${patient.id}`}
            >
              Évaluation PACE
            </Button>
            <Button disabled type="dashed">Évaluation PATH</Button>
            <Button disabled type="dashed">Évaluation MATCH</Button>
          </div>
        ),
      },
    ];
  
    return (
      <div className="p-6">
        <Card title="Recherche de patient pour évaluation" className="shadow-sm">
          <div className="mb-6">
            <div className="flex gap-4">
              <Input
                placeholder="Rechercher un patient par ID ou nom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                className="flex-grow"
              />
              <Button 
                type="primary" 
                onClick={handleSearch} 
                loading={loading}
              >
                Rechercher
              </Button>
            </div>
          </div>
  
          {patients.length > 0 ? (
            <Table
              columns={columns}
              dataSource={patients}
              rowKey="id"
              loading={loading}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Recherche en cours...' : 'Aucun résultat'}
            </div>
          )}
        </Card>
      </div>
    );
  }
  
  export default EvaluationSearch;