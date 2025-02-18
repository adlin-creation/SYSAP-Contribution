import { Input, Button, Row, Col, Form, Modal } from "antd";
import { SendOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import "./Styles.css";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function CreateBloc(props) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

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

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/create-bloc`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        openModal(res.data.message, false);
        // update the list of blocs
        props.refetchBlocs();
      })
      .catch((err) => {
        //const errorMessage = err.response ? err.response.data.message : "An error occurred";
        openModal(err.response.data.message, true);
      });
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label={t("Blocs:enter_bloc_name")}>
            <Controller
              name={"name"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Blocs:exercise_name")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("Blocs:enter_bloc_description")}>
            <Controller
              name={"description"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("Blocs:exercise_description")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("Blocs:submit_button")}
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
            <p style={{ color: isErrorMessage ? "red" : "green" }}>{message}</p>
          </Modal>
        )}
      </Col>
    </Row>
  );
}

CreateBloc.propTypes = {
  refetchBlocs: PropTypes.func.isRequired, // Validation de la prop refetchBlocs
};
