import navBar from "./navBar";
export default class HelpState {
  start() {
    this._running = true;
    this._navBar = new navBar();
    this._navBar.createNavigationBar();
    this._state.onRender("appDiv");
  }
}
