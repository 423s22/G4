import App from "./App";

export default class AppState {
	/**
	 * Creates a new AppState with the specified app
	 * @param {App} app
	 */
	constructor(app) {
		this._app = app;
	}

	/**
	 * Called whenever the state is enabled
	 */
	onEnable() { }

	/**
	 * Called whenever the state is disabled
	 */
	onDisable() { }

	/**
	 * Called when the state should be rendered
	 * @param {string} divID the ID of the div to draw the state to 
	 */
	onRender(divID) { }
}