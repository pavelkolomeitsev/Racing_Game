const socketIO = require("socket.io");

module.exports = {
    init(server) {
        this.sessions = [],
        // listen to events on the server
        this.io = socketIO(server);
        // when client makes request to the server, socket listens to it
        this.io.on("connection", clientSocket => { // "socket" - client`s object, it comes from client to the server
            // socket listens to event "player-move" and trigger onPlayerMove-method
            clientSocket.on("player-move", data => {
                this.onPlayerMove(clientSocket, data);
            });
            this.onConnection(clientSocket);
        });
    },
    onPlayerMove(socket, carsPosition) {
        // in this method we distinguish who is the first, who is the second
        //  -> the second player`s socket triggers event "player2-move" with opponent`s carPosition
        // find session sent by first or second player
        const session = this.sessions.find(session => session.playerOneSocket === socket || session.playerTwoSocket === socket);
        if (session) {
            const opponentSocket = session.playerOneSocket === socket ? session.playerTwoSocket : session.playerOneSocket;
            opponentSocket.emit("player2-move", carsPosition);
        }
    },
    onConnection(socket) {
        let session = this.getPendingSession(); // find session
        if (!session) { // if there isn`t any session -> create it 
            this.createPendingSession(socket);
        } else { // otherwise -> add the second player to this session and start the game
            session.playerTwoSocket = socket;
            this.startGame(session);
        }
    },
    // this method finds session with only one player -> player1 is waiting...
    getPendingSession() {
        return this.sessions.find(session => session.playerOneSocket && !session.playerTwoSocket);
    },
    createPendingSession(socket) {
        // take a socket from the first player
        const session = { playerOneSocket: socket, playerTwoSocket: null}; // create new session with one player (player1)
        this.sessions.push(session); // add this semifull session object to the sessions-array
    },
    startGame(session) {
        // server recieves socket object and makes it to emit an event "game-start"
        session.playerOneSocket.emit("game-start", {first: true}); // send by socket an object that player is first
        session.playerTwoSocket.emit("game-start"); // "game-start" is the key by which the game runs
    },
};