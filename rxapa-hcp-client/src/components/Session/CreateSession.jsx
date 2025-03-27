import { React, useState } from "react";
import { Row, Col, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import AppButton from "../Button/Button";
import { SendOutlined } from "@ant-design/icons";
import "./Styles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function CreateSession(props) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

  const onSubmit = (data) => {
    console.log(data);
    axios
      .post(`${Constants.SERVER_URL}/create-session`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // Reload the day session to include the new day session
        props.refetchSessions();
        openModal(t(`Backend:${res.data.message}`), false);
      })
      .catch((err) =>
        openModal(t(`Backend:${err.response.data.message}`), true)
      );
  };

  /**
   * Opens modal to provide feedback to the user.
   * @param {*} message - feedback message
   * @param {*} isError - true if it is an error meesage
   */
  function openModal(message, isError) {
    setMessage(message);
    setIsOpenModal(true);
  }

  /**
   * Close the modal
   */
  function closeModal() {
    setIsOpenModal(false);
    setMessage("");
  }

  return (
    <Col span={18}>
      <Row>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-element">
            <h5>{t("Sessions:enter_day_session")}</h5>
            <Controller
              name={"name"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Sessions:day_session_name")}
                  required
                />
              )}
            />
          </div>

          <div className="input-element">
            <h5>{t("Sessions:enter_day_session_description")}</h5>
            <Controller
              name={"description"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("Sessions:day_session_description")}
                  required
                />
              )}
            />
          </div>

          <div className="input-element">
            <h5>{t("Sessions:enter_constraints_day_session")}</h5>
            <Controller
              name={"constraints"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("Sessions:day_session_constraints")}
                  required
                />
              )}
            />
          </div>

          <div className="input-element">
            <AppButton
              displayText={t("Sessions:submit_button")}
              variant={"contained"}
              endIcon={<SendOutlined />}
              type={"submit"}
            />
          </div>
        </form>
        <Modal open={isOpenModal} onCancel={closeModal} footer={null}>
          <p>{message}</p>
        </Modal>
      </Row>
    </Col>
  );
}
CreateSession.propTypes = {
  refetchSessions: PropTypes.func.isRequired,
};
