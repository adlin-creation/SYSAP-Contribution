import { React, useState } from "react";
import { Row, Col, Input, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import AppButton from "../Button/Button";
import { SendOutlined, PlusOutlined } from "@ant-design/icons";
import "./Styles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import BlocTable from "./BlocTable";
import AddBloc from "./AddBloc";

const FRENCH_DAYS = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" }
];

export default function CreateSession(props) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const [isAddBloc, setIsAddBloc] = useState(false);
  const [createdSession, setCreatedSession] = useState(null);

  // feedback message states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();

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

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      description: data.dayOfWeek ? `[${data.dayOfWeek}] ${data.description || ''}` : data.description,
    };

    axios
      .post(`${Constants.SERVER_URL}/create-session`, updatedData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // Reload the day session to include the new day session
        props.refetchSessions();
        setCreatedSession(res.data.session);
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  function addBloc() {
    setIsAddBloc(true);
  }

  //////////////////////////////////
  /// QUERY VALIDATIONS          ///
  //////////////////////////////////
  if (isBlockListLoading) {
    return <h1>{t("Sessions:blocs_list_load")}</h1>;
  }
  if (isBlockListLoadingError) {
    return <h1>{t("Sessions:blocs_list_loading_error")}</h1>;
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
            <h5>Jour de la semaine</h5>
            <Controller
              name="dayOfWeek"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={onChange}
                  value={value}
                  style={{ width: '100%' }}
                  options={FRENCH_DAYS}
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

        <div className="input-element">
          <BlocTable blocs={[]} />
          <AppButton
            onClick={addBloc}
            displayText={t("Sessions:add_bloc_button")}
            variant={"contained"}
            endIcon={<PlusOutlined />}
            type={"button"}
          />
        </div>

        {isAddBloc && (
          <AddBloc
            setIsAddBloc={setIsAddBloc}
            session={createdSession}
            blocList={blocList}
            refetchSession={() => {
              if (createdSession) {
                axios
                  .get(`${Constants.SERVER_URL}/session/${createdSession.id}`, {
                    headers: {
                      Authorization: "Bearer " + token,
                    },
                  })
                  .then((res) => {
                    setCreatedSession(res.data);
                  });
              }
            }}
          />
        )}

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
