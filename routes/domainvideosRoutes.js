const express = require('express');
const router = express.Router();
const Video = require('../models/domainvideos');
const Users = require('../models/users');
const upload = require('../middleware/FYPrelatedvideos');
const supervisorauthentication = require('../middleware/supervisorauthentication');
const supervisorandstudentauthentication = require('../middleware/supervisorandstudentauthentication');
const Notifications = require(`../models/notifications.js`);
const FYPregister = require(`../models/fyp_registrations.js`);
const fs=require('fs')
const { Op } = require('sequelize');


router.post('/FYPrelatedData', supervisorauthentication, upload.single('videoFile'), async (req, res) => {
  try {

    if (!req.file) {
      console.log("No video file uploaded");
    }

    // Process form data and save to the database
    const { domainname, title, videoLink } = req.body;
    const videoPath = req.file ? req.file.path : null;  // Multer middleware saves uploaded file path to req.file.path

    const video = await Video.create({
        domainname,
      title,
      videoPath,
      videoLink,
    });



    const students = await Users.findAll({
        attributes: ['email'],
        where: {
          role: {[Op.or]: ['student']}
        }
        
      });

      for (const user of students) {
        await Notifications.create({
          email: user.email,
          text: `New Video Uploaded for "${domainname}" domain`,
          route: '/student/viewdomainvideos'
        });}

    res.status(201).json({ message: "Video submitted successfully", video });
  } catch (error) {
    console.error("Error submitting video:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



router.get('/FYPrelatedData', supervisorandstudentauthentication, async (req, res) => {
  try {
    let videos;
    if(req.query.domainname){
      const domainname=req.query.domainname
      console.log("shit\n\n\n\n")
      console.log(domainname)

      videos = await Video.findAll({ where: { domainname: domainname } });

        if (!videos || videos.length === 0) {
          return res.status(404).json({ message: "No videos found for the specified Domain Name" });
        }


    }
    
    res.send({ videos });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get('/videos',function(req,res){
  
  const videoPath = req.query.param1;
  const range=req.headers.range;
  if(!range){
      res.status(400).send("Requires Range HEader")
  }
  const videoSize= fs.statSync(videoPath).size;
  const CHUNCK_SIZE=10**6;
  const start=Number(range.replace(/\D/g,""))
  const end=Math.min(start+CHUNCK_SIZE,videoSize-1);
  const contentLength=end-start+1
  const headers={
      "Content-Range":`bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges":"bytes",
      "Content-Length":contentLength,
      "Content-Type":"video/mp4"
  }
  res.writeHead(206,headers)
  const videoStream=fs.createReadStream(videoPath,{start,end})
  videoStream.pipe(res)
  
});



module.exports = router;
