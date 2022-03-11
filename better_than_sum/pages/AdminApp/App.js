import BetaState from "./BetaState";

export default class App {
    constructor() {
        console.log("constructed");
        this._state = new BetaState(this);
        this._state.onEnable();
        this._running = false;
    }

    start() {
        this._running = true;
        this._state.onRender("appDiv");
    }

    isRunning() {
        return this._running;
    }
}
// TODO: Implement