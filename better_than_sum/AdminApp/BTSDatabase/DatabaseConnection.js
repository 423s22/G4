import ShopifyApiConnection from "../ShopifyAPI/ShopifyAPIConnection";
import Product from "./Product";
import ProductList from "./ProductList";
import Variation from "./Variation";
import VariationGroup from "./VariationGroup";

export default class DatabaseConnection {
	/**
	 * Creates a new connection to the BTS Database API
	 * @param {string} shopName the name of the shop
	 * @param {string} baseURL the URL to make the http requests to
	 */
	constructor(shopName, baseURL = null) {
		if (baseURL == null) this._baseURL = new URL(window.location.href);
		else this._baseURL = new URL(baseURL);

		this._baseURL.pathname += "database/";

		this._executeGetRequest("userID", { userName: shopName }).then((value) => {
			this._userID = value[0]["userID"];
		});
	}

	/**
	 * Retrieves all the products owned by a user
	 * @param {ShopifyApiConnection} shopifyAPI the connection to shopify api
	 * @returns the product list
	 */
	async getUserProducts(shopifyAPI) {
		let shopifyProducts = (await shopifyAPI.getProductsJSON())["products"];
		let responseJSON = await this._executeGetRequest("userProducts", {
			userID: this._userID,
		});
		let products = [];
		for (let i = 0; i < responseJSON.length; i++) {
			let shopifyID = responseJSON[i]["shopifyID"];

			// Find the associated shopify product
			let shopifyProduct = null;
			for (let j = 0; j < shopifyProducts.length; j++) {
				if (shopifyProducts[j]["id"] == shopifyID) {
					shopifyProduct = shopifyProducts[j];
					break;
				}
			}

			let id = responseJSON[i]["productID"];
			products.push(new Product(id, shopifyProduct, this));
		}

		// Clusters the generation of products, and waits for them all to complete
		let toComplete = [];
		for (let i = 0; i < products.length; i++) {

			let cluster = async function (obj) {
				await obj._generateVariationGroups(products[i]);
				await obj._generateVariations(products[i]);
				await obj._generateBlockers(products[i]);
			};
			toComplete.push(cluster(this));
		}

		await Promise.all(toComplete);

		return new ProductList(products, this);
	}

	/**
	 * Reloads a product. This should not be called directly, but is called via Product::refresh
	 * @param {Product} product
	 */
	async reloadProduct(product) {
		let responseJSON = await this._executeGetRequest("product", {
			productID: product.getID(),
		});

		product.setBaseCost(responseJSON["baseCost"]);
		product.setName(responseJSON["name"]);

		await this._generateVariationGroups(product);
		await this._generateVariations(product);
		await this._generateBlockers(product);
	}

	/**
	 * Generates the variation groups for a product by loading them from the database
	 * @param {Product} product the product to generate the groups for
	 */
	async _generateVariationGroups(product) {
		let groups = await this._executeGetRequest("productVariationGroups", {
			productID: product.getID(),
		});

		for (let i = 0; i < groups.length; i++) {
			let group = groups[i];
			product.loadVariationGroup(
				new VariationGroup(group.groupID, product, group.name, this)
			);
		}
	}

	/**
	 * Generates the variations for a product by loading them from the database
	 * @param {Product} product the product to generate the groups for
	 */
	async _generateVariations(product) {
		let variations = await this._executeGetRequest("productVariations", {
			productID: product.getID(),
		});

		for (let i = 0; i < variations.length; i++) {
			let variation = variations[i];
			let varGroup = product.getVariationGroupByID(variation.owningGroup);
			varGroup.loadVariation(
				new Variation(
					variation.variationID,
					varGroup,
					variation.addedCost,
					variation.name,
					this
				)
			);
		}
	}

	/**
	 * Generates the variation blockers for a product by loading them from the database
	 * @param {Product} product the product to generate the groups for
	 */
	async _generateBlockers(product) {
		for (let i = 0; i < product.getVariationGroups().length; i++) {
			let curGroup = product.getVariationGroups()[i];
			for (let j = 0; j < curGroup.getVariations().length; j++) {
				let curVariation = curGroup.getVariations()[j];
				this._executeGetRequest("variationBlockers", {
					variationID: curVariation.getID(),
				}).then((result) => {
					for (let k = 0; k < result.length; k++) {
						let curBlocker = product.getVariationByID(result[k]["exclude"]);
						if (curBlocker != null) {
							curVariation.loadBlocker(curBlocker);
						}
					}
				});
			}
		}
	}

	/**
	 * Creates a new empty product based on an existing shopify product
	 * @param {JSON} shopifyProduct the JSON of the shopify product to base this on
	 * @returns the created Product
	 */
	async createNewProduct(shopifyProduct) {
		let productID = (
			await this._executePostRequest({
				operation: "product",
				shopifyID: shopifyProduct["id"],
				owningUser: this._userID,
			})
		)["insertedID"];

		return new Product(productID, shopifyProduct, this);
	}

	/**
	 * Creates a new empty variation group
	 * @param {Product} product the product that owns the group
	 * @returns the created VariationGroup
	 */
	async createNewVariationGroup(product) {
		let groupID = (
			await this._executePostRequest({
				operation: "variationGroup",
				name: "",
				owningProduct: product.getID(),
			})
		)["insertedID"];

		return new VariationGroup(groupID, product, "", this);
	}

