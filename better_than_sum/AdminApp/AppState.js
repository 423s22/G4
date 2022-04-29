import App from "./App";

export default class AppState {
  /**
   * Creates a new AppState with the specified app
   * @param {App} app
   */
  constructor(app) {
    this._app = app;
  }

  onEnable() {}

  onDisable() {}

  onRender(divID) {}
}
