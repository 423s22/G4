import AppState from "./AppState";
export default class SettingState extends AppState {

    constructor(app) {
        super(app);
    }

    onEnable() {}

    onDisable() {}

    onRender(divID) {

        let div = document.getElementById(divID);
        div.innerHTML = "";


        div.innerHTML = "<h1>Settings!</h1>";

    }
}