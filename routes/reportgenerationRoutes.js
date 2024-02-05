const express = require('express');
const router = express.Router();
const FYPregister = require(`../models/fyp_registrations.js`);
const { Submission, Groupsubmissions } = require('../models/submission_groupsubmission.js');
const Meetings = require('../models/meetings.js');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');

router.get('/details/:email', coordinatorauthentication, async (req, res) => {
    const email = req.params.email;

    try {
        // Step 1: Find FYP registration by email
        const registration = await FYPregister.findOne({
            $or: [{ student1: email }, { student2: email }, { student3: email }],
            supervisor: null
        });

        if (!registration) {
            return res.status(404).send("Your registration is not done. Please check your status.");
        }

        let foundInColumn = null;

        if (registration.student1 === email) {
            foundInColumn = 'student1';
        } else if (registration.student2 === email) {
            foundInColumn = 'student2';
        } else if (registration.student3 === email) {
            foundInColumn = 'student3';
        }
        const groupSubmissions = await Groupsubmissions.findAll({ where: { groupId: registration._id } });

        // Create an array to store submission details
        const submissionDetails = [];
        let totalMarks=0
        // Fetch all submissions once to get their details
        const allSubmissions = await Submission.findAll();
    
        // Iterate over all submissions to find marks for each submission
        for (const submission of allSubmissions) {
            const groupSubmission = await Groupsubmissions.findOne({ 
                where: { submissionId: submission.id, groupId: registration.id }
            }); // If there's a group submission, calculate marks; otherwise, set marks to zero
            let marks = groupSubmission ? (groupSubmission.supervisorMarks || 1) * submission.weightage : 0;
            if (groupSubmission) {
                marks = groupSubmission.supervisorMarks || 0;
            } else {
                marks=0    
            }
            // Push details to the submissionDetails array
            submissionDetails.push({
                id: submission.id,
                name: submission.name,
                weightage: submission.weightage,
                marks: marks,
                totalWeightedMarks: marks * submission.weightage
            });
            totalMarks+=marks * submission.weightage
        }
        const query = {};

    // Add the dynamic column name and value to the query object
    query[foundInColumn] = "present";

    // Use the query object in the MongoDB query
    const attendanceCount = await Meetings.count({query});
        // Step 4: Count the number of meetings where the group is present
        const meetingsCounts = await Meetings.count({ where:{groupId: registration.id}});

        res.json({ totalMarks, meetingsCounts,submissionDetails, attendanceCount});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
