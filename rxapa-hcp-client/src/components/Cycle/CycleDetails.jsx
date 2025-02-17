import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { Row, Col, Input, Button, Form, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import AddSessions from "./AddSessions";
import SessionTable from "./SessionTable";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function CycleDetails({ cycle, refetchCycles }) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const [isAddSession, setIsAddSession] = useState(false);
  const { token } = useToken();

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  // url to retrieve all sessions
  const allSessionUrl = `${Constants.SERVER_URL}/sessions`;
  const {
    data: allSessions,
    isLoading: isAllSessionsLoading,
    isLoadingError: isAllSessionLoadingError,
  } = useQuery(["all-sessions"], () => {
    return axios
      .get(allSessionUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  // url to retrieve sessions based on the current cycle
  const sessionUrl = `${Constants.SERVER_URL}/${cycle.key}/sessions`;
  const {
    data: cycleSessions,
    isLoading: isCycleSessionsLoading,
    isLoadingError: isCycleSessionsLoadingError,
    refetch: refetchSessions,
  } = useQuery(["program-phases"], () => {
    return axios
      .get(sessionUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(" Program phase:", res);
        return res.data;
      });
  });

  //////////////////////////////////
  /// QUERY VALIDATIONS          ///
  //////////////////////////////////
  if (isAllSessionsLoading) {
    return <h1>All sessions Loading...</h1>;
  }
  if (isAllSessionLoadingError) {
    return <h1>Sorry, an error occured while loading the sessions</h1>;
  }

  if (isCycleSessionsLoading) {
    return <h1>Cycle sessions Loading...</h1>;
  }
  if (isCycleSessionsLoadingError) {
    return <h1>Sorry, an error occured while loading cycle sessions</h1>;
  }

  function addSession() {
    setIsAddSession(true);
  }

  /**
   *
   * @todo - updates cycle
   */
  const onSubmit = (data) => {
    axios
      .put(`${Constants.SERVER_URL}/update-cycle/${cycle.key}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchCycles();
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
          <Form.Item label={t("enter_cycle_name")}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("update_cycle_name")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("enter_cycle_description")}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("update_cycle_description")}
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
            >
              {t("update")}
            </Button>
          </Form.Item>
        </Form>

        <div>
          <SessionTable sessions={cycleSessions} />
          <Button
            onClick={addSession}
            type="primary"
            icon={<PlusOutlined />}
            className="session-add-button"
          >
            {t("add_session")}
          </Button>
        </div>

        {isAddSession && (
          <AddSessions
            setIsAddSession={setIsAddSession}
            refetchSessions={refetchSessions}
            cycle={cycle}
            allSessions={allSessions}
          />
        )}

        {isOpenModal && (
          <Modal
            title="Feedback"
            open={isOpenModal}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                {t("close")}
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

CycleDetails.propTypes = {
  cycle: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  refetchCycles: PropTypes.func.isRequired
};
