import React from "react";
import { Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons"; // Import des icônes Ant Design

import "./ProgramStyles.css";

export default function Program({ onClick, onSelect, program, deleteProgram }) {
  return (
    <div className="program">
      <List style={{ textAlign: "center" }}>
        <h3>Name: {program.name}</h3>
        <br />
        <h5>Description: {program.description}</h5>
        <br />
        <h5>Duration: {program.duration}</h5>

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
            EDIT
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
            DELETE
          </Button>
        </div>
      </List>
    </div>
  );
}