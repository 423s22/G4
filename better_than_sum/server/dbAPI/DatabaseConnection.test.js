import DatabaseConnection from "./DatabaseConnection";

test("Tests database connection", (done) => {
    let dbConn = new DatabaseConnection("127.0.0.1", "root", "rootPassword", "G4db");
    dbConn._getUserIDJSON("Test User").then((results) => {
        let id = JSON.parse(results)["userID"];
        expect(id).toBe(1);
        done();
    });
});