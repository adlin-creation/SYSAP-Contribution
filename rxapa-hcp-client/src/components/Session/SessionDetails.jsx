import { React, useState } from "react";
import { Row, Col, Input, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AppButton from "../Button/Button";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import BlocTable from "./BlocTable";
import AddBloc from "./AddBloc";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ModificationHistory from "./ModificationHistory";

const FRENCH_DAYS = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" }
];

export default function SessionDetails({ sessionKey, refetchSessions }) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const [isAddBloc, setIsAddBloc] = useState(false);
  const [modificationHistory, setModificationHistory] = useState(() => {
    // Initialize from localStorage if exists
    const savedHistory = localStorage.getItem(`session_history_${sessionKey}`);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

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
    return <h1>{t("Sessions:blocs_list_load")}</h1>;
  }
  if (isBlockListLoadingError) {
    return <h1>{t("Sessions:blocs_list_loading_error")}</h1>;
  }

  if (isSessionLoading) {
    return <h1>{t("Sessions:sessions_loading")}</h1>;
  }
  if (isSessionLoadingError) {
    return <h1>{t("Sessions:sessions_loading_error_msg")}</h1>;
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
    // Extract current day from session description
    const dayMatch = session.description?.match(/^\[(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\]/);
    const currentDay = dayMatch ? dayMatch[1] : '';

    // Save current state for history
    const historyEntry = {
      date: new Date().toLocaleString(),
      previousName: session.name,
      previousDescription: session.description?.replace(/^\[(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\]\s*/, '') || '',
      previousConstraints: session.constraints,
      previousDay: currentDay
    };

    const updatedData = {
      ...data,
      description: data.dayOfWeek ? `[${data.dayOfWeek}] ${data.description}` : data.description
    };

    axios
      .put(`${Constants.SERVER_URL}/update-session/` + sessionKey, updatedData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // Update history in state and localStorage
        const newHistory = [historyEntry, ...modificationHistory];
        setModificationHistory(newHistory);
        localStorage.setItem(`session_history_${sessionKey}`, JSON.stringify(newHistory));
        
        openModal(res.data.message, false);
        refetchSession();
        refetchSessions();
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  return (
    <Col span={18}>
      <Row>
        <div className="input-element">
          <h4>
            Modifier {session.name}
          </h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-element">
            <h5>Nom</h5>
            <Controller
              name="name"
              control={control}
              defaultValue={session.name}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Nom de la session"
                />
              )}
            />
          </div>

          <div className="input-element">
            <h5>Jour de la semaine</h5>
            <Controller
              name="dayOfWeek"
              control={control}
              defaultValue={session.description?.match(/^\[(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\]/)?.[1] || ''}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={onChange}
                  value={value}
                  style={{ width: '100%' }}
                  options={FRENCH_DAYS}
                />
              )}
            />
          </div>

          <div className="input-element">
            <h5>Description</h5>
            <Controller
              name="description"
              control={control}
              defaultValue={session.description?.replace(/^\[(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\]\s*/, '') || ''}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder="Description de la session"
                  rows={4}
                />
              )}
            />
          </div>

          <div className="input-element">
            <h5>Contraintes</h5>
            <Controller
              name="constraints"
              control={control}
              defaultValue={session.constraints}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Contraintes de la session"
                />
              )}
            />
          </div>

          <div className="input-element">
            <AppButton
              onClick={updateSession}
              displayText="METTRE À JOUR"
              variant="contained"
              endIcon={<CheckOutlined />}
              type="submit"
            />
          </div>
        </form>

        <div className="input-element">
          <BlocTable blocs={session?.Bloc_Sessions} />
          <AppButton
            onClick={addBloc}
            displayText="AJOUTER UN BLOC"
            variant="contained"
            endIcon={<PlusOutlined />}
            type="button"
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
      </Row>

      <div className="history-section">
        <ModificationHistory history={modificationHistory} />
      </div>

      <Modal open={isOpenModal} onCancel={closeModal} footer={null}>
        <p>{message}</p>
      </Modal>
    </Col>
  );
}
SessionDetails.propTypes = {
  sessionKey: PropTypes.string.isRequired,
  refetchSessions: PropTypes.func.isRequired,
};
