import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/database";

class SessionHistory extends Model {
    public id!: number;
    public sessionKey!: string;
    public date!: Date;
    public previousName!: string;
    public previousDescription?: string;
    public previousConstraints?: string;
    public previousDay?: string;
}

SessionHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sessionKey: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Sessions",
                key: "key",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        previousName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        previousDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        previousConstraints: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        previousDay: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: "SessionHistory",
        tableName: "session_history",
        timestamps: false,
    }
);

export { SessionHistory }; 