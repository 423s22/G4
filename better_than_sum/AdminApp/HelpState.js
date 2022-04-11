import AppState from "./AppState";
//import styles from "./../pages/css/Help.css"

export default class HelpState extends AppState {
  constructor(app) {
    super(app);
    this._renderDiv = null;
  }

  onEnable() {}

  onDisable(divID) {
    let div = document.getElementById(divID);
    div.classList.remove("helpState");
  }

  onRender(divID) {
    let div = document.getElementById(divID);

    div.innerHTML = "";
    div.classList.add("helpState");

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        const { Remarkable } = require("remarkable");
        this._md = new Remarkable();
        div.innerHTML = this._md.render(xmlHttp.responseText);
      }
    };
    xmlHttp.open(
      "GET",
      "https://raw.githubusercontent.com/423s22/G4/main/Documentation/User%20Docs.md",
      true
    );
    xmlHttp.send();
  }
}
