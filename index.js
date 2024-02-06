const express = require('express');

const cors = require('cors');

const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
app.use(cors());
const port = process.env.PORT || 3001;
app.use(express.json());
const db = require('./db');
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
console.log("f")

module.exports =  io

app.use('/user', require('./routes/userRoutes'));
app.use('/announcement', require('./routes/announcementRoutes'));
app.use('/FYP_idea', require('./routes/FYP_ideaRoutes'));
app.use('/FYPregistration', require('./routes/FYPregistrationRoutes'));
app.use('/all_FYP', require('./routes/all_FYP_and_rejected_FYPRoutes'));
app.use('/groups', require('./routes/FYPgroups'));
app.use('/data', require('./routes/FYP_dataRoutes'));
app.use('/submission', require('./routes/submissionRoutes'));
app.use('/groupsubmission', require('./routes/groupsubmissionRoutes'));
app.use('/meetings', require('./routes/meetingRoutes'));
app.use('/report', require('./routes/reportgenerationRoutes'));
app.use('/notifications', require('./routes/notificationsRoutes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
