const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON
app.use(express.json());
const map = {};

function getAllUser(id) {
    return Array.from(io.sockets.adapter.rooms.get(id) || []).map((socket_id) => {
        return {
            socket_id,
            username: map[socket_id],
        };
    });

}
// new changes 
app.use(express.static('build'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on(ACTIONS.JOIN, ({ id, username }) => {
        map[socket.id] = username;
        socket.join(id);
        console.log(id);

        const client = getAllUser(id);
        client.forEach(({ socket_id }) => {
            io.to(socket_id).emit(ACTIONS.JOINED, {
                client,
                username,
                socket_id: socket.id,
            })
        })
    });
    socket.on(ACTIONS.CHANGE, ({ id, code }) => {
        console.log("I am emiting the change to users ");
        io.to(id).emit(ACTIONS.CHANGE, { value: code });
    });
    socket.on(ACTIONS.SYNC, ({ socket_id, code }) => {
        console.log("SYNC request recieved ", code);
        io.to(socket_id).emit(ACTIONS.CHANGE, { value: code });
    });
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((id) => {
            socket.in(id).emit(ACTIONS.DISCONNECTED, {
                socket_id: socket.id,
                username: map[socket.id],
            })
        })
        delete map[socket.id];
        socket.leave();
    })

});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});