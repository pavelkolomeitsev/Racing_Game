import Client from "../classes/Client";

export default class StartScene extends Phaser.Scene {
    private _onePlayerTextButton: Phaser.GameObjects.Text;
    private _twoPlayersTextButton: Phaser.GameObjects.Text;
    private _style: Phaser.Types.GameObjects.Text.TextStyle;
    private _client: Client;

    constructor() {
        super({ key: "start-scene" });
        this._style = { fontFamily: "CurseCasual", fontSize: "55px", color: "#ECE00C", stroke: "#000000", strokeThickness: 3, };
    }

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
    }

    protected create(): void {
        this.createButtonContainer(250, 330);
        this._onePlayerTextButton = this.createText(266, 347, "ONE PLAYER");
        this._onePlayerTextButton.setInteractive({ useHandCursor: true });
        this._onePlayerTextButton.once("pointerdown", () => {
            this.scene.start("game-scene");
        });

        this.createButtonContainer(750, 330, 300);
        this._twoPlayersTextButton = this.createText(770, 347, "TWO PLAYERS");
        this._twoPlayersTextButton.setInteractive({ useHandCursor: true });
        this._twoPlayersTextButton.once("pointerdown", () => this.requestGame());
    }

    private createButtonContainer(positionX: number, positionY: number, width: number = 250, height: number = 100, corner: number = 16): void {
        this.add.graphics()
            .fillStyle(0x49BE25)
            .fillRoundedRect(positionX, positionY, width, height, corner);
    }

    private createText(positionX: number, positionY: number, text: string): Phaser.GameObjects.Text {
        return this.add.text(positionX, positionY, text, this._style).setOrigin(0);
    }

    private requestGame(): void {
        // create connection to the server
        this._client = new Client();
        // make request to the server
        this._client.init();
        // listen to event with the key "game"
        this._client.on("game", () => {
            this.scene.start("game-scene", {player: this._client}); // run the game (GameScene) and pass client-object
         });
    }
}