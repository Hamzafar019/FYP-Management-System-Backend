const express = require('express');
const router = express.Router();
const Submission = require(`../models/submission.js`);
const { Op } = require('sequelize');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');

// Endpoint to create submission
router.post('/create', coordinatorauthentication, async (req, res) => {
    try {
        console.log("A")
        const { name, dueDate } = req.body; // Extract title and date from request body

        // Create submission in the database
        const submission = await Submission.create({
            name,
            dueDate
        });

        res.status(201).json(submission); // Send response with created submission
    } catch (error) {
        console.error('Error creating submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to get all submissions
router.get('/view', async (req, res) => {
    try {
      // Fetch all submissions from the database
      const submissions = await Submission.findAll();
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
    const { name, dueDate } = req.body;

    // Update the submission in the database
    const updatedSubmission = await Submission.update(
      { name, dueDate },
      { where: { id } }
    );

    res.status(200).json(updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

  




module.exports=router