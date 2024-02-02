// index.js or any other file where you define associations
const Submission = require('./submission');
const { Groupsubmissions, _ } = require('../models/groupsubmission.js');

// Define associations between Submission and SubmissionDetail
Submission.hasMany(Groupsubmissions, { foreignKey: 'submissionId' });
Groupsubmissions.belongsTo(Submission, { foreignKey: 'submissionId' });

// Export the models if needed
module.exports = {
  Submission,
  Groupsubmissions
};
