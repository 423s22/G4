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
                results = await this._getVariationBlockersJSON(parseInt(ctx.query.variationID));
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

    async _getVariationBlockersJSON(variationID) {
        let resultsA = await this._connection.awaitQuery(
            `SELECT excludeVariationB AS exclude FROM VariationBlockers WHERE excludeVariationA = ?`, [variationID]
        );
        let resultsB = await this._connection.awaitQuery(
            `SELECT excludeVariationA AS exclude FROM VariationBlockers WHERE excludeVariationB = ?`, [variationID]
        );
        // TODO: Combine resultsA with resultsB
        return JSON.stringify(resultsA.concat(resultsB));
    }

    async handlePostRequest(ctx) {
        const post = ctx.request.body;

        const requestedOperation = post["operation"];
        let results;
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
                    let isAdding = post["isAdding"];
                    if (isAdding == null) isAdding = true;
                    results = await this._postVariationBlocker(blockerAID, blockerBID, isAdding);
                    break;
                }
        }
        ctx.respond = false;
        ctx.res.statusCode = 200;
        ctx.status = 200;
        ctx.res.write(`${results}`);
        ctx.res.end();
    }

    async _postProduct(id, baseCost, name, owningUser) {
        if (isNaN(id)) {
            let result = await this._connection.awaitQuery(
                `INSERT INTO Products (baseCost, name, owningUser) VALUES (?, ?, ?);`, [baseCost, name, owningUser]
            );
            return JSON.stringify({ "insertedID": result.insertId });
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
            return JSON.stringify({ "insertedID": result.insertId });
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
            return JSON.stringify({ "insertedID": result.insertId });
        } else {
            await this._connection.awaitQuery(
                `UPDATE Variations SET addedCost = ?, name = ?, owningGroup = ? WHERE variationID = ?;`, [addedCost, name, owningGroup, id]
            );
            return JSON.stringify({});
        }
    }

    async _postVariationBlocker(blockerAId, blockerBId, isAdding) {

        if (isAdding) {
            let curBlockers = JSON.parse(await this._getVariationBlockersJSON(blockerAId));
            let blockerExists = false;
            for (let i = 0; i < curBlockers.length; i++) {
                if (curBlockers[i]["exclude"] == blockerBId) {
                    blockerExists = true;
                    break;
                }
            }
            if (blockerExists) return JSON.stringify({});

            let result = await this._connection.awaitQuery(
                `INSERT INTO VariationBlockers (excludeVariationA, excludeVariationB) VALUES (?, ?);`, [blockerAId, blockerBId]
            );
            return JSON.stringify({ "insertedID": result.insertId });

        } else {
            // Removing blocker
            await this._connection.awaitQuery(
                `DELETE FROM VariationBlockers WHERE 
                    (excludeVariationA = ? AND excludeVariationB = ?) OR 
                    (excludeVariationA = ? AND excludeVariationB = ?)`, [blockerAId, blockerBId, blockerBId, blockerAId]);
            return JSON.stringify({});
        }
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