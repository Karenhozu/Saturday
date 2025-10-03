const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./usersModel");
const Role = require("./roleModel");
const Status = require("./statusModel");

class Task extends Model { }

Task.init(
  {
    id_task: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    task_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    task_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    task_responsible: {
      type: DataTypes.INTEGER,   // antes STRING
      allowNull: true,
      references: {
        model: User,
        key: "id_user"
      }
    },
    task_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    task_start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    task_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    task_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "task",
    timestamps: false,
  }
);

Task.belongsTo(User, { foreignKey: "task_responsible", as: "responsible" });
Task.belongsTo(Role, { foreignKey: "task_role", as: "role" });
Task.belongsTo(Status, { foreignKey: "task_status", as: "status" });

module.exports = Task;
