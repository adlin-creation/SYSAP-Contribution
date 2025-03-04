import { Card, Button } from "antd";
import { useTranslation } from "react-i18next";

export default function PatientViewPage({ patient, onClose }) {
  const { t } = useTranslation();

  if (!patient) return <p>{t("Error loading patient data")}</p>;

  return (
    <div style={{ padding: 20 }}>
      <Card title={`${patient.firstname} ${patient.lastname}`} style={{ marginTop: 20 }}>
        <p><strong>{t("Patients:email")}</strong>: {patient.email}</p>
        <p><strong>{t("Patients:phone")}</strong>: {patient.phoneNumber}</p>
        <p><strong>{t("Patients:status")}</strong>: {patient.status}</p>
        <p><strong>{t("Patients:programs")}</strong>: {patient.numberOfPrograms}</p>
      </Card>
    </div>
  );
}
