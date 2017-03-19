window.onload = function() {

    var messages = [];
    var onlineUsers = [];
    var field = document.getElementById("msgInput");
    var sendButton = document.getElementById("btnSend");
    var content = document.getElementById("messages");
    var usersBox = document.getElementById("onlineUsers");
    var userName = document.getElementById("username").innerHTML;
    var socket = io();

    socket.emit('onlineUser', {user: userName});

    // When a message has been received, push it to our messages array and update the DOM
    socket.on('message', function (data) {
        if(data.message) {
            messages.push( {message: data.message, user: data.user} );
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i].user + ": " + messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    // When a user has logged into chat, add them to the Online Users box
    socket.on('onlineUser', function(data) {
        if (data.user) {
            onlineUsers.push(data.user);
            var html = '';
            for (var i=0; i<onlineUsers.length; i++) {
                html += onlineUsers[i] + "<br />";
            }
            usersBox.innerHTML = html;
        }
    });

    // When a user has left the chat, remove them from onlineUsers
    socket.on('disconnectUser', function(data) {
        if (data.user) {
            var i = onlineUsers.indexOf(data.user);
            if (i !== -1) {
                onlineUsers.splice(i,1);
            }

            var html = '';
            for (var i=0; i<onlineUsers.length; i++) {
                html += onlineUsers[i] + "<br />";
            }
            usersBox.innerHTML = html;
        }
    });

    // When the send button has been pressed, get the text and send it to our server to be broadcasted
    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text , user: userName});
        field.value = "";
        field.focus();
    };

    btnLogout.onclick = function() {
        window.location.replace("/");
    };

    // When exiting the chat, let the server know
    window.onbeforeunload = exit;
    function exit() {
             socket.emit('disconnectUser', {user: userName});
    };
}