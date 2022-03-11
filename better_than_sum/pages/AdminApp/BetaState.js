import AppState from "./AppState";

export default class BetaState extends AppState {
  constructor(app) {
    super(app);
  }

  onEnable() {
    console.log("Enabled!");
  }

  onDisable() {
    console.log("Disabled!");
  }

  onRender(divID) {
    let appDiv = document.getElementById(divID);
    appDiv.innerHTML = `
        <h1>Welcome to Better than Sum</h1>
        `;
  }
}
