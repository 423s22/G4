import AppState from "./AppState";
import NavBar from "./NavBar";
import AppStateType from "./AppStateType";
import DashboardState from "./DashboardState";
import ProductState from "./ProductState";
import HelpState from "./HelpState";
import DatabaseConnection from "./BTSDatabase/DatabaseConnection";
import ShopifyApiConnection from "./ShopifyAPI/ShopifyAPIConnection";

export default class App {
  constructor() {

    this._allStates = new Map();

    // Create states
    this._allStates.set(AppStateType.DashboardState, new DashboardState(this));
    this._allStates.set(AppStateType.ProductState, new ProductState(this));
    this._allStates.set(AppStateType.HelpState, new HelpState(this));

    this._state = this._allStates.get(AppStateType.DashboardState); // This will run the AppState class that will contain
    this._running = false;

    let windowURL = new URL(window.location.href);
    this._dbConn = new DatabaseConnection(windowURL.searchParams.get("btsID"));
    this._apiConn = new ShopifyApiConnection(windowURL.searchParams.get("shop"));

    this._apiConn.getProductsJSON().then((response) => {
      console.log(response);
    });

  }

  // TODO: Create setState() - Change state of    app

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

  setState(stateType) {
    let oldState = this._state;
    oldState.onDisable();
  }

  isRunning() {
    return this._running;
  }

  setState(stateType) {
    let oldState = this._state;
    oldState.onDisable("stateDiv");

    let newState = this._allStates.get(stateType);
    this._state = newState;
    newState.onEnable();

    newState.onRender("stateDiv");
  }

  getDatabaseConnection() {
    return this._dbConn;
  }
}
