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

    async _getProductJSON(productID) {
        let results = await this._connection.awaitQuery(
            `
            SELECT * FROM Products 
            WHERE productID = ?;
            `, [productID]
        );
        return JSON.stringify(results);
    }

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

    async _getUserIDJSON(name) {
        let results = await this._connection.awaitQuery(
            `SELECT userID FROM Users WHERE name = ?`, [name]
        );
        return JSON.stringify(results);
    }

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

    async _getVariationGroupsJSON(productID) {
        let results = await this._connection.awaitQuery(
            `SELECT * FROM VariationGroups WHERE owningProduct = ?`, [productID]
        );
        return JSON.stringify(results);
    }

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
                    let baseCost = parseInt(post["baseCost"]);
                    let name = post["name"];
                    let owningUser = parseInt(post["owningUser"]);
                    results = await this._postProduct(id, baseCost, name, owningUser);
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

    async _postProduct(id, baseCost, name, owningUser) {
        if (isNaN(id)) {
            let result = await this._connection.awaitQuery(
                `INSERT INTO Products (baseCost, name, owningUser) VALUES (?, ?, ?);`, [baseCost, name, owningUser]
            );
            return JSON.stringify({ insertedID: result.insertId });
        } else {
            await this._connection.awaitQuery(
                `UPDATE Products SET baseCost = ?, name = ?, owningUser = ? WHERE productID = ?;`, [baseCost, name, owningUser, id]
            );
            return JSON.stringify({});
        }
    }

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

    async handleShopConnect(shopName) {
        let results = JSON.parse(await this._getUserIDJSON(shopName));
        if (results.length == 0) {
            await this._connection.awaitQuery(
                `INSERT INTO Users (name) VALUES (?);`, [shopname]
            );
        }
    }

    /**
     * Attempts to connect to the database
     * @returns true when successfully connected, or false if an error occurred
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