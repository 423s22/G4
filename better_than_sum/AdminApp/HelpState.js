import AppState from "./AppState";
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

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        //div.innerHTML = xmlHttp.responseText;
        const { Remarkable } = require("remarkable");
        this._md = new Remarkable();
        div.innerHTML = this._md.render(xmlHttp.responseText);
      }
    };
    xmlHttp.open(
      "GET",
      "https://raw.githubusercontent.com/423s22/G4/main/Documentation/Dev%20Docs.md",
      true
    );
    xmlHttp.send();
  }
}
