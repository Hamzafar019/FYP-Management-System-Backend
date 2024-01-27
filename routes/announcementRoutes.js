const express = require('express');
const router = express.Router();
const Announcement = require(`../models/announcements.js`);
const { Op } = require('sequelize');
const coordinatorauthentication = require('../middleware/coordinatorauthentication.js');

// Create announcement
router.post('/',coordinatorauthentication , async (req, res) => {
    try {
      const { title, content, target } = req.body;
      const announcement = await Announcement.create({ title, content, target });

      
    res.status(201).json(announcement);
    //   res.json(announcement);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Read all announcements
  router.get('/', coordinatorauthentication, async (req, res) => {
    try {
      const announcements = await Announcement.findAll();
      if (announcements.length === 0) {
        return res.status(404).json({ error: 'No announcements found for the specified destination' });
      }
      
      return res.json(announcements);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
 // Read announcements by destination
 router.get('/user', async (req, res) => {
    try {
      const { target } = req.query;
      const announcements = await Announcement.findAll({
        where: { [Op.or]: [
            { target },
            { target:"both" },
          ],},
      });
  
      if (announcements.length === 0) {
        return res.status(404).json({ error: 'No announcements found for the specified destination' });
      }
  
      res.json(announcements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Update announcement
  router.put('/update',coordinatorauthentication, async (req, res) => {
    try {
      const { id } = req.query;
      const { title, content, target } = req.body;
      const announcement = await Announcement.findByPk(id);
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
  
      announcement.title = title;
      announcement.content = content;
      announcement.target = target;
  
      await announcement.save();
  
      res.json(announcement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete announcement
  router.delete('/delete',coordinatorauthentication, async (req, res) => {
    try {
      const { id } = req.query;
      const announcement = await Announcement.findByPk(id);
  
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
  
      await announcement.destroy();
  
      res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports=router