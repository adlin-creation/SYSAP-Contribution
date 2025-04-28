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
  const { t } = useTranslation("Patients");
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
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
      setValue("otherinfo", patient.otherinfo);
    }
  }, [patient, setValue]);

  // Charger les caregivers du patient
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
            t(`Backend:${err.response?.data?.message}`) ||
            t("fetch_error_caregiver"),
          okText: t("button_close"),
          centered: true,
        });
      }
    };
    if (patient.numberOfCaregivers > 0) {
      getPatientCaregivers();
    }
  }, [patient.id, token, t, patient.numberOfCaregivers, setValue]);

  const onSubmit = (data) => {
    const updatedCaregivers = getValues("caregivers");
    const patientData = {
      ...data,
      weight: Number(data.weight),
      birthday: data.birthday ? data.birthday.format("YYYY-MM-DD") : null,
      role: "patient",
      caregivers: updatedCaregivers || [],
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
          content: t("success_patient_update"),
          okText: t("button_close"),
          centered: true,
          onOk: () => {
            onClose();
          },
        });
      })
      .catch((err) => {
        const errorMessage =
          t(`Backend:${err.response?.data?.message}`) ||
          t("error_patient_update");
        AntModal.error({
          content: errorMessage,
          okText: t("button_close"),
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
              <Form.Item
                label={t("label_first_name")}
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: t("error_first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("error_last_name_min_length"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_last_name")}
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: t("error_last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("error_last_name_min_length"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_email")}
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("error_email_required"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("error_email_invalid"),
                    },
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_phone_number")}
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: t("error_phone_number_required"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("error_phone_number_invalid"),
                    },
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_programs_quantity")}
                required
                validateStatus={errors.numberOfPrograms ? "error" : ""}
                help={errors.numberOfPrograms?.message}
              >
                <Controller
                  name="numberOfPrograms"
                  control={control}
                  rules={{
                    required: t("error_programs_quantity_required"),
                    min: {
                      value: 0,
                      message: t("error_programs_quantity_invalid"),
                    },
                  }}
                  render={({ field }) => <Input type="number" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_status")}
                required
                validateStatus={errors.status ? "error" : ""}
                help={errors.status?.message}
              >
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: t("error_status_required") }}
                  render={({ field }) => (
                    <Select {...field}>
                      <Select.Option value="active">
                        {t("option_active")}
                      </Select.Option>
                      <Select.Option value="paused">
                        {t("option_paused")}
                      </Select.Option>
                      <Select.Option value="waiting">
                        {t("option_waiting")}
                      </Select.Option>
                      <Select.Option value="completed">
                        {t("option_completed")}
                      </Select.Option>
                      <Select.Option value="abort">
                        {t("option_abort")}
                      </Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_weight")}
                required
                validateStatus={errors.weight ? "error" : ""}
                help={errors.weight?.message}
              >
                <Controller
                  name="weight"
                  control={control}
                  rules={{
                    required: t("error_weight_required"),
                    pattern: {
                      value: /^\d{1,3}(\.\d{1})?$/, // Nombre entre 0 et 999.9
                      message: t("error_weight_invalid"),
                    },
                  }}
                  defaultValue=""
                  render={({ field }) => <Input type="number" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_weight_unit")}
                required
                validateStatus={errors.weightUnit ? "error" : ""}
                help={errors.weight?.message}
              >
                <Controller
                  name="weightUnit"
                  control={control}
                  defaultValue="kg"
                  render={({ field }) => (
                    <Select {...field} style={{ width: "100%" }}>
                      <Select.Option value="kg">{t("option_kg")}</Select.Option>
                      <Select.Option value="lbs">
                        {t("option_lbs")}
                      </Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_birthday")}
                required
                validateStatus={errors.birthday ? "error" : ""}
                help={errors.birthday?.message}
              >
                <Controller
                  name="birthday"
                  control={control}
                  rules={{
                    required: t("error_birthday_required"),
                    pattern: {
                      value: /^\d{1,3}(\.\d{1})?$/, // Nombre entre 0 et 999.9
                      message: t("error_birthday_invalid"),
                    },
                  }}
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
            <Col span={12}>
              <Form.Item label={t("label_additionnal_information")}>
                <Controller
                  name="otherinfo"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder={t("placeholder_additionnal_information")}
                      rows={4}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Caregivers */}
          {caregivers.length > 0 && (
            <>
              <h3>{t("title_caregiver_list")}</h3>
              {caregivers.map((caregiver, index) => (
                <Row gutter={16} key={caregiver.id}>
                  <Col span={24}>
                    <h4>
                      {t("label_caregiver")} {index + 1}
                    </h4>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("label_first_name")}
                      required
                      validateStatus={
                        errors?.caregivers?.[index]?.firstname ? "error" : ""
                      }
                      help={errors?.caregivers?.[index]?.firstname?.message}
                    >
                      <Controller
                        name={`caregivers.${index}.firstname`}
                        control={control}
                        rules={{
                          required: t("error_first_name_required"),
                          minLength: {
                            value: 2,
                            message: t("error_first_name_min_length"),
                          },
                        }}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("label_last_name")}
                      required
                      validateStatus={
                        errors.caregivers?.[index]?.lastname ? "error" : ""
                      }
                      help={errors.caregivers?.[index]?.lastname?.message}
                    >
                      <Controller
                        name={`caregivers.${index}.lastname`}
                        control={control}
                        rules={{
                          required: t("error_last_name_required"),
                          minLength: {
                            value: 2,
                            message: t("error_last_name_min_length"),
                          },
                        }}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("label_email")}
                      required
                      validateStatus={
                        errors.caregivers?.[index]?.email ? "error" : ""
                      }
                      help={errors.caregivers?.[index]?.email?.message}
                    >
                      <Controller
                        name={`caregivers.${index}.email`}
                        control={control}
                        rules={{
                          required: t("error_email_required"),
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t("error_email_invalid"),
                          },
                        }}
                        render={({ field }) => (
                          <Input type="email" {...field} />
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("label_phone_number")}
                      required
                      validateStatus={
                        errors[`caregiverPhone${index + 1}`] ? "error" : ""
                      }
                      help={errors[`caregiverPhone${index + 1}`]?.message}
                    >
                      <Controller
                        name={`caregivers[${index}].phoneNumber`}
                        control={control}
                        rules={{
                          required: t("error_phone_number_required"),
                          pattern: {
                            value: /^[0-9+\s-]{8,}$/,
                            message: t("error_phone_number_invalid"),
                          },
                        }}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("label_relationship")}
                      required
                      validateStatus={
                        errors[`relationship${index + 1}`] ? "error" : ""
                      }
                      help={errors[`relationship${index + 1}`]?.message}
                    >
                      <Controller
                        name={`caregivers[${index}].relationship`}
                        control={control}
                        rules={{
                          required: t("placeholder_relationship"),
                        }}
                        render={({ field }) => (
                          <Select {...field}>
                            <Select.Option value="parent">
                              {t("option_parent")}
                            </Select.Option>
                            <Select.Option value="sibling">
                              {t("option_sibling")}
                            </Select.Option>
                            <Select.Option value="friend">
                              {t("option_friend")}
                            </Select.Option>
                            <Select.Option value="volunteer_companion">
                              {t("option_volunteer_companion")}
                            </Select.Option>
                            <Select.Option value="professional_caregiver">
                              {t("option_professional_caregiver")}
                            </Select.Option>
                            <Select.Option value="colleague">
                              {t("option_colleague")}
                            </Select.Option>
                            <Select.Option value="spouse">
                              {t("option_spouse")}
                            </Select.Option>
                            <Select.Option value="child">
                              {t("Patients:relation_child")}
                            </Select.Option>
                            <Select.Option value="community_member">
                              {t("option_community_member")}
                            </Select.Option>
                            <Select.Option value="nephew_niece">
                              {t("option_nephew_niece")}
                            </Select.Option>
                            <Select.Option value="grandchild">
                              {t("option_grandchild")}
                            </Select.Option>
                            <Select.Option value="neighbor">
                              {t("option_neighbor")}
                            </Select.Option>
                            <Select.Option value="other">
                              {t("option_other")}
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
              {t("button_patient_update")}
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
  openModal: PropTypes.func.isRequired,
};

export default PatientDetails;
