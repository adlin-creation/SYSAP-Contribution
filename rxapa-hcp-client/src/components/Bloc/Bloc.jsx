import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; 
import image from "../../images/bloc-exercise.jpeg";
import "./Styles.css";
import { useTranslation } from "react-i18next";
import BlocDetailsModal from "./BlocDetailsModal"; 

const { Meta } = Card;
const { Title, Text } = Typography;

export default function Bloc({ bloc, deleteBloc }) {
  const { t } = useTranslation();
  const navigate = useNavigate(); 
  const [isModalVisible, setIsModalVisible] = useState(false);

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
            onClick={() => navigate(`/edit-bloc/${bloc.key}`)} 
            style={{ marginRight: 8 }}
          >
            {t("Blocs:edit_button")}
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => deleteBloc(bloc)}
            icon={<DeleteOutlined />}
          >
            {t("Blocs:delete_button")}
          </Button>
          <Button type="default" onClick={() => setIsModalVisible(true)}>
            {t("Blocs:view_button")}
          </Button>
        </div>
      </Card>

      {/* Ajout du Modal */}
      <BlocDetailsModal
        blocKey={bloc.key}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}
