import Map from "../classes/Map";
import Player from "../classes/Player";
import Stats from "../classes/Stats";
import StatsPanel from "../classes/StatsPanel";
import StatsPopup from "../classes/StatsPopup";
import { AMOUNT_OF_LAPS } from "../utils/utils";

export default class GameScene extends Phaser.Scene {
    private _map: Map;
    private _player: Player;
    private _stats: Stats;
    private _statsPanel: StatsPanel;
    private _statsPopup: StatsPopup;

    constructor() {
        super({key: "game-scene"});
    }

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
    }

    protected create(): void {
        this._map = new Map(this);
        this._player = new Player(this, this._map);
        this._stats = new Stats(AMOUNT_OF_LAPS);
        this._statsPanel = new StatsPanel(this, this._stats);
        this._statsPopup = new StatsPopup(this, this._stats);

        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player.car); // set camera to center on the player`s car

        // we listen to event with the key "lap"
        // method 'this.onLapComplete' needs argument 'laps' -> we pass it in 'Player.onCheckpoint()'
        this._player.car.on("lap", this.onLapComplete, this);

        // first param "collisionactive" -> see docs (Events -> Phaser.Physics.Matter.Events.COLLISION_ACTIVE)
        this.matter.world.on("collisionactive", (
            event,
            oilObj, // static sensor object
            carObj // player`s object
        ) => {                                            // here is deep checking (type and reference)
            if (oilObj.gameObject.frame.name === "oil" && carObj.gameObject === this._player.car) {
                this._player.slide();
            }
        });
    }

    private onLapComplete(laps: number): void {
        this._stats.onLapComlete();
        // if the player runs more than three laps -> restart the main scene (new game!)
        if (this._stats.complete) {
            this._statsPopup.showPopup();
        }
    }

    // see docs -> Scene.Methods
    update(time: number, delta: number): void {
        this._stats.update(delta);
        this._player.move();
        this._statsPanel.render();
    }
}