import * as React from "react";
import List from "@mui/material/List";
import { Link, Outlet } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./MainMenu.css";
import PropTypes from "prop-types";

export default function MainMenu() {
  return (
    <Container>
      <Row>
        {/* Main menu elements and its otulets */}
        <div style={{ display: "flex" }}>
          <Col className="col-sm-12 col-md-2">
            <nav className="menu">
              <List>
                <Link to="/exercises" style={{ textDecoration: "none" }}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <FitnessCenterRoundedIcon />
                      </ListItemIcon>
                      {/* https://mui.com/material-ui/api/list-item-text/ */}
                      <ListItemText primary="Exercises" />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to="/sessions" style={{ textDecoration: "none" }}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccessAlarmsIcon />
                      </ListItemIcon>
                      {/* https://mui.com/material-ui/api/list-item-text/ */}
                      <ListItemText primary="Sessions" />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to="/programs" style={{ textDecoration: "none" }}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <EventNoteRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Programs" />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to="/patients" style={{ textDecoration: "none" }}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <DirectionsRunIcon />
                      </ListItemIcon>
                      <ListItemText primary="Patients" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
            </nav>
          </Col>
          <Col className="col-md-10">
            <Outlet />
          </Col>
        </div>
        {/* End of main menu */}
      </Row>
    </Container>
  );
}
MainMenu.propTypes = {};
