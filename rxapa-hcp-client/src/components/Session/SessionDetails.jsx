import { React, useState } from "react";
import { Row, Col, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AppButton from "../Button/Button";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import BlocTable from "./BlocTable";
import AddBloc from "./AddBloc";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";

export default function SessionDetails({ sessionKey }) {
  const { handleSubmit, control } = useForm();
  const [isAddBloc, setIsAddBloc] = useState(false);

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

  function addBloc() {
    setIsAddBloc(true);
  }

  ///////////////////////////////
  // DATA QUERY FOR BLOCS ///
  ///////////////////////////////
  // url to retrieve all blocs
  const allBlocsUrl = `${Constants.SERVER_URL}/blocs`;
  // blocs is a unique name for this query
  const {
    data: blocList,
    isLoading: isBlockListLoading,
    isLoadingError: isBlockListLoadingError,
    // refetch: refetchBlocs,
  } = useQuery(["blocs"], () => {
    return axios
      .get(allBlocsUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      });
  });

  // url to retrieve session with their blocs
  const sessionUrl = `${Constants.SERVER_URL}/session/${sessionKey}`;
  const {
    data: session,
    isLoading: isSessionLoading,
    isLoadingError: isSessionLoadingError,
    refetch: refetchSession,
  } = useQuery(["session"], () => {
    return axios
      .get(sessionUrl, {
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
  if (isBlockListLoading) {
    return <h1>List of blocs Loading...</h1>;
  }
  if (isBlockListLoadingError) {
    return <h1>Sorry, an error occured while loading the blocs</h1>;
  }

  if (isSessionLoading) {
    return <h1>Sessions Loading...</h1>;
  }
  if (isSessionLoadingError) {
    return <h1>Sorry, an error occured while loading sessions</h1>;
  }

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

  // TODO - to be implemented
  function updateSession() {}

  const onSubmit = (data) => {
    axios
      .put(`${Constants.SERVER_URL}/update-session/` + sessionKey, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  return (
    <Col span={18}>
      <Row>
        <div className="input-element">
          <h4>Edit {session.name}</h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-element">
            <h5>{session.name}</h5>
            <Controller
              name={"name"}
              control={control}
              render={({ field: { onChange, value, defaultValue } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Enter session name to update"
                  // required
                />
              )}
            />
          </div>

          <div className="input-element">
            <h5>{session.description}</h5>
            <Controller
              name={"description"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder="Enter session to update"
                  // required
                />
              )}
            />
          </div>

          <div className="input-element">
            <h5>{session.constraints}</h5>
            <Controller
              name={"constraints"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Enter session constraints to update"
                  // required
                />
              )}
            />
          </div>

          <div className="input-element">
            <AppButton
              onClick={updateSession}
              displayText={"UPDATE"}
              variant={"contained"}
              endIcon={<CheckOutlined />}
              type={"submit"}
            />
          </div>
        </form>

        <div className="input-element">
          <BlocTable blocs={session?.Bloc_Sessions} />
          <AppButton
            onClick={addBloc}
            displayText={"ADD BLOC"}
            variant={"contained"}
            endIcon={<PlusOutlined />}
            type={"button"}
          />
        </div>

        {isAddBloc && (
          <AddBloc
            setIsAddBloc={setIsAddBloc}
            session={session}
            blocList={blocList}
            refetchSession={refetchSession}
          />
        )}
        <Modal
          open={isOpenModal}
          onCancel={closeModal}
          footer={null}
        >
          <p>{message}</p>
        </Modal>
      </Row>
    </Col>
  );
}
