import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button, Form, Modal as AntModal, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

function PatientDetails({ patient, onClose, refetchPatients }) {
  const idPatient = patient.id;
  const { t } = useTranslation();
  const { handleSubmit, control, setValue, getValues } = useForm();
  const { token } = useToken();
  const [caregivers, setCaregivers] = useState([]);

  // Charger les informations du patient dans le formulaire
  useEffect(() => {
    if (patient) {
      setValue("firstname", patient.firstname);
      setValue("lastname", patient.lastname);
      setValue("email", patient.email);
      setValue("phoneNumber", patient.phoneNumber);
      setValue("status", patient.status);
      setValue("numberOfPrograms", patient.numberOfPrograms);
      setValue("numberOfCaregivers", patient.numberOfCaregivers);
    }
  }, [patient, setValue]);

  // Charger les caregivers du patient
  useEffect(() => {
    const getPatientCaregivers = async () => {
      try {
        const response = await axios.get(
          `${Constants.SERVER_URL}/patient-caregivers/${idPatient}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCaregivers(response.data);
        response.data.forEach((caregiver, index) => {
          setValue(`caregivers[${index}].id`, caregiver.id);
          setValue(`caregivers[${index}].firstname`, caregiver.firstname);
          setValue(`caregivers[${index}].lastname`, caregiver.lastname);
          setValue(`caregivers[${index}].email`, caregiver.email);
          setValue(`caregivers[${index}].phoneNumber`, caregiver.phoneNumber);
          setValue(`caregivers[${index}].relationship`, caregiver.relationship);
        });
      } catch (err) {
        AntModal.error({
          content:
            err.response?.data?.message ||
            t("Patients:patient_caregivers_failed"),
          okText: t("Patients:close_button"),
          centered: true,
        });
      }
    };

    if (patient.numberOfCaregivers > 0) {
      getPatientCaregivers();
    }
  }, [idPatient, token, setValue]);

  const onSubmit = (data) => {
    const updatedCaregivers = getValues("caregivers");

    const patientData = {
      ...data,
      role: "patient",
      caregivers: updatedCaregivers,
    };

    axios
      .put(
        `${Constants.SERVER_URL}/update-patient-with-caregivers/${patient.id}`,
        patientData,
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(() => {
        refetchPatients();
        AntModal.success({
          content: t("Patients:patient_update_success"),
          okText: t("Patients:close_button"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        AntModal.error({
          content:
            err.response?.data?.message || t("Patients:patient_update_failed"),
          okText: t("Patients:close_button"),
          centered: true,
        });
      });
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:first_name")} required>
                <Controller
                  name="firstname"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("Patients:last_name")} required>
                <Controller
                  name="lastname"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:email")} required>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("Patients:phone_number")} required>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          {caregivers.length > 0 && (
            <>
              <h3>{t("Patients:caregivers_list")}</h3>
              {caregivers.map((_, index) => (
                <Row gutter={16} key={caregivers[index].id}>
                  <Col span={24}>
                    <h4>
                      {t("Patients:caregiver")} {index + 1}
                    </h4>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("Patients:first_name")} required>
                      <Controller
                        name={`caregivers[${index}].firstname`}
                        control={control}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("Patients:last_name")} required>
                      <Controller
                        name={`caregivers[${index}].lastname`}
                        control={control}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("Patients:email")} required>
                      <Controller
                        name={`caregivers[${index}].email`}
                        control={control}
                        render={({ field }) => (
                          <Input type="email" {...field} />
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("Patients:phone_number")} required>
                      <Controller
                        name={`caregivers[${index}].phoneNumber`}
                        control={control}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("Patients:relationship")} required>
                      <Controller
                        name={`caregivers[${index}].relationship`}
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <Select.Option value="parent">
                              {t("Patients:relation_parent")}
                            </Select.Option>
                            <Select.Option value="sibling">
                              {t("Patients:relation_sibling")}
                            </Select.Option>
                            <Select.Option value="friend">
                              {t("Patients:relation_friend")}
                            </Select.Option>
                            <Select.Option value="other">
                              {t("Patients:relation_other")}
                            </Select.Option>
                          </Select>
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t("Patients:patient_update")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
PatientDetails.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    status: PropTypes.string,
    numberOfPrograms: PropTypes.number,
    numberOfCaregivers: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  refetchPatients: PropTypes.func.isRequired,
};

export default PatientDetails;
