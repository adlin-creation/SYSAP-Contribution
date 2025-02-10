import { Row, Col, Input, Button, Form, Modal as AntModal, Tooltip } from "antd";
import { SendOutlined, KeyOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../../Utils/Constants";
import useToken from "../../Authentication/useToken";
import PropTypes from "prop-types";
import "./Styles.css";

function CreateAdmin({ refetchAdmins }) {
  const { handleSubmit, control, reset, formState: { errors } } = useForm();
  const { token } = useToken();

  const onSubmit = (data) => {
    const adminData = {
      ...data,
      role: 'admin',
      active: true
    };

    axios
      .post(`${Constants.SERVER_URL}/create-professional-user`, adminData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        refetchAdmins();
        openModal("Admin created successfully!", false);
      })
      .catch((err) => openModal(err.response?.data?.message || "Error creating admin", true));
  };

  const openModal = (message, isError) => {
    AntModal[isError ? 'error' : 'success']({
      content: message,
      okText: 'Close',
      centered: true,
      onOk: () => {
        if (!isError) {
          reset();
        }
      }
    });
  };

  const generatePassword = async () => {
    try {
      const response = await axios.get(`${Constants.SERVER_URL}/generate-password`, {
        headers: { Authorization: "Bearer " + token },
      });
      const generatedPassword = response.data.password;
      // Met à jour le champ password avec le mot de passe généré
      reset({ ...control._formValues, password: generatedPassword });
    } catch (err) {
      openModal("Error generating password", true);
    }
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
                  render={({ field }) => <Input {...field} placeholder="Entrez le prénom" />}
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
                  render={({ field }) => <Input {...field} placeholder="Entrez le nom" />}
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
                  render={({ field }) => <Input {...field} placeholder="Entrez l'adresse email" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Confirm Email" 
                required
                validateStatus={errors.confirmEmail ? "error" : ""}
                help={errors.confirmEmail?.message}
              >
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{
                    required: "La confirmation de l'email est obligatoire",
                    validate: value => value === control._formValues.email || "Les emails ne correspondent pas"
                  }}
                  render={({ field }) => <Input {...field} placeholder="Confirmez l'adresse email" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                  render={({ field }) => <Input {...field} placeholder="Entrez le numéro de téléphone" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Password" 
                required
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Input.Group compact>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ 
                      required: "Le mot de passe est obligatoire",
                      minLength: {
                        value: 8,
                        message: "Le mot de passe doit contenir au moins 8 caractères"
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: "Le mot de passe doit contenir au moins une lettre et un chiffre"
                      }
                    }}
                    render={({ field }) => (
                      <>
                        <Input.Password 
                          {...field} 
                          placeholder="Entrez le mot de passe" 
                          style={{ width: 'calc(100% - 40px)' }}
                        />
                        <Tooltip title="Générer un mot de passe">
                          <Button 
                            icon={<KeyOutlined />}
                            onClick={generatePassword}
                          />
                        </Tooltip>
                      </>
                    )}
                  />
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="submit-button">
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              Create Admin
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

CreateAdmin.propTypes = {
  refetchAdmins: PropTypes.func.isRequired,
};

export default CreateAdmin;
