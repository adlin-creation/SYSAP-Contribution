<<<<<<< HEAD
import { SendOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Row, Col, Input, Button, Form, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import "./Styles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function CreateCycle(props) {
  const { t } = useTranslation("Cycles");
  const { handleSubmit, control } = useForm();
  const { token } = useToken();

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/create-cycle`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // Reload the list of cycles to include the new cycle
        props.refetchCycles();
        openModal(t(`Backend:${res.data.message}`), false);
      })
      .catch((err) =>
        openModal(t(`Backend:${err.response.data.message}`), true)
      );
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
          <Form.Item label={t("label_cycle_name")}>
            <Controller
              name="cycleName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_weekly_cycle_name")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_cycle_description")}>
            <Controller
              name="cycleDescription"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_weekly_cycle_description")}
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("button_submit")}
            </Button>
          </Form.Item>
        </Form>
        {isOpenModal && (
          <Modal
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                {t("button_close")}
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

CreateCycle.propTypes = {
  refetchCycles: PropTypes.func.isRequired,
};
=======
import { SendOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Row, Col, Input, Button, Form, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import "./Styles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function CreateCycle(props) {
  const { t } = useTranslation("Cycles");
  const { handleSubmit, control } = useForm();
  const { token } = useToken();

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/create-cycle`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // Reload the list of cycles to include the new cycle
        props.refetchCycles();
        openModal(t(`Backend:${res.data.message}`), false);
      })
      .catch((err) =>
        openModal(t(`Backend:${err.response.data.message}`), true)
      );
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
          <Form.Item label={t("label_cycle_name")}>
            <Controller
              name="cycleName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_weekly_cycle_name")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_cycle_description")}>
            <Controller
              name="cycleDescription"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_weekly_cycle_description")}
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("button_submit")}
            </Button>
          </Form.Item>
        </Form>
        {isOpenModal && (
          <Modal
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                {t("button_close")}
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

CreateCycle.propTypes = {
  refetchCycles: PropTypes.func.isRequired,
};
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
