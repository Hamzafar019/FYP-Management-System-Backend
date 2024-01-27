const express = require('express');
const router = express.Router();
const All_fyps = require(`../models/all_fyps.js`);
const { Op } = require('sequelize');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');

// Create announcement
router.post('/',coordinatorauthentication , async (req, res) => {
    try {
      const { title, description, semester, year } = req.body;
      const all_fyps = await All_fyps.create({ title, description, semester, year});

      
    res.status(201).json(all_fyps);
    //   res.json(announcement);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Handle unique constraint violation (duplicate entry)
            res.status(400).json({ error: 'Duplicate entry for title' });
          } else  if (error.name === 'SequelizeDatabaseError' && error.parent && error.parent.code === 'WARN_DATA_TRUNCATED') {
            // Handle data truncation error (e.g., value too long for ENUM)
            res.status(400).json({ error: 'Invalid value for semester column' });
          }else {
            // Handle other errors
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
  });
  
  


  // Read all announcements
  router.get('/', async (req, res) => {
    try {
      const all_fyps = await All_fyps.findAll();
      if (all_fyps.length === 0) {
        return res.status(404).json({ error: 'Till now there is no FYP Registered' });
      }
      
      return res.json(all_fyps);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  module.exports=router