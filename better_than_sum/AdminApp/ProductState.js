import AppState from "./AppState";
export default class ProductState extends AppState {
	constructor(app) {
		super(app);
	}

	onEnable() { }

	onDisable() { }

	onRender(divID) {
		let div = document.getElementById(divID);

		div.innerHTML = "";
		div.innerHTML = "<h1>Products!</h1>";

		// Temporary for testing db conn
		let currentProducts = ["Phone", "Ipad", "Photo"];
		for (let i = 0; i < currentProducts.length; i++) {
			// Create an button which will allow for the drop down
			let accordian = document.createElement("button");
			let text = document.createTextNode(currentProducts[i]);
			// Allow for calling in css
			accordian.classList = "accordian";
			accordian.id = currentProducts[i];
			// Set button text
			accordian.appendChild(text);
			div.appendChild(accordian);

			let panel = document.createElement("div");
			panel.classList = "panel";
			let paragraph = document.createElement("p");
			var paratext = document.createTextNode(
				"Test Text here for the feature release."
			);
			paragraph.appendChild(paratext);
			panel.appendChild(paragraph);
			div.appendChild(panel);

			accordian.addEventListener("click", (event) => {
				/* Toggle between adding and removing the "active" class,
				to highlight the button that controls the panel */
				accordian.classList.toggle("active");

				/* Toggle between hiding and showing the active panel */
				if (panel.style.display === "block") {
					panel.style.display = "none";
				} else {
					panel.style.display = "block";
				}
			});
		}

		this._app.getShopifyAPIConnection().getProductsJSON().then((products) => {

			for (let i = 0; i < products["products"].length; i++) {
				let curProduct = products["products"][i];

				let productDiv = document.createElement("div");
				div.appendChild(productDiv);

				let productTitle = document.createElement("h3");
				productTitle.textContent = curProduct["title"];
				productDiv.appendChild(productTitle);

				let addProductBtn = document.createElement("button");
				addProductBtn.textContent = "Add Product";
				addProductBtn.addEventListener("click", (e) => {
					this._app.getDatabaseConnection().createNewProduct(curProduct).then((product) => {
						console.log("Added Product!");
						console.log(product);
					});
				});
				productDiv.appendChild(addProductBtn);

			}
		});

	}

}
