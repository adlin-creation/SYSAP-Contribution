import { sequelize, dataTypes } from "../util/database";
import { Session } from "./Session";

/**
 * Creates a Session_WeeklyCycle model (Table), which connects Session with WeeklyCycle.
 */
export const SessionDay = sequelize.define("SessionDay", {
  id: {
    type: dataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  key: {
    type: dataTypes.UUID,
    defaultValue: dataTypes.UUIDV4,
  },
  weekDay: {
    type: dataTypes.ENUM(
      "DAY_ONE",
      "DAY_TWO",
      "DAY_THREE",
      "DAY_FOUR",
      "DAY_FIVE",
      "DAY_SIX",
      "DAY_SEVEN"
    ),
  },
});
