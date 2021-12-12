import Stats from "./Stats";

export default class StatsPanel {
    private _scene: Phaser.Scene;
    private _stats: Stats;
    private _laps: Phaser.GameObjects.Text;
    private _time: Phaser.GameObjects.Text;
    private _currentTime: Phaser.GameObjects.Text;
    private _bestTime: Phaser.GameObjects.Text;
    private _style: Phaser.Types.GameObjects.Text.TextStyle;

    private _lapsText: string;
    private _timeText: string;
    private _currentTimeText: string;
    private _bestTimeText: string;

    constructor(scene: Phaser.Scene, stats: Stats) {
        this._scene = scene;
        this._stats = stats;
        this._style = { fontFamily: "CurseCasual", fontSize: "40px", color: "#E62B0D", stroke: "#000000", strokeThickness: 1, };
        this._lapsText = `Lap: ${this._stats.lap}/${this._stats.laps}`;
        this._timeText = this._stats.time.toFixed(2);
        this._currentTimeText = this._stats.timeCurrentLap.toFixed(2);
        this._bestTimeText = this._stats.timeBestLap.toFixed(2);

        this.create();
    }

    private create(): void {
        // text laps
        this._laps = this._scene.add.text(1100, 30, this._lapsText, this._style).setScrollFactor(0); // setScrollFactor(0)-method tip text element on the screen in static position
        // time
        this._time = this._scene.add.text(50, 650, `Time: ${this._timeText}`, this._style).setScrollFactor(0);
        // current time
        this._currentTime = this._scene.add.text(570, 650, `Lap time: ${this._currentTimeText}`, this._style).setScrollFactor(0);
        // best time
        this._bestTime = this._scene.add.text(1000, 650, `Best time: ${this._bestTimeText}`, this._style).setScrollFactor(0);
    }

    public render(): void {
        this._timeText = this._stats.time.toFixed(2);
        this._currentTimeText = this._stats.timeCurrentLap.toFixed(2);
        this._bestTimeText = this._stats.timeBestLap.toFixed(2);

        let lapText: string;
        if (this._stats.lap > this._stats.laps) {
            lapText = `Lap: ${this._stats.laps}/${this._stats.laps}`;
        } else {
            lapText = `Lap: ${this._stats.lap}/${this._stats.laps}`;
        }
        this._laps.setText(lapText);
        this._time.setText(`Time: ${this._timeText}`);
        this._currentTime.setText(`Lap time: ${this._currentTimeText}`);
        this._bestTime.setText(`Best time: ${this._bestTimeText}`);
    }
}