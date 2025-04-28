import { sequelize, dataTypes } from "../util/database";

export const CalendarSession = sequelize.define("CalendarSession", {
  id: {
    type: dataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: dataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: dataTypes.DATE,
    allowNull: true,
  },
});
