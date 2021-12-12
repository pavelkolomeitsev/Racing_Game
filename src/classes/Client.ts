import io from "socket.io-client";

const HOST: string = "http://localhost:8080";

export default class Client extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }

    init(): void {
        // we ask server to connect to it
        const socket = io(HOST);
        socket.on("connect", () => {
            console.log("Client connected");
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
        // socket object listens to self-emitted event "game-start" and run the callback
        socket.on("game-start", () => {
            this.emit("game"); // it invokes an event with the key "game"
        });
    }
}