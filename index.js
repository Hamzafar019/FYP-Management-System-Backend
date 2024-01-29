const express = require('express');

const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
app.use(express.json());
const db = require('./db');


const path = require('path');

// Define the directory where your videos are stored
const videosDirectory = path.join(__dirname,'FYP_data','FYP_related_videos','1706529142108-Flonnect_2024-01-29_177bcfd4-9420-4c98-9fbe-543d77e963d5.mp4');
console.log(videosDirectory)
// Serve the videos statically

app.use('/user', require('./routes/userRoutes'));
app.use('/announcement', require('./routes/announcementRoutes'));
app.use('/FYP_idea', require('./routes/FYP_ideaRoutes'));
app.use('/FYPregistration', require('./routes/FYPregistrationRoutes'));
app.use('/all_FYP', require('./routes/all_FYPRoutes'));
app.use('/groups', require('./routes/FYPgroups'));
app.use('/data', require('./routes/FYP_dataRoutes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

