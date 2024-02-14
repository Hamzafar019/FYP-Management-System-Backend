// models/announcement.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Domains = db.define('Domains', {
  domainname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = Domains;
