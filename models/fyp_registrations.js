// models/announcement.js
const { DataTypes } = require('sequelize');
const db = require('../db');
const User = require('./users.js'); 

const FYP_registrations = db.define('FYP_registrations', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  student1: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    references: {
      model: User, // Reference the User model
      key: 'email',
    },
  },
  student2: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    references: {
      model: User, // Reference the User model
      key: 'email',
    },
  },
  student3: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
    references: {
      model: User, // Reference the User model
      key: 'email',
    },
  },
  supervisor: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
    references: {
      model: User, // Reference the User model
      key: 'email',
    },
  },
  accepted: {
    type: DataTypes.ENUM('yes', 'no'),
    allowNull: false,
    defaultValue:"no"
  },
  viewed: {
    type: DataTypes.ENUM('yes', 'no'),
    allowNull: false,
    defaultValue:"no"
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});


module.exports = FYP_registrations;
