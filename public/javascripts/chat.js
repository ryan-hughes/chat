window.onload = function() {

    var messages = [];
    var onlineUsers = [];
    var field = document.getElementById("msgInput");
    var sendButton = document.getElementById("btnSend");
    var content = document.getElementById("messages");
    var usersBox = document.getElementById("onlineUsers");
    var userName = document.getElementById("username").innerHTML;
    var socket = io();
    var timeZoneOffset = new Date().getTimezoneOffset();

    socket.emit('onlineUser', {user: userName});

    // When a message has been received, push it to our messages array and update the DOM
    socket.on('message', function (data) {
        if(data.message) {
            messages.push( {message: data.message, user: data.user, time: buildTimestamp()} );
            var html = '';
            for(var i=0; i<messages.length; i++) {
                // Doesn't display timestamp for 'connected' message...need to fix later
                if (i === 0) {
                    html += messages[i].user + ": " + messages[i].message + '<br />';
                } else {
                    html += "[" + messages[i].time + "] " + messages[i].user + ": " + messages[i].message + '<br />';
                }
            }
            content.innerHTML = html;
            updateScroll();
        } else {
            console.log("There is a problem:", data);
        }
    });

    // Online users list has been updated, update our UI
    socket.on("updateOnlineUsers", function(onlineUsersList) {
        if (onlineUsersList) {
            var html = '';
            for (var i=0; i<onlineUsersList.length; i++) {
                html += "<li>" + onlineUsersList[i] + "</li>";
            }
            usersBox.innerHTML = html;
        }
    });

    // When exiting the chat, let the server know
    window.onbeforeunload = exit;
    function exit() {
             socket.emit('disconnectUser', {user: userName});
    };

    btnLogout.onclick = function() {
        window.location.replace("/");
    };

    // When the send button has been pressed, get the text and send it to our server to be broadcasted
    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text , user: userName});
        field.value = "";
        field.focus();
    };

    // If enter is pressed, get the text and send to the server to be broadcasted
    document.getElementById('msgInput').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      var text = field.value;
        socket.emit('send', { message: text , user: userName});
        field.value = "";
        field.focus();
      return false;
    }
  }

  function buildTimestamp() {
    var date = new Date();
    var hours = (date.getHours() + 11) % 12 + 1;
    console.log(date.getHours());
    var minutes = ('0' + (date.getMinutes())).slice(-2);
    var amPM = "AM";

    if (date.getHours() >= 12) { amPM = "PM"; }

    return hours + ":" + minutes + " " + amPM;
  }

  var scrolled = false;
  function updateScroll(){
    if(!scrolled){
        var chatBox = document.getElementById("chatBox");
        chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  document.getElementById('chatBox').onwheel = function() {
    
  }
}