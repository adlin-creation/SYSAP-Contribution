import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function MenuItem(props, { icon }) {
  return (
    <div style={{ display: "flex" }}>
      <nav>
        <ListItem disablePadding>
          <ListItemButton>
            {/* https://mui.com/material-ui/api/list-item-text/ */}
            <ListItemText
              style={{ textDecoration: "none" }}
              primary={props.name}
              secondary={props.descritpion}
            />
          </ListItemButton>
        </ListItem>
      </nav>
    </div>
  );
}
