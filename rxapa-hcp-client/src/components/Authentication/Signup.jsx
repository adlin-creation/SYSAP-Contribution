import React from "react";
import PropTypes from "prop-types"; // Linting 
import { Input, Button, Col, Form } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import Constants from "../Utils/Constants";
import "./Auth.css";

export default function Signup({ setIsSignup }) {
  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/signup`, data)
      .then((res) => {
        setIsSignup(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  function backToLogin() {
    setIsSignup(false);
  }

  return (
    <div className="auth-container">
      <Col span={9}>
        <div className="auth-form">
          <Button
            onClick={backToLogin}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>
          <Form onFinish={handleSubmit(onSubmit)}>
            <div className="input-element">
              <h5>Enter your name</h5>
              <Controller
                name={"name"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder="Your name"
                    required
                  />
                )}
              />
            </div>

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
              <h5>Confirm password</h5>
              <Controller
                name={"confirmPassword"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    value={value}
                    placeholder="Confirm your password"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />}
              >
                SIGNUP
              </Button>
            </div>
          </Form>
        </div>
      </Col>
    </div>
  );
}
// For the PropTypes, we only need to check if the setIsSignup function is passed as a prop. (Sonarlint)
Signup.propTypes = {
  setIsSignup: PropTypes.func.isRequired,
};