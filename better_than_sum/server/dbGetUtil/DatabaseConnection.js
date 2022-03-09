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

    async handleRequest(ctx) {
        ctx.respond = false;
        const requestedData = ctx.query.request;
        switch (requestedData) {
            case "userProducts":
                const products = await this._getUserProducts(parseInt(ctx.query.userID));
                ctx.res.write(`${JSON.stringify(products)}`);
                ctx.res.end();
                break;
        }
        ctx.res.statusCode = 200;
    }

    async _getUserProducts(userID) {
        let results = await this._connection.awaitQuery(
            "SELECT Products.* FROM Products INNER JOIN Users ON Users.userID = Products.owningUser WHERE Users.userID = ?;", [userID]
        );
        return results;
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