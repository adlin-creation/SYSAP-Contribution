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
  const { t } = useTranslation("Patients");
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
        openModal(t("success_create_patient"), false);
      })
      .catch((err) =>
        openModal(
          t(`Backend:${err.response.data.message}`) ||
            t("error_create_patient"),
          true
        )
      );
  };

  const openModal = (message, isError) => {
    setMessage(message);
    setIsErrorMessage(isError);
    AntModal[isError ? "error" : "success"]({
      content: message,
      okText: "button_close",
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
          <h2>{t("patient_informations")}</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_first_name")}
                required
                validateStatus={errors.patientFirstName ? "error" : ""}
                help={errors.patientFirstName?.message}
              >
                <Controller
                  name="patientFirstName"
                  control={control}
                  rules={{
                    required: t("error_first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("error_last_name_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("placeholder_first_name")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_last_name")}
                required
                validateStatus={errors.patientLastName ? "error" : ""}
                help={errors.patientLastName?.message}
              >
                <Controller
                  name="patientLastName"
                  control={control}
                  rules={{
                    required: t("error_last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("error_last_name_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("placeholder_last_name")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("label_birthday")}>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      placeholder={t("placeholder_birthday")}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_phone_number")}
                required
                validateStatus={errors.patientPhone ? "error" : ""}
                help={errors.patientPhone?.message}
              >
                <Controller
                  name="patientPhone"
                  control={control}
                  rules={{
                    required: t("error_phone_number_required"),
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: t("error_phone_number_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("placeholder_phone_number")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("label_email")}
                required
                validateStatus={errors.patientEmail ? "error" : ""}
                help={errors.patientEmail?.message}
              >
                <Controller
                  name="patientEmail"
                  control={control}
                  rules={{
                    required: t("error_email_required"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("error_email_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("placeholder_email")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("label_confirm_email")}
                required
                validateStatus={errors.confirmPatientEmail ? "error" : ""}
                help={errors.confirmPatientEmail?.message}
              >
                <Controller
                  name="confirmPatientEmail"
                  control={control}
                  rules={{
                    required: t("error_confirm_email_required"),
                    validate: (value) =>
                      value === control._formValues.patientEmail ||
                      t("error_confirm_email_invalid"),
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("placeholder_confirm_email")}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t("placeholder_weight")}>
                  <Controller
                    name="weight"
                    control={control}
                    defaultValue=""
                    rules={{
                      pattern: {
                        value: /^\d{1,3}(\.\d{1})?$/, // Nombre entre 0 et 999.9
                        message: t("error_weight_invalid"),
                      },
                    }}
                    render={({ field }) => (
                      <Input {...field} placeholder={t("placeholder_weight")} />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label={t("label_weight_unit")}>
                  <Controller
                    name="weightUnit"
                    control={control}
                    defaultValue="kg"
                    render={({ field }) => (
                      <Select {...field} style={{ width: "100%" }}>
                        <Select.Option value="kg">
                          {t("option_kg")}
                        </Select.Option>
                        <Select.Option value="lbs">
                          {" "}
                          {t("option_lbs")}
                        </Select.Option>
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
            {hasCaregiver
              ? t("button_without_caregiver")
              : t("button_with_caregiver")}
          </Button>
          {showCaregiverForm && (
            <div>
              <h2>{t("title_caregiver_information")}</h2>
              {caregivers.map((caregiver, index) => (
                <div key={caregiver.id}>
                  <h3>
                    {t("label_caregiver")} {index + 1}
                  </h3>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label={t("label_first_name")}
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
                            required: t("error_first_name_required"),
                            minLength: {
                              value: 2,
                              message: t("error_last_name_min_length"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t(
                                "placeholder_caregiver_first_name"
                              )}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={t("label_last_name")}
                        validateStatus={
                          errors[`caregiverLastName${index + 1}`] ? "error" : ""
                        }
                        help={errors[`caregiverLastName${index + 1}`]?.message}
                      >
                        <Controller
                          name={`caregiverLastName${index + 1}`}
                          control={control}
                          rules={{
                            required: t("error_last_name_required"),
                            minLength: {
                              value: 2,
                              message: t("error_last_name_min_length"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("placeholder_caregiver_last_name")}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={t("label_relationship")}
                        validateStatus={
                          errors[`relationship${index + 1}`] ? "error" : ""
                        }
                        help={errors[`relationship${index + 1}`]?.message}
                      >
                        <Controller
                          name={`relationship${index + 1}`}
                          control={control}
                          rules={{
                            required: t("error_relashionship_required"),
                          }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              placeholder={t("placeholder_relationship")}
                            >
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
                                {t("option_child")}
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

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={t("label_email")}
                        validateStatus={
                          errors[`caregiverEmail${index + 1}`] ? "error" : ""
                        }
                        help={errors[`caregiverEmail${index + 1}`]?.message}
                      >
                        <Controller
                          name={`caregiverEmail${index + 1}`}
                          control={control}
                          rules={{
                            required: t("error_email_required"),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t("error_email_invalid"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="email"
                              {...field}
                              placeholder={t("placeholder_caregiver_email")}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={t("label_phone_number")}
                        validateStatus={
                          errors[`caregiverPhone${index + 1}`] ? "error" : ""
                        }
                        help={errors[`caregiverPhone${index + 1}`]?.message}
                      >
                        <Controller
                          name={`caregiverPhone${index + 1}`}
                          control={control}
                          rules={{
                            required: t("error_phone_number_required"),
                            pattern: {
                              value: /^[0-9+\s-]{8,}$/,
                              message: t("error_phone_number_invalid"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("placeholder_caregiver_phone")}
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
                              placeholder={t("label_program_select")}
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
                      <Form.Item label={t("label_date_start")} required>
                        <Controller
                          name={`programStart${index + 1}`}
                          control={control}
                          rules={{
                            required: t("error_date_start_required"),
                          }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              placeholder={t("placeholder_date_start")}
                              style={{ width: "100%" }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label={t("label_date_end")} required>
                        <Controller
                          name={`programEnd${index + 1}`}
                          control={control}
                          rules={{
                            required: t("error_date_end_required"),
                          }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              placeholder={t("placeholder_date_end")}
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
                {maxCaregiver
                  ? t("button_caregiver_remove")
                  : t("button_caregiver_add")}
              </Button>
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("button_create_patient")}
            </Button>
          </Form.Item>
        </Form>

        <AntModal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              {t("button_close")}
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
