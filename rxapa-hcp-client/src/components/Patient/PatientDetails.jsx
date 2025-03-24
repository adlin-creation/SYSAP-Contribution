import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Modal as AntModal,
  Select,
  DatePicker,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

function PatientDetails({ patient, onClose, refetchPatients }) {
  const { t } = useTranslation();
  const { handleSubmit, control, setValue } = useForm();
  const { token } = useToken();
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    if (patient) {
      setValue("firstname", patient.firstname);
      setValue("lastname", patient.lastname);
      setValue("email", patient.email);
      setValue("phoneNumber", patient.phoneNumber);
      setValue("status", patient.status);
      setValue("numberOfPrograms", patient.numberOfPrograms);
      setValue("numberOfCaregivers", patient.numberOfCaregivers);
      setValue("birthday", patient.birthday ? dayjs(patient.birthday) : null);
      setValue("weight", patient.weight);
      setValue("weightUnit", patient.weightUnit);
    }
  }, [patient, setValue]);

  useEffect(() => {
    const getPatientCaregivers = async () => {
      try {
        const response = await axios.get(
          `${Constants.SERVER_URL}/patient-caregivers/${patient.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCaregivers(response.data);
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
  }, [patient.id, token, t, patient.numberOfCaregivers]);

  useEffect(() => {
    if (caregivers.length > 0) {
      caregivers.forEach((caregiver, index) => {
        setValue(`caregivers[${index}].firstname`, caregiver.firstname);
        setValue(`caregivers[${index}].lastname`, caregiver.lastname);
        setValue(`caregivers[${index}].email`, caregiver.email);
        setValue(`caregivers[${index}].phoneNumber`, caregiver.phoneNumber);
        setValue(`caregivers[${index}].relationship`, caregiver.relationship);
      });
    }
  }, [caregivers, setValue]);

  const onSubmit = (data) => {
    const patientData = {
      ...data,
      weight: Number(data.weight),
      birthday: data.birthday ? data.birthday.format("YYYY-MM-DD") : null,
      role: "patient",
      caregivers: caregivers || [],
    };

    axios
      .put(
        `${Constants.SERVER_URL}/update-patient-with-caregivers/${patient.id}`,
        patientData,
        {
          headers: { Authorization: "Bearer " + token },
        }
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
                  defaultValue=""
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("Patients:last_name")} required>
                <Controller
                  name="lastname"
                  control={control}
                  defaultValue=""
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
                  defaultValue=""
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("Patients:phone_number")} required>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:weight")} required>
                <Controller
                  name="weight"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input type="number" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("Patients:weight_unit")} required>
                <Controller
                  name="weightUnit"
                  control={control}
                  defaultValue="kg"
                  render={({ field }) => (
                    <Select {...field} style={{ width: "100%" }}>
                      <Select.Option value="kg">kg</Select.Option>
                      <Select.Option value="lbs">lbs</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:birthday")} required>
                <Controller
                  name="birthday"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      format="YYYY-MM-DD"
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Caregivers */}
          {caregivers.length > 0 && (
            <>
              <h3>{t("Patients:caregivers_list")}</h3>
              {caregivers.map((_, index) => (
                <Row gutter={16} key={caregivers[index].id}>
                  <Col span={12}>
                    <Form.Item label={t("Patients:first_name")} required>
                      <Controller
                        name={`caregivers[${index}].firstname`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={t("Patients:last_name")} required>
                      <Controller
                        name={`caregivers[${index}].lastname`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} />}
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
  patient: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchPatients: PropTypes.func.isRequired,
};

export default PatientDetails;
