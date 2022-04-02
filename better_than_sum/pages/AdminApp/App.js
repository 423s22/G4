import AppState from "./AppState";
import navBar from "./navBar";
import Product from "./Product";

export default class App {
  constructor() {
    console.log("constructed");
    this._state = new AppState(this); // This will run the AppState class that will contain
    //this._allStates = Map<AppStateType, _state>;
    this._state.onEnable();
    this._running = false;
  }

  // TODO: Create setState() - Change state of app

  start() {
    this._running = true;
    this._navBar = new navBar();
    this._navBar.createNavigationBar();
    this._state.onRender("appDiv");
  }

  isRunning() {
    return this._running;
  }

  // TODO: Add in call to database

  //TODO: Add in the call to products as a list
}
// TODO: Implement
