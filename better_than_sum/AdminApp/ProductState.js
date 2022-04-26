import AppState from "./AppState";
import AppStateType from "./AppStateType";
export default class ProductState extends AppState {
	constructor(app) {
		super(app);
	}

	onEnable() { }

	onDisable() { }

	onRender(divID) {
		let div = document.getElementById(divID);

		div.innerHTML = "Loading...";

		this._app.getShopifyAPIConnection().getProductsJSON().then((shopifyProducts) => {
			this._app.getDatabaseConnection().getUserProducts(this._app.getShopifyAPIConnection()).then((dbProducts) => {
				div.innerHTML = "";
				for (let i = 0; i < shopifyProducts["products"].length; i++) {
					let curShopifyProduct = shopifyProducts["products"][i];

					let associatedBTSProduct = null;
					for (let j = 0; j < dbProducts.getProducts().length; j++) {
						if (dbProducts.getProducts()[j].getShopifyID() == curShopifyProduct["id"]) {
							associatedBTSProduct = dbProducts.getProducts()[j];
							break;
						}
					}

					if (associatedBTSProduct == null) {

						let unusedProductDiv = document.createElement("div");
						unusedProductDiv.classList.add("psUnusedProductDiv");

						let productTitle = document.createElement("h1");
						productTitle.innerText = curShopifyProduct["title"];
						unusedProductDiv.appendChild(productTitle);

						let productCost = document.createElement("h2");
						productCost.innerText = "$" + curShopifyProduct["variants"][0]["price"];
						unusedProductDiv.appendChild(productCost);

						let addProductBtn = document.createElement("button");
						addProductBtn.textContent = "Add BTS Product";
						addProductBtn.addEventListener("click", (event) => {
							this._app.getDatabaseConnection().createNewProduct(curShopifyProduct).then(
								(value) => {
									this._app.setState(AppStateType.EditProductState);
									this._app.getState().setProduct(value);
								}
							)
						});
						unusedProductDiv.appendChild(addProductBtn);

						div.appendChild(unusedProductDiv);

					} else {
						let btsProductDiv = document.createElement("div");
						btsProductDiv.classList.add("psBTSProductDiv");

						let productTitle = document.createElement("h1");
						productTitle.innerText = associatedBTSProduct.getName();
						btsProductDiv.appendChild(productTitle);

						let productCost = document.createElement("h2");
						productCost.innerText = "$" + (associatedBTSProduct.getBaseCost() / 100);
						btsProductDiv.appendChild(productCost);

						let editProductBtn = document.createElement("button");
						editProductBtn.textContent = "Edit BTS Product";
						editProductBtn.addEventListener("click", (event) => {
							this._app.setState(AppStateType.EditProductState);
							this._app.getState().setProduct(value);
						});
						btsProductDiv.appendChild(associatedBTSProduct);

						div.appendChild(btsProductDiv);
					}


				}
			});


		});

	}

}
