import navBar from "./navBar";
export default class DashboardState {
  start() {
    this._navBar = new navBar();
    this._navBar.createNavigationBar();
  }
}
