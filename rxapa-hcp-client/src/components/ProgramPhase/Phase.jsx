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

export default function Phase({ phase, deletePhase, onSelect, onClick }) {
  const { t } = useTranslation();
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
          {`End Condition Type: ${phase.startConditionType}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`End Condition: ${phase.startConditionValue}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`End Condition Type: ${phase.endConditionType}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`End Condition: ${phase.endConditionValue}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {console.log("Phase inside: ", phase)}
          {`Weekly Cycle: ${phase?.Phase_Cycles[0]?.WeeklyCycle?.name}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Frequency: ${phase.frequency}`}
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
          displayText={t("Phases:edit_button")}
          variant={"contained"}
          type={"button"}
          size={"medium"}
        />
        <AppButton
          onClick={() => {
            // calls parent function to delete the exercise
            deletePhase(phase);
          }}
          displayText={t("Sessions:delete_button")}
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
