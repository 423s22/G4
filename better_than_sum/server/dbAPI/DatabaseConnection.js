const mysql = require("mysql-await");
import Koa from "koa";

/**
 * Represents a connection to a database, allowing for handeling get, post, and delete requests
 */
export default class DatabaseConnection {
	/**
	 * Creates a new MySQL based connection
	 * @param {string} host the IP of the host MySQL server
	 * @param {string} username the username to login to MySQL with
	 * @param {string} password the password to login to MySQL with
	 * @param {string} database the name of the database to USE
	 */
	constructor(host, username, password, database) {
		this._connection = mysql.createConnection({
			host: host,
			user: username,
			password: password,
			database: database,
		});
	}

	/**
	 * Handles an HTTP GET request and returns the relevant data
	 * @param {Koa.ParameterizedContext} ctx the KoaContext of the request
	 */
	async handleGetRequest(ctx) {
		const requestedData = ctx.query.request;
		let results = null;
		switch (requestedData) {
			case "userProducts":
				results = await this._getUserProductsJSON(parseInt(ctx.query.userID));
				break;
			case "userID":
				results = await this._getUserIDJSON(ctx.query.userName);
				break;
			case "product":
				results = await this._getProductJSON(ctx.query.productID);
				break;
			case "shopifyProduct":
				results = await this._getShopifyProductJSON(parseInt(ctx.query.shopifyID));
				break;
			case "productVariations":
				results = await this._getProductVariationsJSON(
					parseInt(ctx.query.productID)
				);
				break;
			case "productVariationGroups":
				results = await this._getVariationGroupsJSON(
					parseInt(ctx.query.productID)
				);
				break;
			case "variationBlockers":
				results = await this._getVariationBlockersJSON(
					parseInt(ctx.query.variationID)
				);
				break;
		}

		if (results == null) {
			ctx.response.status = 400;
		} else {
			ctx.response.body = results;
			ctx.response.status = 200;
		}
	}

	/**
	 * Loads the JSON of a specificied product
	 * @param {number} productID the database ID of the product
	 * @returns the stringified JSON of the product
	 */
	async _getProductJSON(productID) {
		let results = await this._connection.awaitQuery(
			`
            SELECT * FROM Products 
            WHERE productID = ?;
            `, [productID]
		);
		return JSON.stringify(results);
	}

	/**
	 * Loads the JSON of a specificied product via shopify ID
	 * @param {number} shopifyID the shopify ID of the product
	 * @returns the stringified JSON of the product
	 */
	async _getShopifyProductJSON(shopifyID) {
		let results = await this._connection.awaitQuery(
			`
            SELECT * FROM Products 
            WHERE shopifyID = ?;
            `, [shopifyID]
		);
		return JSON.stringify(results);
	}

	/**
	 * Loads the JSON of all products owned by a user
	 * @param {number} userID the database ID of the owning user
	 * @returns the stringified JSON of the products
	 */
	async _getUserProductsJSON(userID) {
		let results = await this._connection.awaitQuery(
			`
            SELECT Products.* FROM Products 
            INNER JOIN Users ON Users.userID = Products.owningUser 
            WHERE Users.userID = ?;
            `, [userID]
		);
		return JSON.stringify(results);
	}

	/**
	 * Loads the JSON of the ID of a user
	 * @param {string} name the name of the user
	 * @returns the stringified JSON of the user ID
	 */
	async _getUserIDJSON(name) {
		let results = await this._connection.awaitQuery(
			`SELECT userID FROM Users WHERE name = ?`, [name]
		);
		return JSON.stringify(results);
	}

	/**
	 * Loads the JSON of the variations of a product
	 * @param {number} productID the database ID of the product
	 * @returns the stringified JSON of the variations
	 */
	async _getProductVariationsJSON(productID) {
		let results = await this._connection.awaitQuery(
			`SELECT Variations.* FROM Variations 
            INNER JOIN VariationGroups ON VariationGroups.groupID = Variations.owningGroup
            INNER JOIN Products ON Products.productID = VariationGroups.owningProduct
            WHERE Products.productID = ?
            `, [productID]
		);
		return JSON.stringify(results);
	}

	/**
	 * Loads the JSON of the variation groups of a product
	 * @param {number} productID the database ID of the product
	 * @returns the stringified JSON of the variation groups
	 */
	async _getVariationGroupsJSON(productID) {
		let results = await this._connection.awaitQuery(
			`SELECT * FROM VariationGroups WHERE owningProduct = ?`, [productID]
		);
		return JSON.stringify(results);
	}

	/**
	 * Loads the JSON of the blockers of a variation
	 * @param {number} variationID the database ID of the variation
	 * @returns the stringified JSON of the variation's blockers
	 */
	async _getVariationBlockersJSON(variationID) {
		let resultsA = await this._connection.awaitQuery(
			`SELECT excludeVariationB AS exclude FROM VariationBlockers WHERE excludeVariationA = ?`, [variationID]
		);
		let resultsB = await this._connection.awaitQuery(
			`SELECT excludeVariationA AS exclude FROM VariationBlockers WHERE excludeVariationB = ?`, [variationID]
		);
		return JSON.stringify(resultsA.concat(resultsB));
	}

