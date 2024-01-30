
const { DataTypes } = require('sequelize');
const db = require('../db');
// Define your Submission model
const Groupsubmissions = db.define('Groupsubmissions', {
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supervisorMarks: {
      type: DataTypes.INTEGER,
      allowNull: true // Change to false if supervisor marks are always required
    }
  });
  
  // Define FileUpload model
  const FileUploads = db.define('FileUploads', {
    groupsubmissionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileData: {
      type: DataTypes.BLOB('long'),
      allowNull: false
    },
    fileExtension: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  
module.exports = { Groupsubmissions, FileUploads };