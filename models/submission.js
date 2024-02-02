// models/announcement.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Submission = db.define('Submission', {
  
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  open: {
    type: DataTypes.ENUM('yes', 'no'),
      allowNull: false,
      defaultValue:"yes"
    },
    weightage:{
      type: DataTypes.INTEGER,
      allowNull: true

    },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
});


module.exports = Submission;
