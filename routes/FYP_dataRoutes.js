const express = require('express');
const router = express.Router();
const Video = require('../models/videos');
const upload = require('../middleware/FYPrelatedvideos');
const supervisorauthentication = require('../middleware/supervisorauthentication');

router.post('/FYPrelatedData', supervisorauthentication, upload.single('videoFile'), async (req, res) => {
  try {

    if (!req.file) {
      console.log("No video file uploaded");
    }

    // Process form data and save to the database
    const { groupId, title, videoLink } = req.body;
    const supervisorEmail=req.email;
    const videoPath = req.file ? req.file.path : null;  // Multer middleware saves uploaded file path to req.file.path

    const video = await Video.create({
      groupId,
      supervisorEmail,
      title,
      videoPath,
      videoLink,
    });

    res.status(201).json({ message: "Video submitted successfully", video });
  } catch (error) {
    console.error("Error submitting video:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
