const { DataTypes } = require('sequelize');
const db = require('../db');

const Meeting = db.define('Meeting', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  student1: {
    type: DataTypes.ENUM('present', 'absent'),
    allowNull: true
  },
  student2: {
    type: DataTypes.ENUM('present', 'absent'),
    allowNull: true
  },
  student3: {
    type: DataTypes.ENUM('present', 'absent'),
    allowNull: true
  },
  done: {
    type: DataTypes.ENUM('yes', 'no', 'missed'),
    allowNull: false,
    defaultValue: 'no'
  },
  meetingMinutes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Meeting;
