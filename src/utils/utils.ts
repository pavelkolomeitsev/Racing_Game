export enum DIRECTIONS {
    NONE = 0,
    FORWARD = 1,
    BACKWARD = -1
};

export enum TURNS {
    NONE = 0,
    RIGHT = 1,
    LEFT = -1
};

export const HOST: string = "http://localhost:8080";
export const SPEED = 5;
export const ACCELERATION = 0.1;
export const AMOUNT_OF_LAPS = 3;
export const SLIDE_ANGLE = 10;

export const GRASS_FRICTION = 0.3;
export const ROADS_FRICTION = {
    road: 1,
    ground: 0.5,
    sand: 0.4
};

export const CARS = {
    RED: {
        sprite: "car_red_1",
        position: "player"
    },
    BLUE: {
        sprite: "car_blue_1",
        position: "enemy"
    }
};

export default class Checkpoint extends Phaser.Geom.Rectangle{
    public index: string;
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }
}