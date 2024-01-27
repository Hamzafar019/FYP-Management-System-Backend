const express = require('express');

const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
app.use(express.json());
const db = require('./db');


app.use('/user', require('./routes/userRoutes'));
app.use('/announcement', require('./routes/announcementRoutes'));
app.use('/FYP_idea', require('./routes/FYP_ideaRoutes'));
app.use('/FYPregistration', require('./routes/FYPregistrationRoutes'));
app.use('/all_FYP', require('./routes/all_FYPRoutes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

