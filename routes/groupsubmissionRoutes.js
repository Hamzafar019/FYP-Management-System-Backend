const express = require('express');
const router = express.Router();

const { Groupsubmissions, FileUploads } = require('../models/groupsubmission.js');
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
      
      console.log("shit")
    }
    else{
      console.log(submissionId,groupId)
    }

    // Extract file-related data
    const fileData = req.file.buffer;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    
    // Validate file extension
    const allowedExtensions = ['pptx', 'docx', 'pdf', 'cpp', 'py', 'ipynb'];
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    // Create new file upload associated with the group submission
    const newFileUpload = await FileUploads.create({
      groupsubmissionId: existingSubmission.id,
      fileData,
      fileExtension
    });

    res.status(201).json({ existingSubmission, newFileUpload });
  } catch (error) {
    console.error('Error creating group submission or uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
