const { Op } = require('sequelize');
const express = require('express');
const supervisorauthentication = require('../middleware/supervisorauthentication.js');
const authentication = require('../middleware/authentication.js');
const router = express.Router();
const Meetings = require('../models/meetings.js');
const FYPregister = require(`../models/fyp_registrations.js`);


// Define your routes
router.post('/create', supervisorauthentication, async (req, res) => {
    try {
      const { groupId } = req.query;
      const { dateTime } = req.body;
      console.log(dateTime)
      // Validate request parameters
  
      // Create a meeting record in the database
      const meeting = await Meetings.create({
        groupId,
        dateTime
        // Add other fields as needed
      });
  
      res.status(201).json(meeting);
    } catch (error) {
      console.error('Error creating meeting:', error);
      res.status(500).json({ error: 'An error occurred while creating the meeting' });
    }
  });

  
  
// API endpoint to retrieve data
router.get('/mymeetings', authentication,async (req, res) => {
  try {
    const  email = req.email;
    console.log( email)
    // Retrieve IDs from FYP_registrations table using the provided email
    const registrations = await FYPregister.findAll({ where: {
      [Op.or]: [
        { student1: email },
        { student2: email },
        { student3: email },
        { supervisor: email }
      ]
    }
    });

    // Check if any registrations with the provided email exist
    if (registrations.length === 0) {
      return res.status(404).json({ error: 'No registrations found for the provided email' });
    }

    // Extract IDs from the registrations data
    const ids = registrations.map(registration => registration.id);

    // Retrieve meetings data for the extracted IDs
    const meetings = await Meetings.findAll({
      where: { groupId: { [Op.in]: ids } }
    });

    // Return meetings data
    res.json(meetings);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update', authentication,async (req, res) => {
  const meetingId = req.query.meetingId;
  const {dateTime, student1, student2, student3, done, meetingMinutes} = req.body;

  try {
    // Find the meeting by its ID
    const meeting = await Meetings.findByPk(meetingId);

    // If meeting not found, return 404 Not Found
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Update meeting attributes with the received data
    await meeting.update({dateTime, student1, student2, student3, done, meetingMinutes});

    // Respond with the updated meeting data
    return res.json(meeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;

