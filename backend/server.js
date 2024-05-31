const express = require('express')
const app = express();
const http = require('http')

const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send("HEY")
})

server.listen(9000, () => {
    console.log("Listening at port 5000");
})