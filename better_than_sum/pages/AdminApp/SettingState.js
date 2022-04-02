import navBar from "./navBar";
export default class SettingState {
  start() {
    this._navBar = new navBar();
    this._navBar.createNavigationBar();
  }
}
