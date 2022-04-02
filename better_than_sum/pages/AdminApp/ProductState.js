import navBar from "./navBar";
export default class ProductState {
  start() {
    this._navBar = new navBar();
    this._navBar.createNavigationBar();
  }
}
