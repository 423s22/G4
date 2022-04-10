import AppState from "./AppState";

export default class DashboardState extends AppState {
  constructor(app) {
    super(app);
  }

  onEnable() {}

  onDisable() {}

  onRender(divID) {
    let div = document.getElementById(divID);
    div.innerHTML = "";

    div.innerHTML = "";
    let codeHtml =
      "<h1>Welcome, $name!</h1> <h2>To see your add or edit your products list: </h2> <br> <li>See Product tab</li> <br> <h2>To find help: </h2> <br> <li>See Help tab</li> <br> <h2>To see your see or edit your settings information</h2> <br> <li>See Settings tab</li>";
    div.innerHTML = codeHtml;
  }
}
