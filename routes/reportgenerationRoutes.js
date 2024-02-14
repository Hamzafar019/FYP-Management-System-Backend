const express = require('express');
const router = express.Router();
const FYPregister = require(`../models/fyp_registrations.js`);
const { Submission, Groupsubmissions } = require('../models/submission_groupsubmission.js');
const Meetings = require('../models/meetings.js');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');
const { Op } = require('sequelize');

router.get('/details', coordinatorauthentication, async (req, res) => {
    const email = req.query.email;
    console.log(email)
    console.log("\n\n\n")

    try {
        console.log("FFF")
        // Step 1: Find FYP registration by email
        const registration = await FYPregister.findOne({
            where: {
              [Op.or]: [
                { student1: email },
                { student2: email },
                { student3: email }
              ]
            }
          });

        if (!registration) {
        console.log("QQQ")

            return res.status(404).json("Your  registration is not done. Please check your status.");
        }

        let foundInColumn = null;

        if (registration.student1 === email) {
            foundInColumn = 'student1';
        } else if (registration.student2 === email) {
            foundInColumn = 'student2';
        } else if (registration.student3 === email) {
            foundInColumn = 'student3';
        }
        // Create an array to store submission details
        const submissionDetails = [];
        let totalObtainedMarks=0
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
                marks: marks
            });
            totalObtainedMarks+=marks 
            totalMarks+=submission.weightage
        }
        const query = {};

    const attendanceCount = await Meetings.count({where:{[foundInColumn]:"present", 
    groupId: registration.id}});
    
        const meetingsCounts = await Meetings.count({ where:{groupId: registration.id}});
        console.log(registration)
        console.log(meetingsCounts)
        console.log(submissionDetails)

        res.json({ totalObtainedMarks, totalMarks,meetingsCounts,submissionDetails, attendanceCount,registration});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
