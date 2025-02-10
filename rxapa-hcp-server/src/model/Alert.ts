import { sequelize, dataTypes } from "../util/database";
import { SessionRecord } from "./SessionRecord";

export const Alert = sequelize.define("Alert", {
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
  statusReport: {
    type: dataTypes.ENUM,
    values: ['pending', 'resolved'],
    allowNull: false,
  },
  date: {
    type: dataTypes.DATE,
    allowNull: false,
  },
  SessionRecordId: {
    type: dataTypes.INTEGER,
    references: {
      model: SessionRecord,
      key: 'id'
    },
    allowNull: true,
    onDelete: 'SET NULL'
  }
});


// Utility function to check for pain alerts and create alerts

// Function to check for pain alerts
// async function checkForPainAlerts() {
//   const alerts = await sequelize.query(`
//     SELECT ProgramEnrollementId, date1, date2, date3
//     FROM PainAlertView
//   `, { type: sequelize.QueryTypes.SELECT });

//   for (const alert of alerts) {
//     await Alert.create({
//       statusReport: 'pending',
//       date: new Date(),
//       SessionRecordId: null // or any relevant SessionRecordId
//     });
//   }
// }

// Call this function periodically or after each session record insertion
// checkForPainAlerts();
