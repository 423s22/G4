import AppState from "./AppState";

export default class BetaState extends AppState {
    constructor(app) {
        super(app);
        this._productDiv = null;
    }

    onEnable() {
        console.log("Enabled!");
    }

    onDisable() {
        console.log("Disabled!");
    }

    onRender(divID) {
        let appDiv = document.getElementById(divID);

        // Create the product div element
        this._productDiv = document.createElement("div");
        appDiv.appendChild(this._productDiv);
        this._updateProductDiv();

        // Create the button the make a new product
        let newProductBtn = document.createElement("button");
        newProductBtn.type = "button";
        newProductBtn.innerHTML = "Generate Random Product";
        newProductBtn.onclick = () => {
            // TODO: Generate random product
            this._addRandomProduct().then(() => {
                this._updateProductDiv();
            });
        }
        appDiv.appendChild(newProductBtn);

    }

    async _addRandomProduct() {
        let url = new URL(window.location.href);
        url.pathname += "database/";

        let req = new XMLHttpRequest();
        req.open("POST", url.toString());
        req.setRequestHeader("Content-type", "application/json");
        req.onload = () => {
            console.log(req.responseText);
            return true;
        }

        req.send(JSON.stringify({
            "operation": "product",
            "baseCost": Math.floor(Math.random() * 100),
            "name": "Random Product: " + Math.floor(Math.random * 1000),
            "owningUser": 1
        }));
    }

    _updateProductDiv() {
        this._productDiv.innerHTML = "<h1>Loading...</h1>";

        let url = new URL(window.location.href);
        url.pathname += "database/";
        url.searchParams.append("request", "userProducts");
        url.searchParams.append("userID", "1");

        let req = new XMLHttpRequest();
        req.open("GET", url.toString());
        req.onload = () => {
            let responseJSON = JSON.parse(req.responseText);
            let innerHTML = "";
            for (let i = 0; i < responseJSON.length; i++) {
                let id = responseJSON[i]["productID"];
                let baseCost = responseJSON[i]["baseCost"];
                let name = responseJSON[i]["name"];
                innerHTML += "<h1>Id: " + id + " | Name: " + name + " | Base Cost: " + baseCost + "</h1>";
            }
            this._productDiv.innerHTML = innerHTML;
        }
        req.send();
    }
}