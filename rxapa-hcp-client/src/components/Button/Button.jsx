import { Button } from "@mui/material";
import PropTypes from "prop-types";

function AppButton(props) {
  return (
    <Button
      style={{ margin: "0.2rem" }}
      // function to be called when the button is clicked
      onClick={props.onClick}
      // text, outlined, or contained
      variant={props.variant}
      startIcon={props.startIcon}
      endIcon={props.endIcon}
      href={props.href}
      // e.g., success, error, secondary
      color={props.color}
      // small, medium or large
      size={props.size}
      type={props.type}
      value={props.value}
      name={props.name}
      parentComponent={props.parentComponent}
    >
      {props.displayText}
    </Button>
  );
}
AppButton.propTypes = {
  onClick: PropTypes.func,
  variant: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  href: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  parentComponent: PropTypes.string,
  displayText: PropTypes.node, // 
};

export default AppButton;
