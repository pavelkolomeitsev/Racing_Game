export default class Stats {
    public laps: number; // the whole amount of laps, need to display!
    public lap: number; // current lap, need to display!
    public time: number; // the whole time, need to display!
    public timeCurrentLap: number; // need to display!
    public timeBestLap: number; // need to display!
    private _timeLastLap: number;

    constructor(laps: number) {
        this.laps = laps;
        this.lap = 1;
        this.time = 0;
        this.timeCurrentLap = 0;
        this.timeBestLap = 0;
        this._timeLastLap = 0;
    }

    public get complete(): boolean {
        return this.lap > this.laps;
    }
    
    public onLapComlete(): void {
        ++this.lap;
        if (this.timeBestLap === 0 || this.timeCurrentLap < this.timeBestLap) {
            this.timeBestLap = this.timeCurrentLap;
        }
        this._timeLastLap = this.timeCurrentLap;
        this.timeCurrentLap = 0;
    }

    public update(delta: number): void {
        if (!this.complete) {
            const seconds: number = delta / 1000;
            this.time += seconds;
            this.timeCurrentLap += seconds;
        }
    }
}