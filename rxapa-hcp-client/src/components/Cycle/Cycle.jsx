import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import image from "../../images/cycle.webp";
import { useTranslation } from "react-i18next";

export default function Cycle({ onClick, onSelect, cycle, deleteCycle }) {
  const { t } = useTranslation();
  return (
    <Card
      hoverable
      cover={<img alt="example" src={image} className="cycle-img" />}
      className="cycle"
    >
      <Card.Meta
        title={<Typography.Title level={5}>{cycle.name}</Typography.Title>}
        description={<Typography.Text>{cycle.description}</Typography.Text>}
      />
      <div style={{ marginTop: 16 }}>
        <Button
          onClick={() => {
            // Create a synthetic event object
            const event = {
              currentTarget: {
                name: "edit-cycle",
              },
            };
            onClick(event);
            onSelect(cycle);
          }}
          type="primary"
        >
          {t("Cycles:edit_button")}
        </Button>
        <Button
          onClick={() => {
            // calls parent function to delete the cycle
            deleteCycle(cycle);
          }}
          type="primary"
          danger
          icon={<DeleteOutlined />}
          style={{ marginLeft: 8 }}
        >
          {t("Cycles:delete_button")}
        </Button>
      </div>
    </Card>
  );
}

Cycle.propTypes = {
  onClick: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  cycle: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  deleteCycle: PropTypes.func.isRequired,
};
