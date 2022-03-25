import DatabaseConnection from "./DatabaseConnection";

test("Tests database connection", () => {
    let dbConn = new DatabaseConnection("127.0.0.1", "root", "rootPassword", "G4db");
    return dbConn.connect().then(() => {
        return dbConn._getUserIDJSON("Test User").then((results) => {
            let id = JSON.parse(results)["userID"];
            console.log(results);
            expect(id).toBe(1);
            return dbConn.disconnect();
        });
    });

});