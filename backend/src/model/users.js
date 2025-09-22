const { DataTypes } = require('sequelize');
const sequelize = require('./product');

const User = sequelize.define("User", {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false
  }
}, {
  tableName: "user",  
  timestamps: false    
});

module.exports = User;