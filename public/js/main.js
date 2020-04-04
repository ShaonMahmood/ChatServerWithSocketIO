const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users');


// get username and room name
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();


// join the room
socket.emit('joinroom', {username, room});

// get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoom(room);
    outputUsers(users);
})


// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// form submit listener
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    // emit a msg to server
    socket.emit('chatMessage', msg);
    
    // clear the input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});