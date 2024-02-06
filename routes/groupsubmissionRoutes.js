const express = require('express');
const supervisorauthentication = require('../middleware/supervisorauthentication.js');
const supervisorandstudentauthentication = require('../middleware/supervisorandstudentauthentication.js');
const router = express.Router();
const Notifications = require(`../models/notifications.js`);
const FYPregister = require(`../models/fyp_registrations.js`);

const { Groupsubmissions, FileUploads } = require('../models/groupsubmission.js');
// const FYP_registrations = require('../models/fyp_registrations.js');
const multer = require('multer');
const upload = multer(); // Assuming multer is configured properly

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { submissionId, groupId } = req.body;
    
    // Check if submission with given submissionId and groupId already exists
    let existingSubmission = await Groupsubmissions.findOne({ 
      where: { 
        submissionId: submissionId, 
        groupId: groupId 
      } 
    });
    
    if (!existingSubmission) {
      // If submission does not exist, create a new one
      existingSubmission = await Groupsubmissions.create({
        submissionId,
        groupId
      });
      
    }
    else{
      console.log(submissionId,groupId)
    }

    // Extract file-related data
    const fileData = req.file.buffer;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const fileName = req.file.originalname;
    
    // Validate file extension
    const allowedExtensions = ['pptx', 'docx', 'pdf', 'cpp', 'py', 'ipynb'];
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    // Create new file upload associated with the group submission
    const newFileUpload = await FileUploads.create({
      groupsubmissionId: existingSubmission.id,
      fileName,
      fileData,
      fileExtension
    });




    const group = await FYPregister.findOne({
      attributes: ['supervisor'],
      where: {
        id: groupId
      }
      
    });

    await Notifications.create({
      email: group.supervisor,
      text: `Group: ${groupId} has uploaded a file for Submission id: ${submissionId}.`,
      route: '/supervisor/viewwork'
    });

    res.status(201).json({ existingSubmission, newFileUpload });
  } catch (error) {
    console.error('Error creating group submission or uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/view',supervisorandstudentauthentication,async(req,res)=>{
  try{
    
    const { submissionId, groupId } = req.query;
    
    const groupRegistration = await Groupsubmissions.findOne({ 
      where: { 
        submissionId: submissionId,
        groupId: groupId
       } });
       if (!groupRegistration) {
        return res.status(404).json({ error: 'No Submission' });
      }
      
      // Assuming groupsubmissionId is the id of the group submission
      const groupsubmissionId = groupRegistration.id;
      const supervisorMarks = groupRegistration.supervisorMarks; // Extracting supervisorMarks from groupRegistration

      // Find the file data based on groupsubmissionId
      let fileUploads = await FileUploads.findAll({ 
        where: { 
          groupsubmissionId: groupsubmissionId
        } 
      });
      // Ensure fileUploads is an array, even if only one record is found
      fileUploads = Array.isArray(fileUploads) ? fileUploads : [fileUploads];
  
      if (!fileUploads || fileUploads.length === 0) {
        return res.status(404).json({ error: 'No Submission' });
      }
      // Map fileData and fileExtension for each file upload
      const files = fileUploads.map(fileUpload => ({
        fileData: fileUpload.fileData, // Assuming fileData is a Buffer object with 'data' property
        fileExtension: fileUpload.fileExtension,
        fileName: fileUpload.fileName
      }));
      // Send the files array to the frontend
      res.status(200).json({ files, supervisorMarks  });
  }
  catch(error){

    console.error('Error creating group submission or uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});



router.put('/updatesupervisormarks', supervisorauthentication, async (req, res) => {
  try {
    const { submissionId, groupId } = req.query;
    const { supervisorMarks } = req.body;

    // Find the group submission to update
    const groupSubmission = await Groupsubmissions.findOne({
      where: {
        submissionId: submissionId,
        groupId: groupId
      }
    });

    if (!groupSubmission) {
      return res.status(404).json({ error: 'Group submission not found' });
    }





    
    const student = await FYPregister.findOne({
      attributes: ['student1','student2','student3'],
      where: {
        id: groupId
      }
      
    });

    await Notifications.create({
      email: student.student1,
      text: `You got ${supervisorMarks} marks out of 100 in submission: ${submissionId}`,
      route: '/student/viewwork'
    });
    await Notifications.create({
      email: student.student2,
      text: `You got ${supervisorMarks} marks out of 100 in submission: ${submissionId}`,
      route: '/student/viewwork'
    });

    if(student.student3){
    await Notifications.create({
      email: student.student3,
      text: `You got ${supervisorMarks} marks out of 100 in submission: ${submissionId}`,
      route: '/student/viewwork'
    });
}



    // Update the supervisorMarks
    await groupSubmission.update({ supervisorMarks: supervisorMarks });

    res.status(200).json({ message: 'Supervisor marks updated successfully' });
  } catch (error) {
    console.error('Error updating supervisor marks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

