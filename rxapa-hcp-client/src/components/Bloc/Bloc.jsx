import React from "react";
import { Card, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import image from "../../images/bloc-exercise.jpeg";
import "./Styles.css";

const { Meta } = Card;
const { Title, Text } = Typography;

export default function Bloc({ bloc, onClick, onSelect, deleteBloc }) {
  return (
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
          EDIT
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
          DELETE
        </Button>
      </div>
    </Card>
  );
}