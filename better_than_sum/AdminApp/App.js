import AppState from "./AppState";
import AppStateType from "./AppStateType";
import NavBar from "./NavBar";
import DashboardState from "./DashboardState";
import ProductState from "./ProductState";
import HelpState from "./HelpState";
import DatabaseConnection from "./BTSDatabase/DatabaseConnection";
import ShopifyApiConnection from "./ShopifyAPI/ShopifyAPIConnection";
import EditProductState from "./EditProductState";

/**
 * Represents the BTS app controller
 */
export default class App {
	constructor() {

		this._allStates = new Map();

		// Create states
		this._allStates.set(AppStateType.DashboardState, new DashboardState(this));
		this._allStates.set(AppStateType.ProductState, new ProductState(this));
		this._allStates.set(AppStateType.HelpState, new HelpState(this));
		this._allStates.set(AppStateType.EditProductState, new EditProductState(this));

		this._state = this._allStates.get(AppStateType.DashboardState); // This will run the AppState class that will contain
		this._running = false;

		let windowURL = new URL(window.location.href);

		this._shopName = windowURL.searchParams.get("shop");

		this._dbConn = new DatabaseConnection(this._shopName);
		this._apiConn = new ShopifyApiConnection(this._shopName);

	}

	/**
	 * Start the app
	 */
	start() {
		this._running = true;

		let appDiv = document.getElementById("appDiv");
		this._navBar = new NavBar();
		this._navBar.createNavigationBar(this);

		let stateDiv = document.createElement("div");

		appDiv.appendChild(stateDiv);
		stateDiv.id = "stateDiv";
		this._state.onRender("stateDiv");

		this._state.onEnable();
	}

	/**
	 * 
	 * @returns {boolean} if the app is running
	 */
	isRunning() {
		return this._running;
	}

	/**
	 * Sets the current state of the app
	 * @param {AppStateType} stateType the type of the state
	 */
	setState(stateType) {
		let oldState = this._state;
		oldState.onDisable("stateDiv");

		let newState = this._allStates.get(stateType);
		this._state = newState;
		newState.onEnable();

		newState.onRender("stateDiv");
	}

	/**
	 * 
	 * @returns {AppState} the current state of the app
	 */
	getState() {
		return this._state;
	}

	/**
	 * 
	 * @returns {DatabaseConnection}
	 */
	getDatabaseConnection() {
		return this._dbConn;
	}

	/**
	 * 
	 * @returns {ShopifyApiConnection}
	 */
	getShopifyAPIConnection() {
		return this._apiConn;
	}

	/**
	 * 
	 * @returns {string} the name of the shop
	 */
	getShopName() {
		return this._shopName;
	}

}
