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

    // Online users list has been updated, update our UI
    socket.on("updateOnlineUsers", function(onlineUsersList) {
        if (onlineUsersList) {
            var html = '';
            for (var i=0; i<onlineUsersList.length; i++) {
                html += onlineUsersList[i] + "<br />";
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