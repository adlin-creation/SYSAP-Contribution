import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Button, Modal, Checkbox, Select } from "antd";
import { SendOutlined,PlusOutlined} from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import "./ProgramStyles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function CreateProgram(props) {
  const { t } = useTranslation();
  const { handleSubmit, control,reset } = useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const { token } = useToken();

  const [sessions, setSessions] = useState([]); 
  const [selectedSessions, setSelectedSessions] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isDropdownVisible, setDropdownVisible] = useState(false); 
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);  
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [uploadType] = useState("file");

  // Récupération des séances depuis l'API
  useEffect(() => {
    axios
      .get(`${Constants.SERVER_URL}/sessions`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }) 
      .then((res) => {
        console.log("Données reçues :", res.data);
        setSessions(res.data);
      })
      .catch((err) => {
        openModal(err.res.data.message, true);
      });
  }, [token]);

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


  const handleSessionSelection = (sessionId) => {
    const isSelected = selectedSessions.includes(sessionId);
    if (isSelected) {
      setSelectedSessions(selectedSessions.filter((id) => id !== sessionId));
    } else {
      setSelectedSessions([...selectedSessions, sessionId]);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    // Ajouter les sessions sélectionnées
    selectedSessions.forEach((sessionId) => {
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

    console.log(t("Selected sessions before submit:"), selectedSessions);


    axios
      .post(`${Constants.SERVER_URL}/create-program`, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        props.refetchPrograms();
        openModal(res.data.message, false);
        reset();
      })
      .catch((err) => openModal(err.response.data.message, true));
  };

  function openModal(message, isError) {
    setMessage(message);
    setIsErrorMessage(isError);
    setIsOpenModal(true);
  }

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
                  placeholder="Program Duration"
                  min="1"
                  type="number"
                  required
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t("Programs:enter_program_duration_unit")}>
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
          
          <Form.Item label={t("Programs:Upload_program_image")}>
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
                      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
                      if (!allowedFormats.includes(file.type)) {
                        alert("Invalid file format. Please upload a .jpg, .png, or .webp file.");
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
          <Form.Item label={t("Programs:Select_sessions_program:")}>
            <Button
              name="sessions"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              Select Sessions
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
                  placeholder={t("Programs:program_sessions_placeholder")}
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
                  Confirm Selection
                </Button>
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
            SUBMIT
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
