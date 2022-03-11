import BetaState from "./BetaState";

export default class App {
    constructor() {
        console.log("constructed");
        this._state = new BetaState(this);
        this._state.onEnable();
    }

    start() {
        console.log("Started!");
        this._state.onRender("appDiv");
    }
}
// TODO: Implement