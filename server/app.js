const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

const port = 4000;

app.use(cors());
app.options('*', cors());

//  HTTP Server and Socket.io
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'], // URL Frontend
    },
});

app.set('io', io);

// Logic Socket.io
io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData.id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
    });

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users && !chat.admins) return console.log('chat.users or chat.admins not defined');

        const allParticipants = [...(chat.users || []), ...(chat.admins || [])];

        allParticipants.forEach((user) => {
            if (user._id == newMessageReceived.senderUser?._id || user._id == newMessageReceived.senderAdmin?._id)
                return;

            socket.in(user._id).emit('message received', newMessageReceived);
        });
    });

    socket.off('setup', () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData.id);
    });
});

// Connect to DB
const db = require('./config/db');
db.connect();

app.use(bodyParser.json());

const route = require('./routes');
route(app);

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
