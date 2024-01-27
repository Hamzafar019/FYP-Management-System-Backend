// models/announcement.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const All_FYPS = db.define('All_FYPS', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  semester: {
    type: DataTypes.ENUM('fall', 'spring'), // You might want to adjust the data type based on your requirements
    allowNull: false,
    
  },
  year: {
    type: DataTypes.INTEGER, // Assuming year is a numeric value, adjust the data type if needed
    allowNull: false,
  },
});

module.exports = All_FYPS;
