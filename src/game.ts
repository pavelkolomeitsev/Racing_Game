import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";
import PreloadScene from "./scenes/PreloadScene";
import StartScene from "./scenes/StartScene";

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 1280,
    height: 720,
    scene: [
        new BootScene(),
        new PreloadScene(),
        new StartScene(),
        new GameScene()
    ],
    scale: {
        mode: Phaser.Scale.FIT, // auto scaling of all sprites
        autoCenter: Phaser.Scale.CENTER_BOTH // canvas centering in the center of the screen
    },
    physics: {
        default: "matter",
        matter: {
            debug: false,
            gravity: {x: 0, y: 0}
        }
    }
};

const game = new Phaser.Game(config);