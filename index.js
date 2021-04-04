const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http);
app.get('/', (req, res) => {
    res.send("Node server is running. YAAY!")
})

// http.listen(8080)

io.on('connection', socket => {
    chatID = socket.handshake.query.chatID
    socket.join(chatID)
    socket.on('disconnect', () => {
        socket.leave(chatID)
    })
    socket.on('send_message', message => {
        receiverChatID = message.receiverChatID
        senderChatID = message.senderChatID
        content = message.content

        socket.in(receiverChatID).emit('receive_message', {
            'content': content,
            'senderChatID': senderChatID,
            'receiverChatID': receiverChatID
        })
    })
});

const socketio = require('socket.io')(http)

socketio.on("connection", (userSocket) => {
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message",data)
    })
})

http.listen(process.env.PORT)
