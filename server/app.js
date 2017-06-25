const express = require('express');
const bodyParser = require('body-parser');
const messageHandlers = require("./utils/ws-message-handlers");
const http = require('http');
const wss = require('./utils/websocket_server');

const app = express();

app.use(bodyParser.json());
app.use((req, res) => res.json({ status: 'running'}));

const server = http.createServer(app);
const chatSocket = new wss.ChatSocketServer(server, messageHandlers);
chatSocket.start();

server.listen(process.env.PORT || 3000, function listening() {
	console.log(`Listening on port ${server.address().port}`);
});

module.exports = chatSocket;
