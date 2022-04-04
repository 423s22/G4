import AppState from "./AppState";
export default class ProductState extends AppState {

    constructor(app) {
        super(app);
    }

    onEnable() {}

    onDisable() {}

    onRender(divID) {

        let div = document.getElementById(divID);
        div.innerHTML = "";


        div.innerHTML = "<h1>Products!</h1>";

    }

}