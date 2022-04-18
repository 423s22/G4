import App from "./App";

export default class AppState {
  /**
   *
   * @param {App} app
   */
  constructor(app) {
    this._app = app;
  }

  onEnable() {}

  onDisable() {}

  onRender(divID) {}
}
