const PORT = 8080;
const DOCROOT = "./../dist";

const http = require("http");
const path = require("path");
const express = require("express");
const sockets = require("./sockets");

// create server
const app = express();
const server = http.createServer(app);

// upload game resources to the client
const documentRoot = path.join(__dirname, DOCROOT); // absolute path
const staticContent = express.static(documentRoot); // game resources
app.use(staticContent);

// initialize sockets
sockets.init(server);

// run server
server.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
});