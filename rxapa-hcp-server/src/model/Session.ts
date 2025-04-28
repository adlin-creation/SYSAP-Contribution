import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { Bloc_Session } from "./Bloc_Session";

/**
 * Creates an Exercise Day Session model (Table) - Represents the exercise schedule/program
 * for a day. A session consists of 1 or more blocs typically occurring at different times
 * of the day. In case of several 'blocs', they can be repeats of the same bloc ('same recipe)
 * or different blocs ('different recipes')
 */
class Session extends Model {
    public id!: number;
    public key!: string;
    public name!: string;
    public description?: string;
    public constraints?: string;
    
    static sequelize = sequelize;

    public async countBloc_Sessions(): Promise<number> {
        return Bloc_Session.count({ where: { SessionId: this.id } });
    }
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        key: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        constraints: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: "Session",
        tableName: "Sessions",
        timestamps: false,
    }
);

export { Session };
