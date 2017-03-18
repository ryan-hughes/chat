window.onload = function() {

    var messages = [];
    var socket = io();
    var field = document.getElementById("msgInput");
    var sendButton = document.getElementById("btnSend");
    var content = document.getElementById("messages");

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text });
        field.value = "";
        field.focus();
    };

}