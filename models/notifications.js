const { DataTypes } = require('sequelize');
const db = require('../db');

const Notifications = db.define('Notifications', {
    email: {
      type: DataTypes.STRING,
      allowNull: false // Email cannot be null
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false // Text cannot be null
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false // Route cannot be null
    },
    view: {
      type: DataTypes.ENUM('yes', 'no'),
      allowNull: false,
      defaultValue:"no"
    },
  });
  

  
module.exports = Notifications;
