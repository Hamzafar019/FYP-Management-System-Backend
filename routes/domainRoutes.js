const express = require("express");
const router = express.Router();
const Domains = require(`../models/domains.js`);
const coordinatorauthentication = require("../middleware/coordinatorauthentication");

router.post("/", coordinatorauthentication, async (req, res) => {
  try {
    const { title } = req.body;

    const domains = await Domains.findAll({
      where: {
        domainname: title,
      },
    });
    if (domains.length > 0) {
      return res.status(404).json({ error: "Domain already entered" });
    }
    const newDomain = await Domains.create({ domainname: title });
    res.status(201).json(newDomain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const titles = await Domains.findAll();
    res.json(titles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/", async (req, res) => {
  try {
    const domainname = req.query.title;
    console.log(domainname);
    const { title } = req.body;
    console.log(title);
    const existingDomain = await Domains.findOne({ where: { domainname } });

    if (existingDomain) {
      // Update the record if it exists
      const updatedTitle = await existingDomain.update({ domainname: title });
    
      res.json(updatedTitle);
    } else {
      // Handle the case where the record does not exist
      console.log("Record not found.");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
