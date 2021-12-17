import io from "socket.io-client";
import { HOST } from "../utils/utils";

export default class Client extends Phaser.Events.EventEmitter {

    private _socket;
    private _sentData = {};
    public _isFirst: boolean = false;

    constructor() {
        super();
        // we ask server to connect to it
        this._socket = io(HOST);
    }

    init(): void {
        this._socket.on("connect", () => {
            console.log("Client connected");
        });
        this._socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
        // socket object listens to self-emitted event "game-start" and run the callback
        this._socket.on("game-start", (data: any) => {
            if (data && data.first) {
                this._isFirst = data.first; // make this player first (red car)
            }
            this.emit("game"); // it invokes an event with the key "game" in the "StartScene"
        });
        // listens to event "player2-move", which another player`s socket triggered
        this._socket.on("player2-move", (data: any) => {
            // trigger event "data" and send car`s position
            this.emit("data", data);
        });
    }

    public send(carsPosition: any): void {
        // using this trick we avoid unnecessary socket`s request to the server
        if (JSON.stringify(carsPosition) !== JSON.stringify(this._sentData)) { // only if car`s position has been changed
            this._sentData = carsPosition;
            this._socket.emit("player-move", carsPosition);
        }
    }
}