import Checkpoint, { GRASS_FRICTION, ROADS_FRICTION } from "../utils/utils";

export default class Map {
    private _scene: Phaser.Scene;
    private _tileset: Phaser.Tilemaps.Tileset;
    public chekpoints: Checkpoint[] = [];
    public tilemap: Phaser.Tilemaps.Tilemap;

    constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this.init();
        this.create();
    }

    init(): void {
        // create a tilemap object
        this.tilemap = this._scene.make.tilemap({ key: "tilemap" });
        // add images to tilemap
        this._tileset = this.tilemap.addTilesetImage("tileset", "tileset", 64, 64, 0, 1);
    }

    create(): void {
        this.createLayers();
        this.createCollisions();
        this.createArrows();
        this.createOils();
        this.createChekpoints();
    }
    
    createLayers(): void {
        // create 4 layers
        this.tilemap.createLayer("grass", this._tileset);
        this.tilemap.createLayer("road", this._tileset);
        this.tilemap.createLayer("ground", this._tileset);
        this.tilemap.createLayer("sand", this._tileset);
    }

    createCollisions(): void {
        // first param - name of object`s layer in tilemap
        // second param - callback function, which called for every image in tileset
        this.tilemap.findObject("collisions", collisionObject => {
            // with the help of 'matter' engine we add every image to the scene

            // we have to cast implicitly
            // collisionObject - GameObject, but we need Sprite!
            const castedObject = collisionObject as Phaser.Physics.Matter.Sprite;
            const sprite: Phaser.Physics.Matter.Sprite = this._scene.matter.add.sprite(
                castedObject.x + castedObject.width / 2, // with the help of this trick
                castedObject.y - castedObject.height / 2, // we fixed incorrect displacement (смещение) of sprites on the map
                "objects", // key from 'PreloadScene -> this.load.atlas("objects"...'
                collisionObject.name // it`s to distinct each item in objects image collection
            );
            sprite.setStatic(true); // make the sprite static physical object
        });
    }

    createChekpoints(): void {
        // get all game objects with name "checkpoint"
        const array: Phaser.Types.Tilemaps.TiledObject[] = this.tilemap.filterObjects("checkpoints", checkpoint => checkpoint.name === "checkpoint");
        // fill this._chekpoints-array with rectangle objects
        array.forEach((item: Phaser.Types.Tilemaps.TiledObject) => {
            const rectangle: Checkpoint = new Checkpoint(item.x, item.y, item.width, item.height);
            rectangle.index = item.properties.find((prop: Phaser.Types.Tilemaps.TiledObject) => prop.name === "value").value;
            this.chekpoints.push(rectangle);
        });
    }

    createArrows(): void {
        // this.tilemap.findObject("arrows", arrowObject => {
        //     const castedObject = arrowObject as Phaser.Physics.Matter.Sprite;
        //     const sprite: Phaser.Physics.Matter.Sprite = this._scene.matter.add.sprite(
        //         castedObject.x + castedObject.width / 2,
        //         castedObject.y - castedObject.height / 2,
        //         "objects",
        //         arrowObject.name
        //     );
        //     sprite.rotation = -Math.PI / 2;
        //     sprite.setStatic(true);
        //     sprite.setSensor(true);
        // });
    }

    createOils(): void {
        this.tilemap.findObject("oils", oilObject => {
            const castedObject = oilObject as Phaser.Physics.Matter.Sprite;
            const sprite: Phaser.Physics.Matter.Sprite = this._scene.matter.add.sprite(
                castedObject.x + castedObject.width / 2,
                castedObject.y - castedObject.height / 2,
                "objects",
                oilObject.name
            );
            sprite.setStatic(true);
            sprite.setSensor(true); // the sprite listens to collision events, but doesn't react with colliding object physically
        });
    }

    getPlayer(): Phaser.Types.Tilemaps.TiledObject {
        // find a player object in tilemap
        return this.tilemap.findObject("player", playerObject => playerObject.name === "player");
    }

    getTileFriction(car: Phaser.Physics.Matter.Sprite): number {
        for (const roadType in ROADS_FRICTION) {
            // match different road`s types where the car is running now
            // if it`s in ROADS_FRICTION, return appropriate road`s type
            // important!!! road`s types have to match exactly with layers` names in the map
            const tile: Phaser.Tilemaps.Tile = this.tilemap.getTileAtWorldXY(car.x, car.y, false, this._scene.cameras.main, roadType);
            if (tile) return ROADS_FRICTION[roadType];
        }
        
        // if it`s not -> return GRASS_FRICTION
        return GRASS_FRICTION;
    }

    getCheckpoint(car: Phaser.Physics.Matter.Sprite): number | boolean {
        const checkpoint = this.chekpoints.find(item => item.contains(car.x, car.y));
        // check if the car is in the exact checkpoint or car isn`t in the checkpoint area
        return checkpoint ? Number.parseInt(checkpoint.index) : false;
    }
}