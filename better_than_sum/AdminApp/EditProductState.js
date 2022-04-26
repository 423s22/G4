import AppState from "./AppState";
import Product from "./BTSDatabase/Product";

export default class EditProductState extends AppState {
    constructor(app) {
        super(app);
        this._product = null;
        this._toRenderTo = null;
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
            div.innerHTML = "";
            let productDetails = document.createElement("div");
            productDetails.classList.add("epsDetailsDiv");

            let productTitle = document.createElement("h1");
            productTitle.innerText = this._product.getName();
            productDetails.appendChild(productTitle);

            let productCost = document.createElement("h2");
            productCost.innerText = "$" + this._product.getBaseCost() / 100;
            productDetails.appendChild(productCost);

            div.appendChild(productDetails);

            let variationGroups = this._product.getVariationGroups();

            let groupsDiv = document.createElement("div");
            groupsDiv.classList.add("epsGroupsDiv");
            div.appendChild(groupsDiv);

            for (let i = 0; i < variationGroups.length; i++) {
                let curGroupDiv = document.createElement("div");
                groupsDiv.appendChild(curGroupDiv);

                let curVariationGroup = variationGroups[i];

                let variationTitle = document.createElement("h1");
                variationTitle.textContent = curVariationGroup.getName();
                curGroupDiv.appendChild(variationTitle);

                let variationsDiv = document.createElement("div");
                variationsDiv.classList.add("epsVariationsDiv");
                curGroupDiv.appendChild(variationsDiv);

                let variations = curVariationGroup.getVariations();
                for (let j = 0; j < variations.length; j++) {
                    let curVariation = variations[j];

                    let curVariationDiv = document.createElement("div");
                    variationsDiv.appendChild(curVariationDiv);

                    let variationTitle = document.createElement("h1");
                    variationTitle.textContent = curVariation.getName();
                    curVariationDiv.appendChild(variationTitle);

                    let variationAddedCost = document.createElement("h2");
                    variationAddedCost.innerText = "$" + curVariation.getAddedCost() / 100;
                    curVariationDiv.appendChild(variationAddedCost);

                    let deleteVariationBtn = document.createElement("button");
                    deleteVariationBtn.textContent = "Delete Variation";
                    deleteVariationBtn.addEventListener("click", (event) => {
                        curVariation.getGroup().deleteVariation(curVariation).then(() => {
                            this.onRender(this._toRenderTo);
                        });
                    });
                    curVariationDiv.appendChild(deleteVariationBtn);

                }

                let newVariationBtn = document.createElement("button");
                newVariationBtn.textContent = "New Variation"
                newVariationBtn.addEventListener("click", (event) => {
                    curVariationGroup.addVariation().then(() => {
                        this.onRender(this._toRenderTo);
                    })
                });
                curGroupDiv.appendChild(newVariationBtn);

                let deleteGroupBtn = document.createElement("button");
                deleteGroupBtn.textContent = "Delete Group";
                deleteGroupBtn.addEventListener("click", (event) => {
                    curVariationGroup.getProduct().deleteVariationGroup(curVariationGroup).then(() => {
                        this.onRender(this._toRenderTo);
                    });
                });
                curGroupDiv.appendChild(deleteGroupBtn);

            }

            let newGroupBtn = document.createElement("button");
            newGroupBtn.textContent = "New Group";
            newGroupBtn.addEventListener("click", (event) => {
                this._product.addVariationGroup().then(() => {
                    this.onRender(this._toRenderTo);
                });
            });
            groupsDiv.appendChild(newGroupBtn);

        }
    }

}