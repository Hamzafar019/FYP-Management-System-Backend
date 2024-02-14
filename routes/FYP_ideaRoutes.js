const express = require('express');
const router = express.Router();
const FYP_ideas = require(`../models/fyp_ideas.js`);
const Notifications = require(`../models/notifications.js`);
const Users = require(`../models/users.js`);
const { Op } = require('sequelize');
const supervisorauthentication = require('../middleware/supervisorauthentication.js');
const uniquetitle = require('../middleware/uniquetitle.js');


// Create fypidea
router.post('/',supervisorauthentication , uniquetitle, async (req, res) => {
  try {
    const { title, description } = req.body;

    const all_fyps = await FYP_ideas.findAll({
      where:{
          title:title
      }
  });
    if (all_fyps.length > 0) {
      return res.status(404).json({ error: 'Project with this title is already proposed. Kindly check "View FYP Suggestions" for proposed FYPs' });
    }


    const fyp_idea = await FYP_ideas.create({ title, description});

    const students = await Users.findAll({
      attributes: ['email'],
      where: {
        role: {[Op.or]: ['student']}
      }
      
    });

    for (const user of students) {
      await Notifications.create({
        email: user.email,
        text: `FYP idea/Suggestion from Supervisor. Title:  ${title}`,
        route: '/student/viewFYPideas'
      });
    }
    


  res.status(201).json(fyp_idea);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/', async (req, res) => {
    try {
      const fyp_idea = await FYP_ideas.findAll({
        order: [['createdAt', 'DESC']] // Assuming 'createdAt' is the timestamp field
      });
      if (fyp_idea.length === 0) {
        return res.status(404).json({ error: 'No FYP idea found' });
      }
      
      return res.json(fyp_idea);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports=router