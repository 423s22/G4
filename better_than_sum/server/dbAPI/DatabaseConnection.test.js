import DatabaseConnection from "./DatabaseConnection";

test("Tests database connection", () => {
    let dbConn = new DatabaseConnection("localhost", "testUser", "testPassword", "G4db");
    let id = JSON.parse(dbConn._getUserIDJSON("Test User"))["userID"];
    expect(id).toBe(1);
    // Add comment for another push
});