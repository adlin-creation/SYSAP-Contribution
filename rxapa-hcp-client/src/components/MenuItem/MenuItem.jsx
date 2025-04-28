import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";

export default function MenuItem({ name, description }) {
  return (
    <div style={{ display: "flex" }}>
      <nav>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              style={{ textDecoration: "none" }}
              primary={name}
              secondary={description}
            />
          </ListItemButton>
        </ListItem>
      </nav>
    </div>
  );
}

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
};
