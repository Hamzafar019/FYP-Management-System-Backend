const { DataTypes } = require('sequelize');
const db = require('../db');

const Temp = db.define('Temp', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
  
}
, {
  tableName: 'temp' // Specify the correct table name here
});


module.exports = Temp;
