// backend/models/Video.js

const { DataTypes } = require('sequelize');
const db = require('../db');
const Group = require('./fyp_registrations.js'); 

// const Group = require('./fyp_registrations.js'); 
const Video = db.define("Video", {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    //   it will have reference from group table id which is in migration file
    },
    supervisorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      references: {
        model: Group, // Reference the User model
        key: 'supervisor',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoPath: {
      type: DataTypes.STRING, // Store path to the uploaded video file
      allowNull: true,
    },
    videoLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  
  module.exports = Video;