const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');


class Status extends Model {}

Status.init({
  id_status: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'status',
  timestamps: false
});

module.exports = Status;