import AppState from "./AppState";
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

						console.log(curShopifyProduct);

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

						console.log(curShopifyProduct);

						div.appendChild(btsProductDiv);
					}


				}
			});


		});

	}

}
