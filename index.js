const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
let io = require('socket.io');
const path = require('path');

// servidor
let app = express();
let server = http.createServer(app);

// configuraciones
app.use(express.static(path.join(__dirname, 'public')));
// variables de entorno
require('dotenv').config();
// cors
app.use(cors());
// uso de JSON
app.use(bodyParser.json());

// config database
require('./src/config/database');

// rutas
app.use('/api', require('./src/api'));

// configuracion servidor real-time
io = io.listen(server);
io.on('connection', (socket) => {

  // nueva orden, notificar a la tienda por parte del cliente
  socket.on('new-order-connected', (__connect) => {    
    socket.join(__connect);
  })
  socket.on('new-order', (__connect, payload) => {
    io.sockets.in(__connect).emit('new-order', __connect, payload);
  })

  // notificar al cliente que su orden esta en camino
  socket.on('order-on-the-way-connect', __connect => {
    socket.join(__connect);
  });
  socket.on('order-on-the-way', (__connect, payload) => {
    io.sockets.in(__connect).emit('order-on-the-way', __connect, payload);
  });

});

// server run
server.listen({ port: 5000, host: '192.168.88.101' }, () => console.log("server online.."));
//server.listen({ port: 5000 }, () => console.log("server online.."));

module.exports = server;