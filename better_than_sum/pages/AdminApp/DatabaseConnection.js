import AppState from "./AppState";
// Todo: Add the connect to the database
// Todo: Modify the executeStatement function

export default class DatabaseConnection extends AppState {
  constructor(app) {
    super(app);
    this._productDiv = null;
    this._lastInserted = null;
  }

  connect() {}

  executeStatement(sql) {
    let req = new XMLHttpRequest();
    req.open("GET", sql);
    // This section of code needs to be rewritten, it was just taken from
    // the beta state...
    req.onload = () => {
      let responseJSON = JSON.parse(req.responseText);
      let innerHTML = "";
      for (let i = 0; i < responseJSON.length; i++) {
        let id = responseJSON[i]["productID"];
        let baseCost = responseJSON[i]["baseCost"];
        let name = responseJSON[i]["name"];
        innerHTML +=
          "<h1>Id: " +
          id +
          " | Name: " +
          name +
          " | Base Cost: " +
          baseCost +
          "</h1>";
      }
      this._productDiv.innerHTML = innerHTML;
    };
    req.send();
  }
}
