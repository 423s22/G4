import AppState from "./AppState";

/**
 * Represents the state for the dashboard
 */
export default class DashboardState extends AppState {
  constructor(app) {
    super(app);
  }

  onEnable() {}

  onDisable() {}

  onRender(divID) {
    let div = document.getElementById(divID);
    div.innerHTML = "";
    // Header
    let dashdiv = document.createElement("div");
    dashdiv.id = "dashboard";
    let title = document.createElement("h1");
    title.innerHTML = "Welcome to Better than Sum!<br>";
    dashdiv.appendChild(title);

    // Link to github
    let link = document.createElement("a");
    link.href = "https://github.com/423s22/G4";
    link.innerHTML = "Current Code Base";
    let introLink = document.createElement("h2");
    introLink.appendChild(link);
    dashdiv.appendChild(introLink);

    // Creates our product #
    let productNum = document.createTextNode("product version 1.0.0-RC1");
    let introProd = document.createElement("h2");
    introProd.appendChild(productNum);
    dashdiv.appendChild(introProd);

    let welcome = document.createElement("h3");
    // Creates welcome text with the url shop name
    welcome.innerHTML = "Welcome, " + this._app.getShopName() + "!";
    dashdiv.appendChild(welcome);
    let instructions = document.createElement("p");
    instructions.innerHTML =
      "To see your add or edit your products list: </h2> <br> <li>See Product tab</li> <br> To find help: </h2> <br> <li>See Help tab</li>";
    dashdiv.appendChild(instructions);

    // adding everything to the page
    div.appendChild(dashdiv);
  }
}
