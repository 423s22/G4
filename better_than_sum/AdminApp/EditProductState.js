import AppState from "./AppState";
import Product from "../BTSDatabase/Product";

export default class EditProductState extends AppState {
	constructor(app) {
        this._product = null;
        this._toRenderTo = null;
		super(app);
	}

    /**
     * Sets the active product being edited
     * @param {Product} product 
     */
    setProduct(product) {
        this._product = product;
        this.onRender(this._toRenderTo);
    }

    onEnable() {
        this._product = null;
    }

    onRender(divID) {
        this._toRenderTo = divID;

        let div = document.getElementById(divID);
        if (this._product == null) {
            div.innerHTML = "Loading...";
        } else {

            let productDetails = document.createElement("div");
            productDetails.classList.add("epsDetailsDiv");
            
            let productTitle = document.createElement("h1");
            productTitle.innerText = this._product.getName();
            productDetails.appendChild(productTitle);

            let productCost = document.createElement("h2");
            productCost.innerText = "$" + this._product.getBaseCost()/100;
            productDetails.appendChild(productCost);
            
            div.appendChild(productDetails);

        }
    }

}