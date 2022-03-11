const DatabaseConnection = require("./DatabaseConnection");

test("Tests database connection", () => {
    let dbConn = new DatabaseConnection("localhost", "testUser", "testPassword", "G4db");
    let id = JSON.parse(dbConn._getUserIDJSON("Test User"))["userID"];
    expect(id).toBe(1);
});