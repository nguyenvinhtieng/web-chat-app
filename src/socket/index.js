var users = [];
function mySocket(io) {
    io.on("connection", function (socket) {
        socket.on("disconnect", function () {
            userLeave(socket.id);
            console.log("User out")
            console.log(users)
            io.emit("send-list-user-online", users)
        })
        socket.on('user-login', userid => {
            addUser(userid, socket.id)
            console.log("User in")
            console.log(users)
            io.emit("send-list-user-online", users)
        })
        socket.on('user-chat', data => {
            let index = getIndexUser(data.receiver)
            if (index !== -1) {
                io.to(users[index].id).emit('has-user-chat-me', data)
            }
        })
        socket.on('me-delete-chat', data => {
            let index = getIndexUser(data.user)
            if (index !== -1) {
                let newData = { ...data, iduser: users[getIndexUserFromIdSocket(socket.id)].userId }
                io.to(users[index].id).emit('user-delete-chat', newData)
            }
        })
        socket.on('user-typing', idUser => {
            let index = getIndexUser(idUser)
            if (index !== -1) {
                io.to(users[index].id).emit('user-prepare-chat-me', users[getIndexUserFromIdSocket(socket.id)].userId)
            }
        })
        socket.on('user-blur', idUser => {
            let index = getIndexUser(idUser)
            if (index !== -1) {
                io.to(users[index].id).emit('user-blur-chat-me', users[getIndexUserFromIdSocket(socket.id)].userId)
            }
        })
        socket.on('user-create-room', data => {
            io.emit('has-user-create-room', data)
            socket.broadcast.emit('notify-new-room-create', 'Has user just create room <b>' + data.name + '</b>');
        })
        socket.on('user-chat-to-room', data => {
            socket.broadcast.emit('has-user-chat-to-room', data)
        })
        socket.on('user-focus-input-chat-room', data => {
            socket.broadcast.emit('has-user-prepare-chat-to-room', data)
        })
        socket.on('user-blur-input-chat-room', data => {
            socket.broadcast.emit('has-user-blur-input-chat-room', data)
        })
        socket.on('user-create-account', data => {
            socket.broadcast.emit('has-user-create-account', data)
        })
    })
}

function addUser(id, idSocket) {
    users.push({ id: idSocket, userId: id })
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        users.splice(index, 1)[0];
    }
}

function getIndexUser(id) {
    return users.findIndex(user => user.userId === id)
}


function getIndexUserFromIdSocket(id) {
    return users.findIndex(user => user.id === id)
}

module.exports = mySocket;