// output roomname to the DOM
function outputRoom(room){
    roomName.innerText = room;
}

// output room users to dom
function outputUsers(users){
    roomUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

// output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div);
}