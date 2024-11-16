const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let points = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('New user conencted');
    socket.emit('updatePoints', points);

    socket.on('newPoint', (point) => {
        points.push(point);
        io.emit('updatePoints', points);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Started on http://localhost:3000');
});
