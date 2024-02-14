const express = require('express');
const router = express.Router();
// const Submission = require(`../models/submission.js`);
const { Sequelize } = require('sequelize');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');
// const { Groupsubmissions, _ } = require('../models/groupsubmission.js');
const { Submission, Groupsubmissions } = require('../models/submission_groupsubmission.js');
const Notifications = require(`../models/notifications.js`);
const Users = require(`../models/users.js`);
const { Op } = require('sequelize');


// Endpoint to create submission
router.post('/create', coordinatorauthentication, async (req, res) => {
    try {
        const { name, dueDate, weightage } = req.body; // Extract title and date from request body

        // Create submission in the database
        const submission = await Submission.create({
            name,
            dueDate,
            weightage
        });

        const students = await Users.findAll({
          attributes: ['email'],
          where: {
            role: {[Op.or]: ['student']}
          }
          
        });
    
        for (const user of students) {
          await Notifications.create({
            email: user.email,
            text: `New Submission "${name}"  Opened`,
            route: '/student/viewFYPsubmissions'
          });}

        res.status(201).json(submission); // Send response with created submission
    } catch (error) {
        console.error('Error creating submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/viewall', async (req, res) => {
  try {
    // Fetch all submissions from the database
    const submissions = await Submission.findAll();
    res.status(200).json(submissions); // Send response with all submissions
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Route to get all submissions
router.get('/view', async (req, res) => {
    try {
      // Fetch all submissions from the database
      const submissions = await Submission.findAll({
        where: {
          open: 'yes'
        }
     } );
      res.status(200).json(submissions); // Send response with all submissions
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Assume you have Express router set up in your backend

// Route to edit a submission
router.put('/edit/:id', coordinatorauthentication, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dueDate, open, weightage } = req.body;

    // Update the submission in the database
    const updatedSubmission = await Submission.update(
      { name, dueDate ,open,weightage},
      { where: { id } }
    );
    if (open === 'no') {

    const supervisors = await Users.findAll({
      attributes: ['email'],
      where: {
        role: {[Op.or]: ['supervisor']}
      }
      
    });

    for (const user of supervisors) {
      await Notifications.create({
        email: user.email,
        text: `${name} Submission Closed. Please check the submissions`,
        route: '/supervisor/viewFYPsubmissions'
      });}
    }

    res.status(200).json(updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/marks', async (req, res) => {
  try {
    // Find submissions where open='no' and include SubmissionDetails
    async function getJoinedSubmissions() {
     
    
        try {
          const submissions = await Submission.findAll({
            where: { open: 'no' },
            include: [{ 
              model: Groupsubmissions,
              required: true,
              where: { '$Submission.id$': Sequelize.col('Groupsubmissions.submissionId') } // Join condition
            }]
          });

        return submissions;

        
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }
    
    let totalWeightage = 0; 
    // Usage example
    getJoinedSubmissions()
      .then(submissions => {
        const results = submissions.map(submission => {
          const totalMarksByGroup = {};
    
          // Iterate over Groupsubmissions for each submission
          submission.Groupsubmissions.forEach(groupSubmission => {
            const groupId = groupSubmission.groupId;
            const supervisorMarks = groupSubmission.supervisorMarks;
    
            // If supervisorMarks is not null, calculate the total marks
            if (supervisorMarks !== null) {
              const totalMarks = supervisorMarks;
              // If groupId already exists in totalMarksByGroup, add to it, otherwise set it
              if (totalMarksByGroup.hasOwnProperty(groupId)) {
                totalMarksByGroup[groupId] += totalMarks;
              } else {
                totalMarksByGroup[groupId] = totalMarks;
              }
            }
          });
    
          // Convert totalMarksByGroup object to array of objects
          const totalMarksArray = Object.entries(totalMarksByGroup).map(([groupId, totalMarks]) => ({
            groupId: parseInt(groupId),
            totalMarks
          }));
    
          totalWeightage += submission.weightage;
          return {
            id: submission.id,
            name: submission.name,
            open: submission.open,
            weightage: submission.weightage,
            dueDate: submission.dueDate,
            createdAt: submission.createdAt,
            updatedAt: submission.updatedAt,
            totalMarksByGroup: totalMarksArray
          };
        });
    

        const groupTotals = {};

    // Calculate total marks for each group
    results.forEach(submission => {
      submission.totalMarksByGroup.forEach(group => {
        const { groupId, totalMarks } = group;
        if (!groupTotals[groupId]) {
          groupTotals[groupId] = totalMarks;
        } else {
          groupTotals[groupId] += totalMarks;
        }
      });
    });

    // Convert group totals to an array of objects
    const groupTotalsArray = Object.keys(groupTotals).map(groupId => ({
      groupId: parseInt(groupId),
      totalMarks: groupTotals[groupId]
    }));


    
    groupTotalsArray.sort((a, b) => b.totalMarks - a.totalMarks);
console.log(totalWeightage)
        // Send the results as JSON response
        res.json({groupTotalsArray,totalWeightage});
      })
      .catch(error => console.error('Error:', error));
    // Calculate total marks for each group ID
    
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

  



