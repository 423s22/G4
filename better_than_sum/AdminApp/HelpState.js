import AppState from "./AppState";

export default class HelpState extends AppState {
  constructor(app) {
    super(app);
    this._renderDiv = null;
  }

  onEnable() {}

  onDisable() {}

  onRender(divID) {
    let div = document.getElementById(divID);

    div.innerHTML = "";
    let helpDiv = document.createElement("div");
    helpDiv.id = "helpDiv";
    div.appendChild(helpDiv);

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        const { Remarkable } = require("remarkable");
        this._md = new Remarkable();
        helpDiv.innerHTML = this._md.render(xmlHttp.responseText);
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
