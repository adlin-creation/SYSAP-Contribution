import React, { useEffect } from "react";
import { Row, Col, Input, Button, Form, Switch, Modal as AntModal } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import PropTypes from "prop-types";

function DoctorDetails({ doctor, onClose, refetchDoctors, openModal }) {
  const { handleSubmit, control, setValue, formState: { errors } } = useForm();
  const { token } = useToken();

  // Pré-remplir le formulaire avec les données du médecin
  useEffect(() => {
    if (doctor) {
      setValue("firstname", doctor.firstname);
      setValue("lastname", doctor.lastname);
      setValue("email", doctor.email);
      setValue("phoneNumber", doctor.phoneNumber);
      setValue("active", doctor.active);
    }
  }, [doctor, setValue]);

  const onSubmit = (data) => {
    const doctorData = {
      ...data,
      role: 'doctor'
    };

    axios
      .put(`${Constants.SERVER_URL}/update-professional-user/${doctor.id}`, doctorData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        refetchDoctors();
        AntModal.success({
          content: "Doctor updated successfully!",
          okText: 'Close',
          centered: true,
          onOk: () => {
            onClose();
          }
        });
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "Error updating doctor";
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
            {/* First Name and Last Name fields */}
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
            {/* Email and Phone Number fields */}
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
            {/* Status field */}
            <Col span={12}>
              <Form.Item label="Status">
                <Controller
                  name="active"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Update Doctor
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

DoctorDetails.propTypes = {
  doctor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchDoctors: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default DoctorDetails;
