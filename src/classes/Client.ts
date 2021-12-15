import io from "socket.io-client";
import { HOST } from "../utils/utils";

export default class Client extends Phaser.Events.EventEmitter {

    public _isFirst: boolean = false;

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
        socket.on("game-start", (data: any) => {
            if (data && data.first) {
                this._isFirst = data.first; // make this player first (red car)
            }
            this.emit("game"); // it invokes an event with the key "game" in the "StartScene"
        });
    }
}