	/**
	 * Handles an HTTP POST request and returns the relevant data about the added object
	 * @param {Koa.ParameterizedContext} ctx the KoaContext of the request
	 */
	async handlePostRequest(ctx) {
		const post = ctx.request.body;
		const requestedOperation = post["operation"];
		let results = null;
		switch (requestedOperation) {
			case "product":
				{
					let id = parseInt(post["productID"]);
					let shopifyID = parseInt(post["shopifyID"]);
					let owningUser = parseInt(post["owningUser"]);
					results = await this._postProduct(id, shopifyID, owningUser);
					break;
				}
			case "variationGroup":
				{
					let id = parseInt(post["groupID"]);
					let name = post["name"];
					let owningProduct = parseInt(post["owningProduct"]);
					results = await this._postVariationGroup(id, name, owningProduct);
					break;
				}
			case "variation":
				{
					let id = parseInt(post["variationID"]);
					let addedCost = parseInt(post["addedCost"]);
					let name = post["name"];
					let owningGroup = parseInt(post["owningGroup"]);
					results = await this._postVariation(id, addedCost, name, owningGroup);
					break;
				}
			case "variationBlocker":
				{
					let blockerAID = parseInt(post["blockerAID"]);
					let blockerBID = parseInt(post["blockerBID"]);
					results = await this._postVariationBlocker(blockerAID, blockerBID);
					break;
				}
		}

		if (results == null) {
			ctx.response.status = 400;
		} else {
			ctx.response.body = results;
			ctx.response.status = 200;
		}
	}

	/**
	 * Creates or updates a product in the database
	 * @param {number} id the database ID of the product. If empty, creates a new product
	 * @param {number} shopifyID the ID of the shopify product to base this product on
	 * @param {number} owningUser the ID of the user who owns this product
	 * @returns the stringified JSON denoting the inserted ID if a new product was created
	 */
	async _postProduct(id, shopifyID, owningUser) {
		if (isNaN(id)) {
			let result = await this._connection.awaitQuery(
				`INSERT INTO Products (shopifyID, owningUser) VALUES (?, ?);`, [shopifyID, owningUser]
			);
			return JSON.stringify({ insertedID: result.insertId });
		} else {
			await this._connection.awaitQuery(
				`UPDATE Products SET shopifyID = ?, owningUser = ? WHERE productID = ?;`, [shopifyID, owningUser, id]
			);
			return JSON.stringify({});
		}
	}

	/**
	 * Creates or updates a variation group in the database
	 * @param {number} id the database ID of the group. If empty, creates a new group
	 * @param {string} name the name of the group
	 * @param {number} owningProduct the ID of the product who owns this group
	 * @returns the stringified JSON denoting the inserted ID if a new group was created
	 */
	async _postVariationGroup(id, name, owningProduct) {
		if (isNaN(id)) {
			let result = await this._connection.awaitQuery(
				`INSERT INTO VariationGroups (name, owningProduct) VALUES (?, ?);`, [name, owningProduct]
			);
			return JSON.stringify({ insertedID: result.insertId });
		} else {
			await this._connection.awaitQuery(
				`UPDATE VariationGroups SET name = ?, owningProduct = ? WHERE groupID = ?;`, [name, owningProduct, id]
			);
			return JSON.stringify({});
		}
	}

	/**
	 * Creates or updates a variation in the database
	 * @param {number} id the database ID of the variation. If empty, creates a new variation
	 * @param {number} addedCost the added cost, in cents, of the variation
	 * @param {number} owningGroup the ID of the group who owns this variation
	 * @returns the stringified JSON denoting the inserted ID if a new variation was created
	 */
	async _postVariation(id, addedCost, name, owningGroup) {
		if (isNaN(id)) {
			let result = await this._connection.awaitQuery(
				`INSERT INTO Variations (addedCost, name, owningGroup) VALUES (?, ?, ?);`, [addedCost, name, owningGroup]
			);
			return JSON.stringify({ insertedID: result.insertId });
		} else {
			await this._connection.awaitQuery(
				`UPDATE Variations SET addedCost = ?, name = ?, owningGroup = ? WHERE variationID = ?;`, [addedCost, name, owningGroup, id]
			);
			return JSON.stringify({});
		}
	}

	/**
	 * Creates a variation blocker in the database
	 * @param {number} blockerAId the database ID of the first variation
	 * @param {number} blockerBId the database ID of the second variation
	 * @returns the stringified JSON denoting if a new blocker was created
	 */
	async _postVariationBlocker(blockerAId, blockerBId) {
		let curBlockers = JSON.parse(
			await this._getVariationBlockersJSON(blockerAId)
		);
		let blockerExists = false;
		for (let i = 0; i < curBlockers.length; i++) {
			if (curBlockers[i]["exclude"] == blockerBId) {
				blockerExists = true;
				break;
			}
		}
		if (blockerExists) return JSON.stringify({});

		await this._connection.awaitQuery(
			`INSERT INTO VariationBlockers (excludeVariationA, excludeVariationB) VALUES (?, ?);`, [blockerAId, blockerBId]
		);
		return JSON.stringify({ inserted: true });
	}

