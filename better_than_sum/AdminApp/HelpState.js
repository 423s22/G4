import AppState from "./AppState";
import "./../../Documentation/User Docs.md";
export default class HelpState extends AppState {
  constructor(app) {
    super(app);
  }
  onEnable() {}

  onDisable() {}

  onRender(divID) {
    let div = document.getElementById(divID);
    div.innerHTML = "";

    div.innerHTML = "<h1>Help!</h1>";
  }
}
