import { SendOutlined, UserAddOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Modal as AntModal,
  DatePicker,
  Select,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Constants from "../Utils/Constants";

function CreatePatient({ refetchPatients, onClose }) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { token } = useToken();
  const [caregivers, setCaregivers] = useState([{ id: 1 }]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [programList, setProgramList] = useState([]);
  const programUrl = `${Constants.SERVER_URL}/programs`;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(programUrl, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setProgramList(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des programmes", error);
      }
    };

    fetchPrograms();
  }, [token]);

  const [showCaregiverForm, setShowCaregiverForm] = useState(false); // État pour gérer la visibilité du formulaire
  const [hasCaregiver, setHasCaregiver] = useState(false);
  const [maxCaregiver, setmaxCaregiver] = useState(false);

  // Fonction pour basculer l'affichage du formulaire
  const toggleCaregiverForm = () => {
    setShowCaregiverForm(!showCaregiverForm);
    setHasCaregiver(!hasCaregiver);
  };

  const addCaregiver = () => {
    if (caregivers.length === 1) {
      // Ajouter un soignant
      setCaregivers([...caregivers, { id: caregivers.length + 1 }]);
      setmaxCaregiver(!maxCaregiver);
    } else {
      // Retirer le dernier soignant
      setCaregivers(caregivers.slice(0, -1));
      setmaxCaregiver(!maxCaregiver);
    }
  };

  const onSubmit = (data) => {
    const caregiversData = caregivers
      .map((_cg, index) => ({
        firstname: data[`caregiverFirstName${index + 1}`],
        lastname: data[`caregiverLastName${index + 1}`],
        email: data[`caregiverEmail${index + 1}`],
        phoneNumber: data[`caregiverPhone${index + 1}`],
        relationship: data[`relationship${index + 1}`],
        program: data[`program${index + 1}`],
        programStart: data[`programStart${index + 1}`]?.format("YYYY-MM-DD"),
        programEnd: data[`programEnd${index + 1}`]?.format("YYYY-MM-DD"),
        active: true,
      }))
      .filter((cg) => cg.firstname && cg.lastname);
    const patientData = {
      firstname: data.patientFirstName,
      lastname: data.patientLastName,
      email: data.patientEmail,
      phoneNumber: data.patientPhone,
      birthday: data.birthday?.format("YYYY-MM-DD"),
      otherinfo: data.otherinfo,
      numberOfCaregivers: caregiversData.length,
      weight: data.weight ? parseFloat(data.weight) : null,
      weightUnit: data.weightUnit,
      // status: 'active'
    };

    const endpoint =
      caregiversData.length > 0
        ? "/create-patient-with-caregivers"
        : "/create-patient";
    const payload =
      caregiversData.length > 0
        ? { patientData, caregivers: caregiversData }
        : patientData;

    axios
      .post(`${Constants.SERVER_URL}${endpoint}`, payload, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        refetchPatients();
        openModal(t("create_patient_success"), false);
      })
      .catch((err) =>
        openModal(err.response.data.message || t("create_patient_failed"), true)
      );
  };

  const openModal = (message, isError) => {
    setMessage(message);
    setIsErrorMessage(isError);
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: "Close",
      centered: true,
      onOk: () => {
        if (!isError) {
          refetchPatients();
          onClose();
        }
        closeModal();
      },
    });
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <h2>{t("Patients:patient_informations")}</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:first_name")}
                required
                validateStatus={errors.patientFirstName ? "error" : ""}
                help={errors.patientFirstName?.message}
              >
                <Controller
                  name="patientFirstName"
                  control={control}
                  rules={{
                    required: t("Patients:first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("Patients:first_name_required_info"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Patients:first_name_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:last_name")}
                required
                validateStatus={errors.patientLastName ? "error" : ""}
                help={errors.patientLastName?.message}
              >
                <Controller
                  name="patientLastName"
                  control={control}
                  rules={{
                    required: t("Patients:last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("Patients:last_name_required_info"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Patients:last_name_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:birthday")}>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      placeholder={t("Patients:birthday_select")}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:phone_number")}
                required
                validateStatus={errors.patientPhone ? "error" : ""}
                help={errors.patientPhone?.message}
              >
                <Controller
                  name="patientPhone"
                  control={control}
                  rules={{
                    required: t("Patients:phone_number_required"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("Patients:phone_number_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Patients:phone_number_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("Patients:email")}
                required
                validateStatus={errors.patientEmail ? "error" : ""}
                help={errors.patientEmail?.message}
              >
                <Controller
                  name="patientEmail"
                  control={control}
                  rules={{
                    required: t("Patients:email_needed"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("email_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("Patients:email_input")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Patients:email_confirm")}
                required
                validateStatus={errors.confirmPatientEmail ? "error" : ""}
                help={errors.confirmPatientEmail?.message}
              >
                <Controller
                  name="confirmPatientEmail"
                  control={control}
                  rules={{
                    required: t("Patients:email_confirm_required"),
                    validate: (value) =>
                      value === control._formValues.patientEmail ||
                      t("Patients:email_confirm_invalid"),
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("Patients:email_confirm_info")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("Patients:additionnal_information")}>
                <Controller
                  name="otherinfo"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder={t("Patients:additionnal_information_input")}
                      rows={4}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t("Patients:weight")}>
                  <Controller
                    name="weight"
                    control={control}
                    defaultValue=""
                    rules={{
                      pattern: {
                        value: /^\d{1,3}(\.\d{1})?$/, // Nombre entre 0 et 999.9
                        message: t("Patients:weight_invalid"),
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t("Patients:weight_placeholder")}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label={t("Patients:weight_unit")}>
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
          </Row>

          <Button
            type="dashed"
            onClick={toggleCaregiverForm}
            icon={<UserAddOutlined />}
            style={{ marginBottom: 24 }}
          >
            {hasCaregiver ? "Without Caregiver" : "With Caregiver"}
          </Button>
          {showCaregiverForm && (
            <div>
              <h2>{t("Patients:caregiver_information")}</h2>
              {caregivers.map((caregiver, index) => (
                <div key={caregiver.id}>
                  <h3>
                    {t("Patients:caregiver")} {index + 1}
                  </h3>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label={t("Patients:first_name")}
                        validateStatus={
                          errors[`caregiverFirstName${index + 1}`]
                            ? "error"
                            : ""
                        }
                        help={errors[`caregiverFirstName${index + 1}`]?.message}
                      >
                        <Controller
                          name={`caregiverFirstName${index + 1}`}
                          control={control}
                          rules={{
                            required: t("Patients:first_name_required"),
                            minLength: {
                              value: 2,
                              message: t("Patients:first_name_required_info"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t(
                                "Patients:caregiver_first_name_input"
                              )}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={t("Patients:last_name")}
                        validateStatus={
                          errors[`caregiverLastName${index + 1}`] ? "error" : ""
                        }
                        help={errors[`caregiverLastName${index + 1}`]?.message}
                      >
                        <Controller
                          name={`caregiverLastName${index + 1}`}
                          control={control}
                          rules={{
                            required: t("Patients:last_name_required"),
                            minLength: {
                              value: 2,
                              message: t("Patients:last_name_required_info"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t(
                                "Patients:caregiver_last_name_input"
                              )}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={t("Patients:relationship")}
                        validateStatus={
                          errors[`relationship${index + 1}`] ? "error" : ""
                        }
                        help={errors[`relationship${index + 1}`]?.message}
                      >
                        <Controller
                          name={`relationship${index + 1}`}
                          control={control}
                          rules={{
                            required: t("Patients:choice_required"),
                          }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              placeholder={t("Patients:relationship_choice")}
                            >
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

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={t("Patients:email")}
                        validateStatus={
                          errors[`caregiverEmail${index + 1}`] ? "error" : ""
                        }
                        help={errors[`caregiverEmail${index + 1}`]?.message}
                      >
                        <Controller
                          name={`caregiverEmail${index + 1}`}
                          control={control}
                          rules={{
                            required: t("Patients:email_needed"),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t("Patients:email_invalid"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="email"
                              {...field}
                              placeholder={t("Patients:caregiver_email_input")}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={t("Patients:phone_number")}
                        validateStatus={
                          errors[`caregiverPhone${index + 1}`] ? "error" : ""
                        }
                        help={errors[`caregiverPhone${index + 1}`]?.message}
                      >
                        <Controller
                          name={`caregiverPhone${index + 1}`}
                          control={control}
                          rules={{
                            required: t("Patients:phone_number_required"),
                            pattern: {
                              value: /^[0-9+\s-]{8,}$/,
                              message: t("Patients:phone_number_invalid"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("Patients:caregiver_phone_input")}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item label="Programme" name="program">
                        <Controller
                          name={`program${index + 1}`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              placeholder="Sélectionner un programme"
                            >
                              {programList?.map((program) => (
                                <Select.Option
                                  key={program.id}
                                  value={program.id}
                                >
                                  {program.name}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label={t("Patients:program_start")} required>
                        <Controller
                          name={`programStart${index + 1}`}
                          control={control}
                          rules={{
                            required: t("Patients:program_start_required"),
                          }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              placeholder={t(
                                "Patients:program_start_placeholder"
                              )}
                              style={{ width: "100%" }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label={t("Patients:program_end")} required>
                        <Controller
                          name={`programEnd${index + 1}`}
                          control={control}
                          rules={{
                            required: t("Patients:program_end_required"),
                          }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              placeholder={t(
                                "Patients:program_end_placeholder"
                              )}
                              style={{ width: "100%" }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={addCaregiver}
                icon={<UserAddOutlined />}
                style={{ marginBottom: 24 }}
              >
                {maxCaregiver ? "Remove Caregiver" : "Add Caregiver"}
              </Button>
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("Patients:create_patient")}
            </Button>
          </Form.Item>
        </Form>

        <AntModal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              {t("Patients:close_button")}
            </Button>,
          ]}
        >
          <p style={{ color: isErrorMessage ? "#ff4d4f" : "#52c41a" }}>
            {message}
          </p>
        </AntModal>
      </Col>
    </Row>
  );
}

CreatePatient.propTypes = {
  refetchPatients: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreatePatient;
