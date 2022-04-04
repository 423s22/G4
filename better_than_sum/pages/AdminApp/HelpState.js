import AppState from "./AppState";
export default class HelpState extends AppState {
    onRender(divID) {

        let div = document.getElementById(divID);
        div.innerHTML = "";


        div.innerHTML = "<h1>Help!</h1>";

    }
}