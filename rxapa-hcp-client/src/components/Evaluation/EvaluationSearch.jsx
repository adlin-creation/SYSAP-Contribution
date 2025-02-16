import React, { useState } from "react";
import { Input, Button, Table, Card, message } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";

function EvaluationSearch() {
    const { token } = useToken();
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            message.warning("Veuillez entrer un ID ou un nom.");
            return;
        }

        setLoading(true);
        setPatients([]);
        setErrorMessage("");

        try {
            const response = await fetch(`${Constants.SERVER_URL}/patients/search?term=${searchTerm}`, {
                headers: { Authorization: "Bearer " + token },
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des patients");
            }

            const data = await response.json();
            if (data.length === 0) {
                setErrorMessage("Aucun patient trouvé.");
            } else {
                setPatients(data);
            }
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            setErrorMessage("Erreur lors de la recherche. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setPatients([]);
        setErrorMessage("");
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
                        disabled={!patient.id}
                    >
                        Évaluation PACE
                    </Button>
                    <Button type="dashed" disabled>Évaluation PATH</Button>
                    <Button type="dashed" disabled>Évaluation MATCH</Button>
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
                            suffix={searchTerm && <Button onClick={clearSearch} size="small" icon={<CloseOutlined />} />}
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

                {errorMessage ? (
                    <div className="text-center py-8 text-red-500">{errorMessage}</div>
                ) : (
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
