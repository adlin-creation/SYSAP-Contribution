import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

export default function AddSession({
  sessionNames,
  setSelectedSessionName,
  day,
  label,
}) {
  const [selectedDay1SessionName, setSelectedDay1SessionName] =
    React.useState("");
  const [displayedDay1SessionName, setDisplayedDay1SessionName] =
    React.useState("");

  return (
    <div>
      {/* Dropdown menu to select a day session to be used in the weekly cycle */}
      <div>
        <Autocomplete
          value={selectedDay1SessionName}
          onChange={(event, newValue) => {
            setSelectedDay1SessionName(newValue);
            setSelectedSessionName(newValue, day);
          }}
          inputValue={displayedDay1SessionName}
          onInputChange={(event, newInputValue) => {
            setDisplayedDay1SessionName(newInputValue);
          }}
          options={sessionNames}
          // sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
      </div>

      <div style={{ height: "2rem" }}></div>
    </div>
  );
}
AddSession.propTypes = {
  sessionNames: PropTypes.array.isRequired, // liste d’options à afficher
  setSelectedSessionName: PropTypes.func.isRequired, // fonction de callback
  day: PropTypes.string.isRequired, // ou number selon ton code
  label: PropTypes.string.isRequired, // texte pour le label du champ
};
