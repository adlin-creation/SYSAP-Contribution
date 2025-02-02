import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Modal } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import "./ProgramStyles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";

export default function CreateProgram(props) {
  const { handleSubmit, control } = useForm();
  const { token } = useToken();

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/create-program`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // Reload program list to include the new program
        props.refetchPrograms();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  /**
   * Opens modal to provide feedback to the user.
   * @param {*} message - feedback message
   * @param {*} isError - true if it is an error message
   */
  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

  /**
   * Close the modal
   */
  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
    setIsErrorMessage(false);
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Please enter the name of the program : " >
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Program Name"
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Please enter the description of the program : " >
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder="Program Description"
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Please enter the duration of the program : " >
            <Controller
              name="duration"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Program Duration"
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item >
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
            >
              SUBMIT
            </Button>
          </Form.Item>
        </Form>
        {isOpenModal && (
          <Modal
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                Close
              </Button>,
            ]}
          >
            <p style={{ color: isErrorMessage ? 'red' : 'green' }}>{message}</p>
          </Modal>
        )}
      </Col>
    </Row>
  );
}

//Vulnerability detected in the code by copilot ia. Hardcoded credentials are present in the code. The code is vulnerable to information disclosure.