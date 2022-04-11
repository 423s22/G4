import AppState from "./AppState";
import NavBar from "./NavBar";
import AppStateType from "./AppStateType";
import DashboardState from "./DashboardState";
import ProductState from "./ProductState";
import HelpState from "./HelpState";
import SettingState from "./SettingState";
import DatabaseConnection from "./BTSDatabase/DatabaseConnection";

export default class App {
    constructor() {
        console.log("constructed");

        this._allStates = new Map();

        // Create states
        this._allStates.set(AppStateType.DashboardState, new DashboardState(this));
        this._allStates.set(AppStateType.ProductState, new ProductState(this));
        this._allStates.set(AppStateType.HelpState, new HelpState(this));
        this._allStates.set(AppStateType.SettingState, new SettingState(this));

        this._state = this._allStates.get(AppStateType.DashboardState); // This will run the AppState class that will contain
        this._running = false;

        this._dbConn = new DatabaseConnection(1);
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

    isRunning() {
        return this._running;
    }

    setState(stateType) {
        let oldState = this._state;
        oldState.onDisable();

        let newState = this._allStates.get(stateType);
        this._state = newState;
        newState.onEnable();

        newState.onRender("stateDiv");
    }

    getDatabaseConnection() {
        return this._dbConn;
    }

    // TODO: Add in call to database

    //TODO: Add in the call to products as a list
}
// TODO: Implement