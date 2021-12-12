import { LoadingBar } from "../utils/LoadingBar";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key: "preload-scene"});
    }

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        new LoadingBar(this);

        // load images as a tileset
        this.load.spritesheet("tileset", "assets/img/tileset.png", { frameWidth: 64, frameHeight: 64 });
        // set json file to connect with a tileset
        this.load.tilemapTiledJSON("tilemap", "assets/img/tilemap.json");
        // load object-images
        this.load.atlas("objects", "assets/img/objects.png", "assets/img/objects.json");
    }

    protected create(): void {
        this.scene.start("start-scene");
    }
}