// models/announcement.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const FYP_ideas = db.define('FYP_ideas', {
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
});


module.exports = FYP_ideas;