	/**
	 * Handles an HTTP DELETE request and returns if the requested object was deleted
	 * @param {Koa.ParameterizedContext} ctx the KoaContext of the request
	 */
	async handleDeleteRequest(ctx) {
		const requestedOperation = ctx.query.operation;
		let results = null;
		switch (requestedOperation) {
			case "product":
				{
					let id = parseInt(ctx.query.productID);
					results = await this._deleteProduct(id);
					break;
				}
			case "variationGroup":
				{
					let id = parseInt(ctx.query.groupID);
					results = await this._deleteVariationGroup(id);
					break;
				}
			case "variation":
				{
					let id = parseInt(ctx.query.variationID);
					results = await this._deleteVariation(id);
					break;
				}
			case "variationBlocker":
				{
					let blockerAID = parseInt(ctx.query.blockerAID);
					let blockerBID = parseInt(ctx.query.blockerBID);
					results = await this._deleteVariationBlocker(blockerAID, blockerBID);
					break;
				}
		}

		if (results == null) {
			ctx.response.status = 400;
		} else {
			ctx.response.body = results;
			ctx.response.status = 200;
		}
	}

	/**
	 * Deletes a product from the database
	 * @param {number} id the database ID of the product
	 * @returns the stringified JSON denoting if the product was deleted, or if the ID was invalid
	 */
	async _deleteProduct(id) {
		if (isNaN(id)) {
			return JSON.stringify({ message: "Invalid ID" });
		} else {
			await this._connection.awaitQuery(
				`DELETE FROM Products WHERE productID = ?;`, [id]
			);
			return JSON.stringify({ message: "Successfully deleted" });
		}
	}

	/**
	 * Deletes a variation group from the database
	 * @param {number} id the database ID of the group
	 * @returns the stringified JSON denoting if the group was deleted, or if the ID was invalid
	 */
	async _deleteVariationGroup(id) {
		if (isNaN(id)) {
			return JSON.stringify({ message: "Invalid ID" });
		} else {
			await this._connection.awaitQuery(
				`DELETE FROM VariationGroups WHERE groupID = ?;`, [id]
			);
			return JSON.stringify({ message: "Successfully deleted" });
		}
	}

	/**
	 * Deletes a variation from the database
	 * @param {number} id the database ID of the variation
	 * @returns the stringified JSON denoting if the variation was deleted, or if the ID was invalid
	 */
	async _deleteVariation(id) {
		if (isNaN(id)) {
			return JSON.stringify({ message: "Invalid ID" });
		} else {
			await this._connection.awaitQuery(
				`DELETE FROM Variations WHERE variationID = ?;`, [id]
			);
			return JSON.stringify({ message: "Successfully deleted" });
		}
	}

	/**
	 * Deletes a variation blocker from the database
	 * @param {number} blockerAID the ID of the first variation
	 * @param {number} blockerBID the ID of the second variation
	 * @returns the stringified JSON denoting if the blocker was deleted, or if either of the IDs were invalid
	 */
	async _deleteVariationBlocker(blockerAID, blockerBID) {
		if (isNaN(blockerAID) || isNaN(blockerBID)) {
			return JSON.stringify({ message: "Invalid ID" });
		} else {
			await this._connection.awaitQuery(
				`DELETE FROM VariationBlockers WHERE 
                (excludeVariationA = ? AND excludeVariationB = ?) OR 
                (excludeVariationA = ? AND excludeVariationB = ?);`, [blockerAID, blockerBID, blockerBID, blockerAID]
			);
			return JSON.stringify({ message: "Successfully deleted" });
		}
	}

	/**
	 * Attempts to create a new user record for a shop
	 * @param {string} shopName the name of the shop
	 * @returns {Promise<number>} the ID of the user record
	 */
	async handleShopConnect(shopName) {
		let results = JSON.parse(await this._getUserIDJSON(shopName));
		if (results.length == 0) {
			let queryResult = await this._connection.awaitQuery(
				`INSERT INTO Users (name) VALUES (?);`, [shopName]
			);
			return queryResult.insertId;
		} else {
			return results[0]["userID"];
		}
	}

	/**
	 * Attempts to connect to the database
	 * @returns {Promise<boolean>} true when successfully connected, or false if an error occurred
	 */
	async connect() {
		if (this._isConnected) return true;
		let err = await this._connection.awaitConnect();

		if (err) {
			this._lastError = err;
			this._isConnected = false;
		} else {
			this._lastError = null;
			this._isConnected = true;
		}
		return this._isConnected;
	}

	/**
	 * Disconnects from the database
	 */
	async disconnect() {
		await this._connection.awaitEnd();
		this._isConnected = false;
	}
}