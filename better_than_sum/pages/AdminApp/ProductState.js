import AppState from "./AppState";
export default class ProductState extends AppState {


    onRender(divID) {

        let div = document.getElementById(divID);
        div.innerHTML = "";


        div.innerHTML = "<h1>Products!</h1>";

    }

}