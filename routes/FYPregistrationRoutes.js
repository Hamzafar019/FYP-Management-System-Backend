const express = require('express');
const router = express.Router();
const FYPregister = require(`../models/fyp_registrations.js`);
const Temp = require(`../models/temp.js`);
const FYP_ideas = require(`../models/fyp_ideas.js`);
const Notifications = require(`../models/notifications.js`);
const Users = require(`../models/users.js`);
const { Op } = require('sequelize');
const studentauthentication = require('../middleware/studentauthentication.js');
const supervisorauthentication = require('../middleware/supervisorauthentication.js');
const studentFYPregistrationauthentication = require('../middleware/studentFYPregistrationauthentication.js');
const uniquetitle = require('../middleware/uniquetitle.js');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');

// Create fypidea
router.post('/',studentFYPregistrationauthentication , uniquetitle, async (req, res) => {
  try {
    
    const { title, description, student1, student2, student3 } = req.body;
    const email1=student1
    const email2=student2
    let email3=student3
    if(!email3){
      email3="x@x.x"
    }

    const fyp_registration_status = await FYPregister.findAll({
      where: {
        [Op.or]: [
          { student1: email1 },
          { student2: email1 },
          { student3: email1 },
          { student1: email2 },
          { student2: email2 },
          { student3: email2 },
          { student1: email3 },
          { student2: email3 },
          { student3: email3 },
        ],
      },
    });

    
    if (fyp_registration_status.length === 0) {
    
    const temp = await Temp.create({ title, description});        
    const FYP_registration = await FYPregister.create({ title, description, student1, student2, student3});
    FYP_ideas.update(
      { availability: 'no' }, // Set availability to 'no'
      { where: { title: title } } // Match by title
    )

    const adminUsers = await Users.findAll({
      attributes: ['email'],
      where: {
        role: 'coordinator'
      }
      
    });

    for (const user of adminUsers) {
      await Notifications.create({
        email: user.email,
        text: 'New Registration',
        route: '/coordinator/newRegistrations'
      });}
    res.status(201).json(FYP_registration);
    }
    else{
      
      res.status(400).json({ error:`One or more users are already registered. Please check.!!!!!!!`});
    }
  } catch (error) {
    console.log(error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'Invalid student email(s). Chcdeck if the students exist.' });
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

    const deletedRows = await Temp.destroy({
      where: {
        title: registration.title
      }
    });
    registration.viewed = viewedValue;
    registration.accepted = approveValue;
    registration.reason = reasonValue;
    registration.supervisor = supervisor;

    await registration.save();


    if(supervisor){

   

      await Notifications.create({
        email: supervisor,
        text: `Group ${registration.id} is now under your supervision.`,
        route: '/supervisor/mygroups'
      }); }



    
    const student = await FYPregister.findOne({
      attributes: ['student1','student2','student3'],
      where: {
        id: id
      }
      
    });

    await Notifications.create({
      email: student.student1,
      text: `Your FYP application has been reviewed.`,
      route: '/student/FYPstatus'
    });
    await Notifications.create({
      email: student.student2,
      text: `Your FYP application has been reviewed.`,
      route: '/student/FYPstatus'
    });

    if(student.student3){
    await Notifications.create({
      email: student.student3,
      text: `Your FYP application has been reviewed.`,
      route: '/student/FYPstatus'
    });
}

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/groupdetails',supervisorauthentication, async (req, res) => {
  try {
    
    const id = req.body.id;
    
    const registration = await FYPregister.findByPk(id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    console.log(registration)
    res.json(registration);
  } catch (error) {
    console.log("fff")
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






router.put('/update_title_description/',studentauthentication, uniquetitle, async (req, res) => {
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
    
    const temp = await Temp.create({ title, description});      
    FYP_ideas.update(
      { availability: 'no' }, // Set availability to 'no'
      { where: { title: title } } // Match by title
    )
    
    
    const adminUsers = await Users.findAll({
      attributes: ['email'],
      where: {
        role: 'admin'
      }
      
    });

    for (const user of adminUsers) {
      await Notifications.create({
        email: user.email,
        text: 'New Registration',
        route: '/coordinator/newRegistrations'
      });}
    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports=router