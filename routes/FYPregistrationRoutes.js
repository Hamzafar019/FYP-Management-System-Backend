const express = require('express');
const router = express.Router();
const FYPregister = require(`../models/fyp_registrations.js`);
const { Op } = require('sequelize');
const studentauthentication = require('../middleware/studentauthentication.js');
const studentFYPregistrationauthentication = require('../middleware/studentFYPregistrationauthentication.js');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');


// Create fypidea
router.post('/',studentFYPregistrationauthentication , async (req, res) => {
  try {
    const { title, description, student1, student2, student3 } = req.body;
    const FYP_registration = await FYPregister.create({ title, description, student1, student2, student3});

    
  res.status(201).json(FYP_registration);
  } catch (error) {
    console.log(error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'Invalid student email(s). Check if the students exist.' });
    } else if (error.name === 'SequelizeUniqueConstraintError') {

      res.status(400).json({
        error: `One or more users are already registered. Please check.`,
      });
    }
    else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

router.get('/newregistrations/', coordinatorauthentication, async (req, res) => {
  try {
    const fyp_registrations_requests = await FYPregister.findAll({
      where: {
        viewed: 'no',
      },
    });

    if (fyp_registrations_requests.length === 0) {
      return res.status(404).json({ error: 'No new registrations found...' });
    }

    return res.json(fyp_registrations_requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/status/', studentauthentication, async (req, res) => {
  try {
    
    const email= req.email
    const fyp_registration_status = await FYPregister.findAll({
      where: {
        [Op.or]: [
          { student1: email },
          { student2: email },
          { student3: email },
        ],
      },
    });

    if (fyp_registration_status.length === 0) {
      return res.status(404).json({ error: 'You Havent registered yet!!!' });
    }

    return res.json(fyp_registration_status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/update/',coordinatorauthentication, async (req, res) => {
  try {
    const { id } = req.query;
    const { viewedValue, approveValue, reasonValue,supervisor} = req.body;
    const registration = await FYPregister.findByPk(id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    registration.viewed = viewedValue;
    registration.accepted = approveValue;
    registration.reason = reasonValue;
    registration.supervisor = supervisor;

    await registration.save();

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/update_title_description/',studentauthentication, async (req, res) => {
  try {
    const { id } = req.query;
    const { title, description} = req.body;
    const registration = await FYPregister.findByPk(id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    registration.title=title
    registration.description=description
    registration.viewed = "no";
    registration.accepted = "no";
    registration.reason = null;
    registration.supervisor = null;

    await registration.save();

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports=router