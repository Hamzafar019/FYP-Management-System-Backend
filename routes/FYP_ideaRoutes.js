const express = require('express');
const router = express.Router();
const FYP_ideas = require(`../models/fyp_ideas.js`);
const { Op } = require('sequelize');
const supervisorauthentication = require('../middleware/supervisorauthentication.js');


// Create fypidea
router.post('/',supervisorauthentication , async (req, res) => {
  try {
    const { title, description } = req.body;
    const fyp_idea = await FYP_ideas.create({ title, description});

    
  res.status(201).json(fyp_idea);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/', async (req, res) => {
    try {
      const fyp_idea = await FYP_ideas.findAll();
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