import AppState from "./AppState";
import Product from "./Product";

export default class App {
  constructor() {
    console.log("constructed");
    this._state = new AppState(this); // This will run the AppState class that will contain
    //this._allStates = Map<AppStateType, _state>;
    this._state.onEnable();
    this._running = false;
  }

  // TODO: Create setState() - Change state of app

  start() {
    this._running = true;
    // Created 2 divs, 1) navDiv = navBar &
    // 2) stateDiv - going to populate information
    // make sure to clear all childs of this in order to re-onRender()
    let appDiv = document.getElementById("appDiv");
    let navDiv = document.createElement("div");
    appDiv.appendChild(navDiv);
    navBar.id = "navDiv";

    let stateDiv = document.createElement("div");
    appDiv.appendChild(stateDiv);
    stateDiv.id = "stateDiv";

    // Adding the nav bar to

    navItem = document.createElement("li");
    navLink = document.createElement("a");

    // Set properties on anchor
    navLink.href = "DashboardState.js";
    navLink.innerHTML = "Dashboard";

    // add to div

    navDiv.appendChild(navItem);
    navDiv.appendChild(navLink);

    this._state.onRender("appDiv");
  }

  isRunning() {
    return this._running;
  }

  // TODO: Add in call to database

  //TODO: Add in the call to products as a list
}
// TODO: Implement
