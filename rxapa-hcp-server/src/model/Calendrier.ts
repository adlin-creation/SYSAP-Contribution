import { sequelize, dataTypes } from "../util/database";


export const Calendrier=sequelize.define("Calendrier",{
    id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

    
})