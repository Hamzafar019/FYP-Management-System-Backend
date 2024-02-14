// models/announcement.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Industry_projects = db.define('Industry_projects', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  availability: {
    type: DataTypes.ENUM('yes', 'no'),
    allowNull: false,
    defaultValue:"yes"
  },
  companyname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});


module.exports = Industry_projects;
