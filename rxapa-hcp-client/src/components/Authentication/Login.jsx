import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Button, Col, Modal, Input, Form } from "antd";
import { CheckOutlined } from "@ant-design/icons"; // Import de l'icône de antd
import { useNavigate } from "react-router-dom"; // Import de useNavigate
import Constants from "../Utils/Constants";
import Signup from "./Signup";
import "./Auth.css";
import PropTypes from 'prop-types';

export default function Login({ setToken }) {
  const [isSignup, setIsSignup] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm();

  function register() {
    setIsSignup(true);
  }

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/login`, data)
      .then((res) => {
        console.log(res.data);
        setIsSignup(false);
        setToken(res.data);
        navigate("/");
      })
      .catch((err) => {
        openModal(err.response.data.message, true);
      });
  };

  if (isSignup) {
    return <Signup setIsSignup={setIsSignup} />;
  }

  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  }

  return (
    <div className="auth-container">
      <Col span={9}>
        <div className="auth-form">
          <h2>Login</h2>
          <Form onFinish={handleSubmit(onSubmit)}>
            <div className="input-element">
              <h5>Enter your email</h5>
              <Controller
                name={"email"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder="Your email"
                    type="email"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5>Your password</h5>
              <Controller
                name={"password"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    value={value}
                    placeholder="Your password"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />} // Utilisation de l'icône de antd
              >
                LOGIN
              </Button>

              <Button type="link" onClick={register}>
                Register
              </Button>
            </div>
          </Form>
        </div>
        <Modal
          open={isOpenModal}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
            </Button>,
          ]}
        >
          <p style={{ color: isErrorMessage ? 'red' : 'black' }}>{message}</p>
        </Modal>
      </Col>
    </div>
  );
}

// Validation des props
Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};