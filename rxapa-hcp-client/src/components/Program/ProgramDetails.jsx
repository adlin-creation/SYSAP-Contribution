<<<<<<< HEAD
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col, Form, Input, Button, Modal, Checkbox, Select } from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import AddProgramPhase from "./AddProgramPhase";
import ProgramPhaseTable from "./ProgramPhaseTable";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function ProgramDetails({ program }) {
  const { handleSubmit, control, reset } = useForm();
  const [isAddProgramPhase, setIsAddProgramPhase] = useState(false);
  const { token } = useToken();
  const { t } = useTranslation("Programs");

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const [sessions, setSessions] = useState([]); // Stocke les séances récupérées
  const [selectedSessions, setSelectedSessions] = useState([]); // Stocke les séances sélectionnées
  const [searchQuery, setSearchQuery] = useState(""); // Gère la recherche des séances
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Gère la visibilité du menu déroulant
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null); // Reference for the button
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [uploadType] = useState("file");

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

  // // Récupération des séances liee a un programme
  useEffect(() => {
    if (program && token) {
      // Envoi de la requête pour récupérer les sessions associées au programme
      axios
        .get(`${Constants.SERVER_URL}/programs/${program.id}/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Vérification de la structure de la réponse
          if (res && res.data && Array.isArray(res.data)) {
            const sessionIds = res.data.map((session) => session.id);
            setSelectedSessions(sessionIds);
          } else {
            console.warn("Aucune séance trouvée pour ce programme.");
            setSelectedSessions([]);
          }
        })
        .catch((err) => {
          // Gestion des erreurs réseau ou autres problèmes
          console.error(
            "Erreur lors du chargement des sessions du programme :",
            err
          );
        });
    }
  }, [program, token]);

  // Récupération des séances depuis l'API
  useEffect(() => {
    axios
      .get(`${Constants.SERVER_URL}/sessions`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setSessions(res.data);
      })
      .catch((err) => {
        openModal(t(`Backend:${err.res.data.message}`), true);
      });
  }, [token]);

  // Pre-remplir les champs du formulaire avec les donnees recu du programme
  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        description: program.description,
        duration: program.duration,
        duration_unit: program.duration_unit,
        image: program.image,
      });
    }
  }, [program, reset]);

  //Fermer la liste deroulante si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gerer le dropdown
  useEffect(() => {
    if (isDropdownVisible && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.left + window.scrollX,
      });
    }
  }, [isDropdownVisible]);

  // Filtrer les séances en fonction de la recherche
  const filteredSessions = sessions.filter((session) =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSessionSelection = useCallback((sessionId) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  }, []);

  //////////////////////////////////
  /// QUERY VALIDATIONS          ///
  //////////////////////////////////
  if (isProgramPhasesLoading) {
    return <h1>{t("title_loading_program_phases")}</h1>;
  }
  if (isProgramPhasesLoadingError) {
    return <h1>{t("error_loading_program_phases")}</h1>;
  }

  if (isAllProgramPhasesLoading) {
    return <h1>{t("title_loading_all_phases")}</h1>;
  }
  if (isAllProgramPhasesLoadingError) {
    return <h1>{t("error_loading_all_phases")}</h1>;
  }

  function addProgramPhase() {
    setIsAddProgramPhase(true);
  }

  /**
   *
   * update program
   */
  const onSubmit = (data) => {
    const formData = new FormData();

    const validSessions = selectedSessions.filter(
      (session) => session !== undefined && session !== null
    );

    // Ajouter les sessions sélectionnées
    validSessions.forEach((sessionId) => {
      formData.append("sessions[]", sessionId);
    });

    // Ajouter les autres données du programme
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Ajouter l'image si elle existe
    if (uploadType === "file" && data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    axios
      .put(`${Constants.SERVER_URL}/update-program/${program.key}`, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        openModal(t(`Backend:${res.data.message}`), false);
        reset();
      })
      .catch((err) => {
        console.error("Error response:", err);

        const errorMessage =
          t(`Backend:${err.response?.data?.message}`) || t("error_unknown");
        openModal(errorMessage, true);
      });
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
          <Form.Item label={t("label_program_name")}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_program_name")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_program_description")}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_program_description")}
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_program_duration")}>
            <Controller
              name="duration"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_program_duration")}
                  min="1"
                  type="number"
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_duration_unit")}>
            <Controller
              name="duration_unit"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select onChange={onChange} value={value} required>
                  <Select.Option value="days">Jours</Select.Option>
                  <Select.Option value="weeks">Semaines</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_program_image")}>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <Input
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const allowedFormats = [
                        "image/jpg",
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                      ];
                      if (!allowedFormats.includes(file.type)) {
                        alert(t("alert_file_format"));
                        e.target.value = "";
                        return;
                      }
                      onChange(file);
                    } else {
                      onChange(null);
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          {/* Sélection des séances */}
          <Form.Item label={t("label_session_selection")}>
            <Button
              name="sessions"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              {t("button_select_sessions")}
            </Button>

            {isDropdownVisible && (
              <div
                ref={dropdownRef}
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                }}
              >
                <Input
                  name="sessions"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />

                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <div key={session.id}>
                      <Checkbox
                        checked={selectedSessions.includes(session.id)}
                        onChange={() => handleSessionSelection(session.id)}
                      >
                        {session.name}
                      </Checkbox>
                    </div>
                  ))
                ) : (
                  <p className="no-sessions-message">No sessions found</p>
                )}

                <Button
                  type="primary"
                  block
                  className="confirm-button"
                  onClick={() => setDropdownVisible(false)}
                >
                  {t("button_confirm_selection")}
                </Button>
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("button_update")}
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
            {t("button_add_program_phase")}
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

ProgramDetails.propTypes = {
  program: PropTypes.shape({
    id: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.string,
    duration_unit: PropTypes.oneOf(["days", "weeks"]),
    image: PropTypes.string,
  }).isRequired,
};
=======
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col, Form, Input, Button, Modal, Checkbox, Select } from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import AddProgramPhase from "./AddProgramPhase";
import ProgramPhaseTable from "./ProgramPhaseTable";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function ProgramDetails({ program }) {
  const { handleSubmit, control, reset } = useForm();
  const [isAddProgramPhase, setIsAddProgramPhase] = useState(false);
  const { token } = useToken();
  const { t } = useTranslation("Programs");

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const [sessions, setSessions] = useState([]); // Stocke les séances récupérées
  const [selectedSessions, setSelectedSessions] = useState([]); // Stocke les séances sélectionnées
  const [searchQuery, setSearchQuery] = useState(""); // Gère la recherche des séances
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Gère la visibilité du menu déroulant
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null); // Reference for the button
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [uploadType] = useState("file");

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

  // // Récupération des séances liee a un programme
  useEffect(() => {
    if (program && token) {
      // Envoi de la requête pour récupérer les sessions associées au programme
      axios
        .get(`${Constants.SERVER_URL}/programs/${program.id}/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Vérification de la structure de la réponse
          if (res && res.data && Array.isArray(res.data)) {
            const sessionIds = res.data.map((session) => session.id);
            setSelectedSessions(sessionIds);
          } else {
            console.warn("Aucune séance trouvée pour ce programme.");
            setSelectedSessions([]);
          }
        })
        .catch((err) => {
          // Gestion des erreurs réseau ou autres problèmes
          console.error(
            "Erreur lors du chargement des sessions du programme :",
            err
          );
        });
    }
  }, [program, token]);

  // Récupération des séances depuis l'API
  useEffect(() => {
    axios
      .get(`${Constants.SERVER_URL}/sessions`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setSessions(res.data);
      })
      .catch((err) => {
        openModal(t(`Backend:${err.res.data.message}`), true);
      });
  }, [token]);

  // Pre-remplir les champs du formulaire avec les donnees recu du programme
  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        description: program.description,
        duration: program.duration,
        duration_unit: program.duration_unit,
        image: program.image,
      });
    }
  }, [program, reset]);

  //Fermer la liste deroulante si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gerer le dropdown
  useEffect(() => {
    if (isDropdownVisible && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.left + window.scrollX,
      });
    }
  }, [isDropdownVisible]);

  // Filtrer les séances en fonction de la recherche
  const filteredSessions = sessions.filter((session) =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSessionSelection = useCallback((sessionId) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  }, []);

  //////////////////////////////////
  /// QUERY VALIDATIONS          ///
  //////////////////////////////////
  if (isProgramPhasesLoading) {
    return <h1>{t("title_loading_program_phases")}</h1>;
  }
  if (isProgramPhasesLoadingError) {
    return <h1>{t("error_loading_program_phases")}</h1>;
  }

  if (isAllProgramPhasesLoading) {
    return <h1>{t("title_loading_all_phases")}</h1>;
  }
  if (isAllProgramPhasesLoadingError) {
    return <h1>{t("error_loading_all_phases")}</h1>;
  }

  function addProgramPhase() {
    setIsAddProgramPhase(true);
  }

  /**
   *
   * update program
   */
  const onSubmit = (data) => {
    const formData = new FormData();

    const validSessions = selectedSessions.filter(
      (session) => session !== undefined && session !== null
    );

    // Ajouter les sessions sélectionnées
    validSessions.forEach((sessionId) => {
      formData.append("sessions[]", sessionId);
    });

    // Ajouter les autres données du programme
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Ajouter l'image si elle existe
    if (uploadType === "file" && data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    axios
      .put(`${Constants.SERVER_URL}/update-program/${program.key}`, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        openModal(t(`Backend:${res.data.message}`), false);
        reset();
      })
      .catch((err) => {
        console.error("Error response:", err);

        const errorMessage =
          t(`Backend:${err.response?.data?.message}`) || t("error_unknown");
        openModal(errorMessage, true);
      });
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
          <Form.Item label={t("label_program_name")}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_program_name")}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_program_description")}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input.TextArea
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_program_description")}
                  rows={4}
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_program_duration")}>
            <Controller
              name="duration"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder={t("placeholder_program_duration")}
                  min="1"
                  type="number"
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_duration_unit")}>
            <Controller
              name="duration_unit"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select onChange={onChange} value={value} required>
                  <Select.Option value="days">Jours</Select.Option>
                  <Select.Option value="weeks">Semaines</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label={t("label_program_image")}>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <Input
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const allowedFormats = [
                        "image/jpg",
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                      ];
                      if (!allowedFormats.includes(file.type)) {
                        alert(t("alert_file_format"));
                        e.target.value = "";
                        return;
                      }
                      onChange(file);
                    } else {
                      onChange(null);
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          {/* Sélection des séances */}
          <Form.Item label={t("label_session_selection")}>
            <Button
              name="sessions"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              {t("button_select_sessions")}
            </Button>

            {isDropdownVisible && (
              <div
                ref={dropdownRef}
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                }}
              >
                <Input
                  name="sessions"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />

                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <div key={session.id}>
                      <Checkbox
                        checked={selectedSessions.includes(session.id)}
                        onChange={() => handleSessionSelection(session.id)}
                      >
                        {session.name}
                      </Checkbox>
                    </div>
                  ))
                ) : (
                  <p className="no-sessions-message">No sessions found</p>
                )}

                <Button
                  type="primary"
                  block
                  className="confirm-button"
                  onClick={() => setDropdownVisible(false)}
                >
                  {t("button_confirm_selection")}
                </Button>
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              {t("button_update")}
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
            {t("button_add_program_phase")}
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

ProgramDetails.propTypes = {
  program: PropTypes.shape({
    id: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.string,
    duration_unit: PropTypes.oneOf(["days", "weeks"]),
    image: PropTypes.string,
  }).isRequired,
};
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
