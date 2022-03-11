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
            let responseJSON = JSON.parse(req.responseText);
            let innerHTML = "";
            for (let i = 0; i < responseJSON.length; i++) {
                let id = responseJSON[i]["productID"];
                let baseCost = responseJSON[i]["baseCost"];
                let name = responseJSON[i]["name"];
                innerHTML += "<h1>Id: " + id + " | Name: " + name + " | Base Cost: " + baseCost + "</h1>";
            }
            appDiv.innerHTML = innerHTML;
        }

        appDiv.innerHTML = `
        <h1>Loading Data...</h1>
        `;
    }
}