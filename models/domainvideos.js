// backend/models/Video.js

const { DataTypes } = require('sequelize');
const db = require('../db');
const Domains = require('./domains.js'); 

// const Group = require('./fyp_registrations.js'); 
const Domainvideos = db.define("Domainvideos", {
    
    domainname: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Domains, 
            key: 'domainname',
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
  
  module.exports = Domainvideos;