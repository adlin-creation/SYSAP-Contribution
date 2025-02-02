import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Modal } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import AddProgramPhase from "./AddProgramPhase";
import ProgramPhaseTable from "./ProgramPhaseTable";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from 'prop-types';

export default function ProgramDetails({ program }) {
  const { handleSubmit, control } = useForm();
  const [isAddProgramPhase, setIsAddProgramPhase] = useState(false);
  const { token } = useToken();

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  ////////////////////////////////////
  // DATA QUERY FOR PROGRAM PHASES ///
  ///////////////////////////////////
  // url to retrieve program phases based on the current program
  const programPhasesUrl = `${Constants.SERVER_URL}/${program.key}/phases`;
  const {
    data: programPhases,
    isLoading: isProgramPhasesLoading,
    isLoadingError: isProgramPhasesLoadingError,
    refetch: refetchProgramPhases,
  } = useQuery(["program-phases"], () => {
    return axios
      .get(programPhasesUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  // url to retrieve all program phases
  const allProgramPhasesUrl = `${Constants.SERVER_URL}/phases`;
  const {
    data: allProgramPhases,
    isLoading: isAllProgramPhasesLoading,
    isLoadingError: isAllProgramPhasesLoadingError,
  } = useQuery(["all-phases"], () => {
    return axios
      .get(allProgramPhasesUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  //////////////////////////////////
  /// QUERY VALIDATIONS          ///
  //////////////////////////////////
  if (isProgramPhasesLoading) {
    return <h1>List of program phases loading...</h1>;
  }
  if (isProgramPhasesLoadingError) {
    return <h1>Sorry, an error occurred while loading the program phases</h1>;
  }

  if (isAllProgramPhasesLoading) {
    return <h1>All program phases loading...</h1>;
  }
  if (isAllProgramPhasesLoadingError) {
    return <h1>Sorry, an error occurred while loading all program phases</h1>;
  }

  function addProgramPhase() {
    setIsAddProgramPhase(true);
  }

  /**
   *
   * update program
   */
  const onSubmit = (data) => {
    axios
      .put(`${Constants.SERVER_URL}/update-program/${program.key}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
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
          <Form.Item label="Please enter the name of the program : ">
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

          <Form.Item label="Please enter the description of the program : ">
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

          <Form.Item label="Please enter the duration of the program : ">
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
            >
              UPDATE
            </Button>
          </Form.Item>
        </Form>

        <div>
          <ProgramPhaseTable programPhases={programPhases} />
          <Button
            onClick={addProgramPhase}
            type="primary"
            icon={<PlusOutlined />}
            className="program-add-button"
          >
            ADD PROGRAM PHASE
          </Button>
        </div>

        {isAddProgramPhase && (
          <AddProgramPhase
            setIsAddProgramPhase={setIsAddProgramPhase}
            program={program}
            allProgramPhases={allProgramPhases}
            refetchProgramPhases={refetchProgramPhases}
          />
        )}
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

ProgramDetails.propTypes = {
  program: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.string
  }).isRequired
};