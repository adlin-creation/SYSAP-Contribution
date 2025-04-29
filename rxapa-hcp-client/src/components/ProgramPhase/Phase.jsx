<<<<<<< HEAD
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import image from "../../images/phase2.jpeg";
import AppButton from "../Button/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function Phase({ phase, deletePhase, onSelect, onClick }) {
  const { t } = useTranslation("Phases");
  return (
    <Card sx={{ maxWidth: 345 }} className="bloc">
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {phase.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_start_condition_type")}: ${phase.startConditionType}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_start_condition_value")}: ${phase.startConditionValue}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_end_condition_type")}: ${phase.endConditionType}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_end_condition_value")}: ${phase.endConditionValue}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {console.log("Phase inside: ", phase)}
          {`${t("label_weekly_cycle")}: ${
            phase?.Phase_Cycles[0]?.WeeklyCycle?.name
          }`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_frequency")}: ${phase.frequency}`}
        </Typography>
      </CardContent>
      <CardActions>
        <AppButton
          onClick={(event) => {
            // Calls parent onSelect function
            onSelect(phase);
            // calls parent onClick function
            onClick(event);
          }}
          name={"edit-phase"}
          displayText={t("button_edit")}
          variant={"contained"}
          type={"button"}
          size={"medium"}
        />
        <AppButton
          onClick={() => {
            // calls parent function to delete the exercise
            deletePhase(phase);
          }}
          displayText={t("button_delete")}
          variant={"contained"}
          type={"button"}
          color={"error"}
          startIcon={<DeleteIcon />}
        />
        {/* <Button size="small">More</Button> */}
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
Phase.propTypes = {
  phase: PropTypes.shape({
    name: PropTypes.string.isRequired,
    startConditionType: PropTypes.string,
    startConditionValue: PropTypes.string,
    endConditionType: PropTypes.string,
    endConditionValue: PropTypes.string,
    frequency: PropTypes.number,
    Phase_Cycles: PropTypes.arrayOf(
      PropTypes.shape({
        WeeklyCycle: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
  deletePhase: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
=======
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import image from "../../images/phase2.jpeg";
import AppButton from "../Button/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function Phase({ phase, deletePhase, onSelect, onClick }) {
  const { t } = useTranslation("Phases");
  return (
    <Card sx={{ maxWidth: 345 }} className="bloc">
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {phase.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_start_condition_type")}: ${phase.startConditionType}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_start_condition_value")}: ${phase.startConditionValue}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_end_condition_type")}: ${phase.endConditionType}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_end_condition_value")}: ${phase.endConditionValue}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {console.log("Phase inside: ", phase)}
          {`${t("label_weekly_cycle")}: ${
            phase?.Phase_Cycles[0]?.WeeklyCycle?.name
          }`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${t("label_frequency")}: ${phase.frequency}`}
        </Typography>
      </CardContent>
      <CardActions>
        <AppButton
          onClick={(event) => {
            // Calls parent onSelect function
            onSelect(phase);
            // calls parent onClick function
            onClick(event);
          }}
          name={"edit-phase"}
          displayText={t("button_edit")}
          variant={"contained"}
          type={"button"}
          size={"medium"}
        />
        <AppButton
          onClick={() => {
            // calls parent function to delete the exercise
            deletePhase(phase);
          }}
          displayText={t("button_delete")}
          variant={"contained"}
          type={"button"}
          color={"error"}
          startIcon={<DeleteIcon />}
        />
        {/* <Button size="small">More</Button> */}
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
Phase.propTypes = {
  phase: PropTypes.shape({
    name: PropTypes.string.isRequired,
    startConditionType: PropTypes.string,
    startConditionValue: PropTypes.string,
    endConditionType: PropTypes.string,
    endConditionValue: PropTypes.string,
    frequency: PropTypes.number,
    Phase_Cycles: PropTypes.arrayOf(
      PropTypes.shape({
        WeeklyCycle: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
  deletePhase: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
