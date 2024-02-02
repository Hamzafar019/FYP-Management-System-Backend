const { DataTypes } = require('sequelize');
const db = require('../db');

const Rejected_projects = db.define('Rejected_projects', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT, // Define the data type for the reason field
    allowNull: true, // Set allowNull based on whether the reason is required or not
  },
});

module.exports = Rejected_projects;
