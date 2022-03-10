const mysql = require("mysql-await");

export default class DatabaseConnection {
    constructor(host, username, password, database) {
        this._connection = mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database: database,
        });
    }

    async handleGetRequest(ctx) {
        ctx.respond = false;
        const requestedData = ctx.query.request;
        let results;
        switch (requestedData) {
            case "userProducts":
                results = await this._getUserProductsJSON(parseInt(ctx.query.userID));
                break;
            case "userID":
                results = await this._getUserIDJSON(ctx.query.userName);
                break;
            case "productVariations":
                results = await this._getProductVariationsJSON(parseInt(ctx.query.productID));
                break;
            case "productVariationGroups":
                results = await this._getVariationGroupsJSON(parseInt(ctx.query.productID));
                break;
            case "variationBlockers":
                results = await this._getVariationBlockers(parseInt(ctx.query.variationID));
                break;
        }
        ctx.res.write(`${results}`);
        ctx.res.end();
        ctx.res.statusCode = 200;
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

    async _getVariationBlockers(variationID) {
        let resultsA = await this._connection.awaitQuery(
            `SELECT excludeVariationB AS exclude FROM VariationBlockers WHERE excludeVariationA = ?`, [variationID]
        );
        let resultsB = await this._connection.awaitQuery(
            `SELECT excludeVariationA AS exclude FROM VariationBlockers WHERE excludeVariationB = ?`, [variationID]
        );
        // TODO: Combine resultsA with resultsB
        return JSON.stringify(resultsA.concat(resultsB));
    }

    async connect() {
        await this._connection.awaitConnect(async function(err) {
            if (err) {
                this._lastError = err;
                this._isConnected = false;
            } else {
                this._lastError = null;
                this._isConnected = true;
            }
        });
    }
}