	/**
	 * Creates a new empty variation
	 * @param {VariationGroup} variationGroup the group that owns the variation
	 * @returns the new Variation
	 */
	async createNewVariation(variationGroup) {
		let variationID = (
			await this._executePostRequest({
				operation: "variation",
				name: "",
				addedCost: 0,
				owningGroup: variationGroup.getID(),
			})
		)["insertedID"];

		return new Variation(variationID, variationGroup, 0, "", this);
	}

	/**
	 * Adds a new variation blocker between A and B
	 * @param {Variation} variationA
	 * @param {Variation} variationB
	 */
	async createNewBlocker(variationA, variationB) {
		await this._executePostRequest({
			operation: "variationBlocker",
			blockerAID: variationA.getID(),
			blockerBID: variationB.getID(),
		});
	}

	/**
	 * Saves an existing product to the database.
	 * Should not be called directly, but via Product::save
	 * @param {Product} product the product to be saved
	 * @returns a promise that completes when the product is saved
	 */
	async saveProduct(product) {
		let promises = [];

		if (!product.isSaved()) {
			promises.push(
				this._executePostRequest({
					operation: "product",
					productID: product.getID(),
					shopifyID: product.getShopifyID(),
					owningUser: this._userID,
				})
			);

			let varGroups = product.getVariationGroups();
			for (let i = 0; i < varGroups.length; i++) {
				let curGroup = varGroups[i];

				promises.push(
					this._executePostRequest({
						operation: "variationGroup",
						groupID: curGroup.getID(),
						name: curGroup.getName(),
						owningProduct: product.getID(),
					})
				);

				let variations = curGroup.getVariations();

				for (let j = 0; j < variations.length; j++) {
					let curVariation = variations[j];

					promises.push(
						this._executePostRequest({
							operation: "variation",
							variationID: curVariation.getID(),
							name: curVariation.getName(),
							addedCost: curVariation.getAddedCost(),
							owningGroup: curGroup.getID(),
						})
					);
				}
			}
		}
		await Promise.all(promises);
	}

	/**
	 * Deletes a product from the database, and therefore all associated data.
	 * Ensure any references to the product are also removed once this call is finished.
	 * @param {Product} product the product to be removed
	 */
	async deleteProduct(product) {
		await this._executeDeleteRequest("product", { "productID": product.getID() });
	}

	/**
	 * Deletes a variation group from the database, and therefore all associated variations
	 * @param {VariationGroup} variationGroup the variation group to be removed
	 */
	async deleteVariationGroup(variationGroup) {
		await this._executeDeleteRequest("variationGroup", { "groupID": variationGroup.getID() });
	}

	/**
	 * Deletes a variation from the database, and therefore any blockers that reference it
	 * @param {Variation} variation the variation to be removed
	 */
	async deleteVariation(variation) {
		await this._executeDeleteRequest("variation", { "variationID": variation.getID() });
	}

	/**
	 * Deletes a variation blocker from the database between the two provided variations.
	 * The order of the variations does not matter
	 * @param {Variation} variationA one variation
	 * @param {Variation} variationB the other variation
	 */
	async deleteBlocker(variationA, variationB) {
		await this._executeDeleteRequest("variationBlocker", { "blockerAID": variationA.getID(), "blockerBID": variationB.getID() });
	}

	/**
	 * Executes a GET request to the BTS API with the given request type and data
	 * @param {string} request the request type
	 * @param {JSON} data the data used to fill in the remaining query parameters
	 * @returns the JSON data of the response
	 */
	async _executeGetRequest(request, data = {}) {
		let url = new URL(this._baseURL);
		url.searchParams.append("request", request);
		for (const key in data) {
			url.searchParams.append(key, data[key]);
		}

		let promise = new Promise((resolve, reject) => {
			let req = new XMLHttpRequest();
			req.onreadystatechange = () => {
				if (req.readyState == 4) {
					resolve(JSON.parse(req.responseText));
				}
			};

			req.open("GET", url.toString());
			req.send();
		});

		return promise;
	}

	/**
	 * Executes a POST request to the BTS API with the given data
	 * @param {JSON} data the data sent to the API
	 * @returns the JSON data of the response
	 */
	async _executePostRequest(data) {
		let promise = new Promise((resolve, reject) => {
			let url = new URL(this._baseURL);
			let req = new XMLHttpRequest();
			req.onreadystatechange = () => {
				if (req.readyState == 4) {
					resolve(JSON.parse(req.responseText));
				}
			};
			req.open("POST", url.toString());
			req.setRequestHeader("Content-Type", "application/json");
			req.send(JSON.stringify(data));
		});

		return promise;
	}

	/**
	 * Executes a DELETE request to the BTS API with the given request type and data
	 * @param {string} operation the operation type for deleting
	 * @param {JSON} data the data used to fill in the remaining query parameters
	 * @returns the JSON data of the response
	 */
	async _executeDeleteRequest(operation, data = {}) {
		let url = new URL(this._baseURL);
		url.searchParams.append("operation", operation);
		for (const key in data) {
			url.searchParams.append(key, data[key]);
		}

		let promise = new Promise((resolve, reject) => {
			let req = new XMLHttpRequest();
			req.onreadystatechange = () => {
				if (req.readyState == 4) {
					resolve(JSON.parse(req.responseText));
				}
			};

			req.open("DELETE", url.toString());
			req.send();
		});

		return promise;
	}

}
