// models/User.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'student',
    validate: {
      isIn: [['admin', 'supervisor', 'coordinator', 'student']],
    },
  },
});

module.exports = User;
