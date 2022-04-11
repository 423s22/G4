import AppState from "./AppState";
export default class ProductState extends AppState {
  constructor(app) {
    super(app);
  }

  onEnable() {}

  onDisable(divID) {
    let div = document.getElementById(divID);
  }

  onRender(divID) {
    let div = document.getElementById(divID);
    div.innerHTML = "";
    div.innerHTML = "<h1>Products!</h1>";

    // Temporary for testing db conn
    let dbConn = this._app.getDatabaseConnection();

    dbConn.getUserProducts(1);
  }
}
