// Ejemplo básico de servidor de señalización con Node.js y Socket.IO
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Usuario conectado', socket.id);

    // Reenviar la oferta y respuesta entre peers
    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    // Reenviar los ICE candidates
    socket.on('candidate', (data) => {
        socket.broadcast.emit('candidate', data);
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor de señalización corriendo en puerto ${PORT}`));
