import React from "react";
import { Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons"; // Import des icônes Ant Design

import "./ProgramStyles.css";
import { useTranslation } from "react-i18next";

export default function Program({ onClick, onSelect, program, deleteProgram }) {
  const { t } = useTranslation();
  return (
    <div className="program">
      <List style={{ textAlign: "center" }}>
        <h3>
          {t("Programs:name_title")}: {program.name}
        </h3>
        <br />
        <h5>
          {t("Programs:description_title")}: {program.description}
        </h5>
        <br />
        <h5>
          {t("Programs:duration_title")}: {program.duration}
        </h5>

        <div>
          <Button
            onClick={(event) => {
              // calls parent onClick function
              onClick(event);
              // Calls parent onSelect function
              onSelect(program);
            }}
            name="edit-program"
            type="primary"
          >
            {t("Programs:edit_button")}
          </Button>
          <Button
            onClick={() => {
              // calls parent function to delete the cycle
              deleteProgram(program);
            }}
            type="primary"
            danger
            icon={<DeleteOutlined />}
          >
            {t("Programs:delete_button")}
          </Button>
        </div>
      </List>
    </div>
  );
}
