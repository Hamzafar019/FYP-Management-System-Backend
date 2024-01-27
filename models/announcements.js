// models/announcement.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Announcement = db.define('Announcement', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  target: {
    type: DataTypes.ENUM('student', 'supervisor', 'both'),
    allowNull: false,
  },
});


module.exports = Announcement;
