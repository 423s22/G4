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

        let url = new URL(window.location.href);
        url.pathname += "database/";

        //let req = new XMLHttpRequest();
        //req.open("GET")

        appDiv.innerHTML = `
        <h1>${url.toString()}</h1>
        `;
    }
}