const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Role = require('./roleModel');

class User extends Model {}

User.init({
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    validate: {
      isInt: true
    }
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  role_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Role,
      key: 'id_rol'
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'user',
  timestamps: false
});

// Asociaciones
User.belongsTo(Role, { foreignKey: 'role_type' });
Role.hasMany(User, { foreignKey: 'role_type' });

module.exports = User;