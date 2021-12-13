const socketIO = require("socket.io");

module.exports = {
    init(server) {
        this.sessions = [],
        // listen to events on the server
        this.io = socketIO(server);
        // when client makes request to the server, socket listens to it
        this.io.on("connection", clientSocket => { // "socket" - client`s object, it comes from client to the server
            this.onConnection(clientSocket);
        });
    },
    onConnection(socket) {
        console.log(`New player ${socket.id} is connected`);
        let session = this.getPendingSession(); // find session
        if (!session) { // if there isn`t any session -> create it 
            this.createPendingSession();
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
        const session = { playerOneSocket: socket, playerTwoSocket: null}; // create new session with one player (player1)
        this.sessions.push(session); // add this semifull session object to the sessions-array
    },
    startGame(session) {
        // server recieves socket object and makes it to emit an event "game-start"
        session.playerOneSocket.emit("game-start"); // "game-start" is the key by which the game runs
        session.playerTwoSocket.emit("game-start"); // "game-start" is the key by which the game runs
    }
};