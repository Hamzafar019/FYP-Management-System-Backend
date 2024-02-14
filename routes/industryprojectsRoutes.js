const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const authentication = require('../middleware/authentication.js');
const IndustryProjects = require('../models/industry_projects.js');
const Notifications = require(`../models/notifications.js`);
const Users = require(`../models/users.js`);
const { Op } = require('sequelize');



router.post('/', async (req, res) => {
    try {
      
      const { title, description, companyName, email } = req.body;
      const Industryprojects = await IndustryProjects.findAll({
        where:{
            title:title
        }
    });
      if (Industryprojects.length > 0) {
        return res.status(404).json({ error: 'Project with this title is already proposed. Kindly confirm from your organization' });
      }
  
  
      
    const IndustryProject = await IndustryProjects.create({ title, description,"companyname": companyName, email});
    const students = await Users.findAll({
        attributes: ['email'],
        where: {
          role: {[Op.or]: ['student']}
        }
        
      });
  
      for (const user of students) {
        await Notifications.create({
          email: user.email,
          text: `Project from Company:  ${companyName}`,
          route: '/industryprojects'
        });
      }
      
  
      res.status(201).json(IndustryProject);
     
    } catch (error) {
        
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  
router.get('/',authentication, async (req, res) => {
    try {
      const Industryprojects = await IndustryProjects.findAll({
        order: [['createdAt', 'DESC']] // Assuming 'createdAt' is the timestamp field
      });
      if (Industryprojects.length === 0) {
        return res.status(404).json({ error: 'No Industry project found' });
      }
      
      return res.json(Industryprojects);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;
