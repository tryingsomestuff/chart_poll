const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let points = [];
const clientPointLimits = {};

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('New user connected');
    clientPointLimits[socket.id] = 0;
    socket.emit('updatePoints', points);

    socket.on('newPoint', (point) => {
        if (clientPointLimits[socket.id] < 3) {
            clientPointLimits[socket.id] += 1;
            points.push(point);
            io.emit('updatePoints', points);
        } else {
            socket.emit('error', 'You can only add up to 3 points.');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete clientPointLimits[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Started on http://localhost:3000');
});
