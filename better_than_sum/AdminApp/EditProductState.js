import AppState from "./AppState";
import Product from "./BTSDatabase/Product";

export default class EditProductState extends AppState {
    constructor(app) {
        super(app);
        this._product = null;
        this._toRenderTo = null;
        this._saveStatusDiv = null;
        this._saving = false;
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

            this._saveStatusDiv = document.createElement("div");
            this._saveStatusDiv.classList.add("epsSaveStatusDiv");
            div.appendChild(this._saveStatusDiv);

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

                let variationTitleInput = document.createElement("input");
                variationTitleInput.type = "text";
                variationTitleInput.value = curVariationGroup.getName();
                variationTitleInput.addEventListener("change", () => {
                    curVariationGroup.setName(variationTitleInput.value);
                    this._updateSaveStatus();
                });
                curGroupDiv.appendChild(variationTitleInput);

                let variationsDiv = document.createElement("div");
                variationsDiv.classList.add("epsVariationsDiv");
                curGroupDiv.appendChild(variationsDiv);

                let variations = curVariationGroup.getVariations();
                for (let j = 0; j < variations.length; j++) {
                    let curVariation = variations[j];

                    let curVariationDiv = document.createElement("div");
                    variationsDiv.appendChild(curVariationDiv);

                    let variationTitleInput = document.createElement("input");
                    variationTitleInput.type = "text";
                    variationTitleInput.value = curVariation.getName();
                    variationTitleInput.addEventListener("change", (event) => {
                        curVariation.setName(variationTitleInput.value);
                        this._updateSaveStatus();
                    });
                    curVariationDiv.appendChild(variationTitleInput);

                    let variationAddedCost = document.createElement("h2");
                    variationAddedCost.innerText = "$";
                    curVariationDiv.appendChild(variationAddedCost);

                    let variationAddedCostInput = document.createElement("input");
                    variationAddedCostInput.type = "text";
                    variationAddedCostInput.value = (curVariation.getAddedCost() / 100).toFixed(2);
                    variationAddedCostInput.addEventListener("change", (evnet) => {
                        let newCost = parseFloat(variationAddedCostInput.value);
                        if (isNaN(newCost)) {
                            newCost = 0;
                        }
                        newCost *= 100;
                        newCost = parseInt(newCost);
                        curVariation.setAddedCost(newCost);
                        variationAddedCostInput.value = (curVariation.getAddedCost() / 100).toFixed(2);
                        this._updateSaveStatus();
                    });

                    variationAddedCost.appendChild(variationAddedCostInput);


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

            let saveProductBtn = document.createElement("button");
            saveProductBtn.textContent = "Save Product Changes";
            saveProductBtn.addEventListener("click", (event) => {
                this._saving = true;
                this._updateSaveStatus();
                this._product.save().then(() => {
                    this._saving = false;
                    this._updateSaveStatus();
                });
            });
            groupsDiv.appendChild(saveProductBtn);

        }
        this._updateSaveStatus();
    }


    _updateSaveStatus() {
        
        this._saveStatusDiv.innerHTML = "";

        if (!this._product.isSaved()) {
            if (!this._saving) {
                this._saveStatusDiv.innerHTML = "<h1>You have unsaved changes!</h1>";
            } else {
                this._saveStatusDiv.innerHTML = "<h1>Saving...<h1>";
            }
        } else {
            this._saveStatusDiv.innerHTML = "<h1>All changes saved!<h1>";
        }

    }


}