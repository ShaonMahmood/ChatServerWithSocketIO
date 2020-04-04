const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./utills/messages'); 
const {userJoinToUsersList, getCurrentUser, userLeave, getRoomUsers} = require('./utills/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server); 

const botName = 'ChatMania';

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// run when client connects
io.on('connection', socket => {

    // joining from client
    socket.on('joinroom', ({username, room}) => {
        const user = userJoinToUsersList(socket.id, username, room);
        socket.join(user.room);
        // Welcome current user, socket.emit emits only to the current client
        socket.emit('message', formatMessage(botName, 'Welcome to ChatMania!!'));

        // runs when a user connects, broadcast.emit emits to everyone except the current
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} connects to the chat`));

        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });


    });


    // listen for chat message
    socket.on('chatMessage', chatMessage => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, chatMessage));
    });

    // runs when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
