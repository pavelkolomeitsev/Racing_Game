import { SPEED, DIRECTIONS, TURNS, ACCELERATION, SLIDE_ANGLE } from "../utils/utils";
import Map from "./Map";

export default class Player {
    private _scene: Phaser.Scene;
    private _map: Map;
    private _cursor: Phaser.Types.Input.Keyboard.CursorKeys;
    private _velocity: number;
    private _checkpoint: number;
    // private _laps: number;
    public car: Phaser.Physics.Matter.Sprite;

    constructor(scene: Phaser.Scene, map: Map, config: any) {
        this._scene = scene;
        this._map = map;
        this._cursor = this._scene.input.keyboard.createCursorKeys(); // take control from keyboard, exactly up and down keys
        this._velocity = 0; // current car`s direction
        this._checkpoint = 0;
        // this._laps = 0;
        const player = this._map.getPlayer(config.position);
        this.car = this._scene.matter.add.sprite(player.x, player.y, "objects", config.sprite); // add sprite to the scene
        this.car.setFixedRotation(); // avoid the car`s spinning on its axis
    }

    // private get lap(): number {
    //     return this._laps + 1;
    // }
    
    private get direction(): number {
        let direction = DIRECTIONS.NONE;

        if (this._cursor.up.isDown) direction = DIRECTIONS.FORWARD;
        else if (this._cursor.down.isDown) direction = DIRECTIONS.BACKWARD;

        return direction;
    }

    // set the car`s speed
    private get velocity(): number {
        const carSpeed = Math.abs(this._velocity); // make the speed absolute, without negative meaning

        const maxSpeed = this.getMaxSpeed();

        // if the player clicks on the key Up or Down and
        // current car`s speed is less than max speed (10)
        // increase the car`s speed by multipling acceleration with direction, which can be negative or positive
        if (this.direction && carSpeed < maxSpeed) {
            this._velocity += ACCELERATION * this.direction;
        } else if ((this.direction && carSpeed > maxSpeed) || (!this.direction && carSpeed > 0)) { // if the player doesn`t click on the key Up or Down and
            this._velocity -= ACCELERATION * this._velocity; // current car`s speed is more than max speed (10) ->
            // decrease the car`s speed by multipling acceleration with previous direction, which can be negative or positive
        }
        return this._velocity;
    }

    private getMaxSpeed() {
        return SPEED * this._map.getTileFriction(this.car);
    }

    private get turn(): number {
        let turn = TURNS.NONE;

        if (this._cursor.right.isDown) turn = TURNS.RIGHT;
        else if (this._cursor.left.isDown) turn = TURNS.LEFT;

        return turn;
    }

    // set the car`s angle, when the car is turning to the right or to the left
    private get angle(): number {
        return this.car.angle + this.turn * SPEED / 2;
    }

    private getVelocityFromAngle(): Phaser.Math.Vector2{ // get sprite`s speed with account of sprite`s angle
        const vector2 = new Phaser.Math.Vector2();
        // vector2 дает нам правильное смещение картинки/спрайта по оси х/у
        // первый параметр - текущий угол картинки (по умолчанию 90 град. то есть вправо). Машинка смотрит вверх, поэтому нужно подправить угол
        // второй параметр - ускорение картинки (положительное/отрицатильное). То есть или вперед, или назад
        return vector2.setToPolar(this.car.rotation - Math.PI/2, this.velocity);
    }

    public move(): void {
        // the car is moving with account of turn`s angle
        this.car.setAngle(this.angle);

        const velocity = this.getVelocityFromAngle();
        this.car.setVelocity(velocity.x, velocity.y);
        this.checkPosition();
    }

    private checkPosition(): void {
        // returns "1", "2", "3", "4" or false
        const checkpoint: number | boolean = this._map.getCheckpoint(this.car);
        if (checkpoint) {
            this.onCheckpoint(checkpoint as number);
        }
    }

    private onCheckpoint(checkpoint: number) {
        // when one lap is finished
        if (checkpoint === 1 && this._checkpoint === this._map.chekpoints.length) {
            this._checkpoint = 1;
            // ++this._laps;            
            this.car.emit("lap"); // we trigger some event on the key "lap"
        } else if (checkpoint === this._checkpoint + 1) { // when the player is crossing one checkpoint
            ++this._checkpoint;
        }
    }

    public slide(): void {
        this.car.angle += SLIDE_ANGLE;
    }
}