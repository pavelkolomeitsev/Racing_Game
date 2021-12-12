const PORT = 8080;
const DOCROOT = "./../dist";

const http = require("http");
const path = require("path");
const express = require("express");
const socketIO = require("socket.io");

// create server
const app = express();
const server = http.createServer(app);

// upload game resources to the client
const documentRoot = path.join(__dirname, DOCROOT); // absolute path
const staticContent = express.static(documentRoot); // game resources
app.use(staticContent);

// run server
server.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
});

// listen to events in the server
const io = socketIO(server);
// when client makes request to the server, socket listens to it
io.on("connection", clientSocket => { // "socket" - client`s object, it comes from client to the server
    // server recieves socket object and makes it to emit an event "game-start"
    clientSocket.emit("game-start"); // "game-start" is the key by which the game runs
});