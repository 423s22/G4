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

    async getUserProductsJSON(userID) {
        let results = await this._connection.awaitQuery(
            "SELECT Products.productID FROM Products INNER JOIN Users ON Users.userID = Products.owningUser WHERE Users.userID = ?;", [userID]
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