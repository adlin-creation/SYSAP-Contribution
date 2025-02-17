import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Modal } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import "./ProgramStyles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function CreateProgram(props) {
  const { t } = useTranslation();
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
    <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label={t("Programs:enter_program_name")}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Programs:program_name_placeholder")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("Programs:enter_program_description")}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("Programs:program_description_placeholder")}
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("Programs:enter_program_duration")}>
            <Controller
              name="duration"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Programs:program_duration_placeholder")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("Programs:submit_button")}
            </Button>
          </Form.Item>
        </Form>
        {isOpenModal && (
          <Modal
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                {t("Programs:close_button")}
              </Button>,
            ]}
          >
            <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
          </Modal>
        )}
      </Col>
    </Row>
  );
}

//Vulnerability detected in the code by copilot ia. Hardcoded credentials are present in the code. The code is vulnerable to information disclosure.
