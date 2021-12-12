import Stats from "./Stats";

export default class StatsPopup {
    private _scene: Phaser.Scene;
    private _stats: Stats;
    private _style: Phaser.Types.GameObjects.Text.TextStyle;
    private _popupWidth: number;
    private _popupHeight: number;

    constructor(scene: Phaser.Scene, stats: Stats) {
        this._scene = scene;
        this._stats = stats;
        this._style = { fontFamily: "CurseCasual", fontSize: "55px", color: "#FFFFFF", stroke: "#000000", strokeThickness: 3, };
        this._popupWidth = 900;
        this._popupHeight = 600;
        // this._scene.sys.game.config.width -> screen width/height
    }

    public showPopup(): void {
        const allTime: string = this._stats.time.toFixed(2);
        const bestTime: string = this._stats.timeBestLap.toFixed(2);

        this._scene.add.graphics()
            .fillStyle(0x000000)
            .fillRoundedRect(180, 30, this._popupWidth, this._popupHeight, 16).setScrollFactor(0);
        this._scene.add.text(540, 200, "Game over!", this._style).setScrollFactor(0);
        this._scene.add.text(480, 260, `Whole time: ${allTime}`, this._style).setScrollFactor(0);
        this._scene.add.text(480, 320, `Best lap: ${bestTime}`, this._style).setScrollFactor(0);

        const tapText: Phaser.GameObjects.Text = this._scene.add.text(620, 400, "OK!", this._style).setScrollFactor(0);
        tapText.setInteractive({ useHandCursor: true });
        tapText.once("pointerdown", () => {
            this._scene.scene.start("start-scene");
        });
    }
}