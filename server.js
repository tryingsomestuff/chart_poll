const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let points = []; 
const clientPoints = {}; 

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('New user connected');
    clientPoints[socket.id] = [];
    socket.emit('updatePoints', points);

    socket.on('newPoint', (point) => {
        if (clientPoints[socket.id].length === 0) {
            clientPoints[socket.id].push(point);
            points.push(point);
            io.emit('updatePoints', points);
        } 
        else {
            const index = points.indexOf(clientPoints[socket.id][0]);
            if (index !== -1) {
                points[index] = point;
            }
            clientPoints[socket.id][0] = point;
            io.emit('updatePoints', points);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Started on http://localhost:3000');
});
