import AppState from "./AppState";
export default class ProductState extends AppState {
  constructor(app) {
    super(app);
  }

  onEnable() {}

  onDisable() {}

  onRender(divID) {
    // Temporary for testing db conn
    let dbConn = this._app.getDatabaseConnection();

    let div = document.getElementById(divID);
    div.innerHTML = "";
    div.innerHTML = "<h1>Products!</h1>";

    dbConn.getUserProducts(1).then((products) => {
      products[0].setName("Updated via code");
      products[0].save();
    });
  }
}
