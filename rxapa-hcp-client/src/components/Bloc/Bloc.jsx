import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import image from "../../images/bloc-exercise.jpeg";
import "./Styles.css";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import BlocDetailsModal from "./BlocDetailsModal"; // Ajout Modal pour afficher les détails

const { Meta } = Card;
const { Title, Text } = Typography;

export default function Bloc({ bloc, onClick, onSelect, deleteBloc }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false); // Gérer l'affichage du modal

  const handleViewExercises = () => {
    console.log("Bloc sélectionné :", bloc); // Vérifier si Exercise_Blocs est présent

    setIsModalVisible(true); // Ouvrir le modal
    onSelect(bloc); // Sélectionner le bloc et le transmettre au parent
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Fermer le modal
  };

  return (
    <>
      <Card
        hoverable
        style={{ maxWidth: 345 }}
        cover={<img alt="example" src={image} height="140" />}
        className="bloc"
      >
        <Meta
          title={<Title level={5}>{bloc.name}</Title>}
          description={<Text>{bloc.description}</Text>}
        />
        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            onClick={() => {
              // Calls parent onSelect function
              onSelect(bloc);
              // calls parent onClick function with specific action
              onClick("edit-bloc");
            }}
            style={{ marginRight: 8 }}
          >
            {t("Blocs:edit_button")}
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              // calls parent function to delete the cycle
              deleteBloc(bloc);
            }}
            icon={<DeleteOutlined />}
          >
            {t("Blocs:delete_button")}
          </Button>
          {/* Ajouter le bouton pour afficher les exercices */}
          <Button
            type="default"
            onClick={handleViewExercises}
            style={{ marginTop: 8 }}
          >
            {t("Blocs:view_exercises_button")}
          </Button>
        </div>
      </Card>

       {/* Modal pour afficher les exercices */}
       <BlocDetailsModal
       visible={isModalVisible}
       onClose={handleCloseModal}
       bloc={bloc} // Passe les informations du bloc sélectionné
     />
     </>

     
    
  );
}
Bloc.propTypes = {
  bloc: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  deleteBloc: PropTypes.func.isRequired,
};
