import React, { useState } from "react";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row, Button, Modal, Input, Select, Pagination } from "antd";
import CreateProgram from "./CreateProgram";
import Program from "./Program";
import ProgramDetails from "./ProgramDetails";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import { useTranslation } from "react-i18next";

export default function ProgramMenu() {
  // tracks the state of two buttons: create a program and edit a program
  const [buttonState, setButtonState] = useState({
    isCreateProgram: false,
    isEditProgram: false,
  });

  // feedback message hooks
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useToken();
  const { t } = useTranslation();
  // selected program to be edited
  const [selectedProgram, setSelectedProgram] = useState(null);

   // Search state
   const [searchTerm, setSearchTerm] = useState("");

    // New state variables for duration, duration unit, and description keywords
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("");
  const [descriptionKeywords, setDescriptionKeywords] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); // Nombre de programmes par page

  const durationUnits = [
    {value: "", label: "Search by duration unit"},
    { value: "days", label: "days" }, 
    { value: "weeks", label: "weeks" }, 
  ];

  //////////////////////////////
  // DATA QUERY FOR PROGRAMS ///
  //////////////////////////////
  const programUrl = `${Constants.SERVER_URL}/programs`;
  // programs is a unique name for this query
  const {
    data: programList,
    isLoading: isProgramLoading,
    isError: isProgramLoadingError,
    refetch: refetchPrograms,
  } = useQuery(["programs"], () => {
    return axios
      .get(programUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        return res.data;
      });
  });

  /////////////////////////////////////
  /// PROGRAM QUERY VALIDATIONS ///
  /////////////////////////////////////
  if (isProgramLoading) {
    return <h1>{t("Programs:loading_program_phases")}</h1>;
  }
  if (isProgramLoadingError) {
    return <h1>{t("Programs:loading_program_phases_error")}</h1>;
  }

  /**
   * Handles button event, which represents either create a
   * program or edit a program.
   * @param {*} event - the triggered event of the button
   */
  function handleButtonState(event) {
    const { name } = event.currentTarget;

    setButtonState(() => {
      if (name === "create-program") {
        return {
          isCreateProgram: true,
          isEditProgram: false,
        };
      } else if (name === "edit-program") {
        return {
          isCreateProgram: false,
          isEditProgram: true,
        };
      } else {
        return {
          isCreateProgram: false,
          isEditProgram: false,
        };
      }
    });
  }

  function handleSelectProgram(program) {
    setSelectedProgram(program);
  }

  /**
   * Delete a program.
   * @param {*} program
   */
  const deleteProgram = (program) => {
    axios
      .delete(`${Constants.SERVER_URL}/delete-program/${program.key}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        refetchPrograms();
        openModal(res.data.message, false);
      })
      .catch((err) => openModal(err.response?.data?.message, true));
  };

  // Fonction pour gérer le terme de recherche
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fonction pour gérer la durée
  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  // Fonction pour gérer l'unité de durée
  const handleDurationUnitChange = (value) => {
    setDurationUnit(value);
  };

  // Fonction pour gérer les mots-clés dans la description
  const handleDescriptionKeywordsChange = (e) => {
    setDescriptionKeywords(e.target.value);
  };

  // Filtrer les programmes en fonction des critères
  const filteredPrograms = programList?.filter((program) => {
    const nameMatch = program.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const durationMatch = duration
      ? program.duration === parseInt(duration)
      : true;
    const durationUnitMatch = durationUnit
      ? program.duration_unit === durationUnit
      : true;
    const descriptionMatch = descriptionKeywords
      ? program.description
          .toLowerCase()
          .includes(descriptionKeywords.toLowerCase())
      : true;

    return nameMatch && durationMatch && durationUnitMatch && descriptionMatch;
  });

  // Programmes pour la page actuelle
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    <div>
      {/* display program when neither create nor edit program is clicked */}
      {!buttonState.isCreateProgram && !buttonState.isEditProgram && (
        <div>
          <Row className="program-header">
            {/* creates a program button */}
            <Col>
              <Button
                onClick={handleButtonState}
                name="create-program"
                type="primary"
                icon={<PlusOutlined />}
                className="create-button"
              >
                {t("Programs:create_program_button")}
              </Button>
            </Col>

            {/* create a search bar*/}
            <Col>
              <Input
                placeholder= "Search a program"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </Col>
          </Row>

          {/* Add more program filter */}
          <Row
            gutter={[16, 16]}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Col>
              <Input
                placeholder="Search by duration"
                value={duration}
                onChange={handleDurationChange}
                type="number"
                className="search-input"
              />
            </Col>
            <Col>
              <Select
                placeholder="Search by duration unit"
                value={durationUnit}
                onChange={handleDurationUnitChange}
                options={durationUnits}
                className="search-input"
              />
            </Col>
            <Col>
              <Input
                placeholder="Search by description keywords"
                value={descriptionKeywords}
                onChange={handleDescriptionKeywordsChange}
                className="search-input"
              />
            </Col>
          </Row>

          {/* Display filtered programs */}
          <Row gutter={[16, 16]}>
            {paginatedPrograms?.map((program) => {
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={program.key}>
                  <Program
                    onClick={handleButtonState}
                    onSelect={handleSelectProgram}
                    program={program}
                    deleteProgram={deleteProgram}
                  />
                </Col>
              );
            })}
          </Row>

          {/* Pagination */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredPrograms.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            style={{
              textAlign: "center",
              marginTop: "20px",
              justifyContent: "center",
            }}
          />
        </div>
      )}

      {/* Shows the back button if create program button is clicked */}
      {(buttonState.isCreateProgram || buttonState.isEditProgram) && (
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Button
              onClick={handleButtonState}
              name="back"
              type="primary"
              icon={<ArrowLeftOutlined />}
            >
              {t("Programs:back_button")}
            </Button>
          </Col>
          <Col flex="auto" style={{ textAlign: "center" }}>
            <h2>
            {buttonState.isCreateProgram
                ? t("Programs:create_program")
                : `${t("Programs:edit_title")} ${selectedProgram?.name}`}
            </h2>
          </Col>
          <Col span={4} />
        </Row>
      )}

      {/* show create program input elements when create program is clicked */}
      {buttonState.isCreateProgram && (
        <div>
          <CreateProgram refetchPrograms={refetchPrograms} />
        </div>
      )}

      {/* shows program details when edit program is clicked */}
      {buttonState.isEditProgram && (
        <ProgramDetails program={selectedProgram} />
      )}
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
    </div>
  );
}
