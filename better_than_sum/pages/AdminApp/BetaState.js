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
        url.searchParams.append("request", "userProducts");
        url.searchParams.append("userID", "1");

        let req = new XMLHttpRequest();
        req.open("GET", url.toString());
        req.onload = function(e) {
            console.log(req.responseText);
        }
        req.send();

        appDiv.innerHTML = `
        <h1>${url.toString()}</h1>
        `;
    }
}