const express = require("express");
const router = express.Router();
const FYP_Registrations = require(`../models/fyp_registrations.js`);
const { Op } = require("sequelize");
const supervisorauthentication = require("../middleware/supervisorauthentication.js");

router.get("/mygroups", supervisorauthentication, (req, res) => {
  const supervisorEmail = req.email;

  // Query the FYP_registrations table where supervisor_email matches the provided email
  FYP_Registrations.findAll({
    where: {
      supervisor: supervisorEmail,
    },
  })
    .then((results) => {
      // Handle the query results here
      res.json(results);
    })
    .catch((error) => {
      // Handle any errors that occur during the query
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
