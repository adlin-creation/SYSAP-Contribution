
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useToken from "../Authentication/useToken";
import Constants from "../Utils/Constants";
import PatientData from "./PatientData"; 

export default function PatientViewPage() {
  const { id } = useParams();    
  const { token } = useToken();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    axios.get(`${Constants.SERVER_URL}/patient/${id}`, {
      headers: { Authorization: "Bearer " + token },
    })
    .then((res) => {
      setPatient(res.data);
    })
    .catch((err) => {
      console.error("Error fetching patient:", err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id, token]);

  if (loading) return <div>Loading patient details...</div>;
  if (!patient) return <div>No patient found.</div>;

  
  return <PatientData patient={patient} />;
}
