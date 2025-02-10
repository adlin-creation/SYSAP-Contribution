import React, { useEffect } from "react";
import { Row, Col, Input, Button, Form, Modal as AntModal, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";

function PatientDetails({ patient, onClose, refetchPatients }) {
  const { handleSubmit, control, setValue, formState: { errors } } = useForm();
  const { token } = useToken();

  useEffect(() => {
    if (patient) {
      setValue("firstname", patient.firstname);
      setValue("lastname", patient.lastname);
      setValue("email", patient.email);
      setValue("phoneNumber", patient.phoneNumber);
      setValue("status", patient.status);
      setValue("numberOfPrograms", patient.numberOfPrograms);
    }
  }, [patient, setValue]);

  const onSubmit = (data) => {
    const patientData = {
      ...data,
      role: 'patient'
    };

    axios
      .put(`${Constants.SERVER_URL}/update-patient/${patient.id}`, patientData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        refetchPatients();
        AntModal.success({
          content: "Patient updated successfully!",
          okText: 'Close',
          centered: true,
          onOk: () => {
            onClose();
          }
        });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "Error updating patient";
        AntModal.error({
          content: errorMessage,
          okText: 'Close',
          centered: true
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
                label="First Name" 
                required
                validateStatus={errors.firstname ? "error" : ""}
                help={errors.firstname?.message}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{ 
                    required: "Le prénom est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Le prénom doit contenir au moins 2 caractères"
                    }
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Last Name" 
                required
                validateStatus={errors.lastname ? "error" : ""}
                help={errors.lastname?.message}
              >
                <Controller
                  name="lastname"
                  control={control}
                  rules={{ 
                    required: "Le nom est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Le nom doit contenir au moins 2 caractères"
                    }
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Email" 
                required
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "L'email est obligatoire",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Format d'email invalide"
                    }
                  }}
                  render={({ field }) => <Input type="email" {...field} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Phone Number" 
                required
                validateStatus={errors.phoneNumber ? "error" : ""}
                help={errors.phoneNumber?.message}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{ 
                    required: "Le numéro de téléphone est obligatoire",
                    pattern: {
                      value: /^[0-9+\s-]{8,}$/,
                      message: "Format de numéro de téléphone invalide"
                    }
                  }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Number of Programs" 
                required
                validateStatus={errors.numberOfPrograms ? "error" : ""}
                help={errors.numberOfPrograms?.message}
              >
                <Controller
                  name="numberOfPrograms"
                  control={control}
                  rules={{ 
                    required: "Le nombre de programmes est obligatoire",
                    min: {
                      value: 0,
                      message: "Le nombre de programmes doit être supérieur ou égal à 0"
                    }
                  }}
                  render={({ field }) => <Input type="number" {...field} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Status" 
                required
                validateStatus={errors.status ? "error" : ""}
                help={errors.status?.message}
              >
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Le statut est obligatoire" }}
                  render={({ field }) => (
                    <Select {...field}>
                      <Select.Option value="active">Active</Select.Option>
                      <Select.Option value="paused">Paused</Select.Option>
                      <Select.Option value="waiting">Waiting</Select.Option>
                      <Select.Option value="completed">Completed</Select.Option>
                      <Select.Option value="abort">Abort</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Update Patient
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
