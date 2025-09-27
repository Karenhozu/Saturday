const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');


class Role extends Model {}

Role.init({
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_rol: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'role',
  timestamps: false
});

module.exports = Role;
