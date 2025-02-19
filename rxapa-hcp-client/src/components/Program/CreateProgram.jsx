import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, Modal, Radio, Checkbox } from "antd";
import { SendOutlined,PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import "./ProgramStyles.css";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";


export default function CreateProgram(props) {
  const { handleSubmit, control } = useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const { token } = useToken();

  const [sessions, setSessions] = useState([]); // Stocke les séances récupérées
  const [selectedSessions, setSelectedSessions] = useState([]); // Stocke les séances sélectionnées
  const [searchQuery, setSearchQuery] = useState(""); // Gère la recherche des séances
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Gère la visibilité du menu déroulant

  const [uploadType, setUploadType] = useState("file");

  // Récupération des séances depuis l'API
  useEffect(() => {
    axios
      .get(`${Constants.SERVER_URL}`) // Remplace par l'URL de ton API
      .then((response) => {
        setSessions(response.data.sessions || []);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des séances :", error);
      });
  }, []);

  // Filtrer les séances en fonction de la recherche
  const filteredSessions = sessions.filter((session) =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSessionSelection = (sessionId) => {
    const isSelected = selectedSessions.includes(sessionId);
    if (isSelected) {
      setSelectedSessions(
        selectedSessions.filter((id) => id !== sessionId)
      );
    } else {
      setSelectedSessions([...selectedSessions, sessionId]);
    }
  };

  const onSubmit = (data) => {
    axios
      .post(`${Constants.SERVER_URL}/create-program`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // Reload program list to include the new program
        props.refetchPrograms();
        openModal(res.data.message, false);
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

          <Form.Item label="Please enter the code of the program : ">
            <Controller
              name="code"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  placeholder="Program Code"
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

          <Form.Item label="Please enter the duration of the program (in days) : ">
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
          
          <Form.Item label="Choose how to upload the program image:">
            <Radio.Group
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
            >
              <Radio value="file">Upload File</Radio>
              <Radio value="url">Enter URL</Radio>
            </Radio.Group>
          </Form.Item>

          {uploadType === "file" && (
            <Form.Item label="Upload the image of the program (optional):">
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
                          e.target.value = ""; // Reset the input if format is invalid
                          return;
                        }
                        onChange(file); // Save the file if valid
                      } else {
                        onChange(null); // Clear the file if removed
                      }
                    }}
                  />
                )}
              />
            </Form.Item>
          )}

          {uploadType === "url" && (
            <Form.Item label="Enter the URL of the program image (optional):">
              <Controller
                name="imageURL"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder="Program Image URL"
                  />
                )}
              />
            </Form.Item>
          )}

          {/* Sélection des séances */}
          <Form.Item label="Select sessions for the program:">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              Select Sessions
            </Button>
            {isDropdownVisible && (
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginTop: "10px",
                  backgroundColor: "#fff",
                  position: "absolute",
                  zIndex: 10,
                }}
              >
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
                {filteredSessions.map((session) => (
                  <div key={session.id}>
                    <Checkbox
                      checked={selectedSessions.includes(session.id)}
                      onChange={() => handleSessionSelection(session.id)}
                    >
                      {session.name}
                    </Checkbox>
                  </div>
                ))}
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


//Vulnerability detected in the code by copilot ia. Hardcoded credentials are present in the code. The code is vulnerable to information disclosure.